import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NodeStatusBadge } from '../common/Badge';
import {
  Cpu,
  Radio,
  Sliders,
  RotateCcw,
  Zap,
  Volume2,
  VolumeX,
  Sun,
  Shield,
  Edit2,
  Save,
  Check,
  AlertTriangle,
  Activity,
  HardDrive,
} from 'lucide-react';

export function DeviceManagement() {
  const {
    nodes,
    updateNode,
    toggleNodeStrobe,
    toggleNodeBeacon,
    simulationSettings,
    setSimulationSettings,
    resetAllData,
    addToast,
  } = useApp();

  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('ONLINE');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const startEdit = (node) => {
    setEditingNodeId(node.id);
    setEditName(node.name);
    setEditStatus(node.status);
  };

  const saveEdit = (nodeId) => {
    updateNode(nodeId, {
      name: editName,
      status: editStatus,
    });
    setEditingNodeId(null);
  };

  const handleSimSettingToggle = (key) => {
    setSimulationSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      addToast(`Simulation setting [${key}] updated`, 'info');
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-command-900 border border-command-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Safety Node Hardware & Device Management
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {nodes.length} SENSORY POLES MONITORED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live telemetry health, sensor calibration, remote actuator relays (high-intensity strobe and audio guidance sirens), and demonstration preferences.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-300 hover:text-white border border-command-700 text-xs font-mono font-medium transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo System</span>
        </button>
      </div>

      {/* Nodes Health Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Monitored Safety Poles (Guntur Sector)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {nodes.map((node) => {
            const isEditing = editingNodeId === node.id;
            const isStrobeOn = node.sensors?.strobeUnit?.powerState;
            const isBeaconOn = node.sensors?.audioBeacon?.powerState;

            return (
              <div
                key={node.id}
                className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-3.5 relative overflow-hidden"
              >
                {/* Node Title & Edit Row */}
                <div className="flex items-start justify-between gap-2 border-b border-command-700/60 pb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {node.id}
                      </span>
                      {!isEditing ? (
                        <NodeStatusBadge status={node.status} />
                      ) : (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="px-2 py-0.5 rounded bg-command-950 border border-command-700 text-xs font-mono text-cyan-300"
                        >
                          <option value="ONLINE">ONLINE</option>
                          <option value="DEGRADED">DEGRADED</option>
                          <option value="OFFLINE">OFFLINE</option>
                        </select>
                      )}
                    </div>

                    {!isEditing ? (
                      <h4 className="text-sm font-bold text-white mt-1">{node.name}</h4>
                    ) : (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full mt-1 px-2.5 py-1 rounded bg-command-950 border border-cyan-500/50 text-xs text-white focus:outline-none"
                      />
                    )}

                    <div className="text-[11px] text-slate-400 mt-0.5">{node.landmark}</div>
                  </div>

                  <div>
                    {!isEditing ? (
                      <button
                        onClick={() => startEdit(node)}
                        className="p-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-400 hover:text-white transition-colors"
                        title="Edit Node Device"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => saveEdit(node.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        title="Save Changes"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sensor Health Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2 bg-command-950 p-2.5 rounded-lg border border-command-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ACOUSTIC MIC:</span>
                    <span className="text-cyan-300 font-bold">
                      {node.sensors?.acoustic?.noiseDb} dB
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      [{node.sensors?.acoustic?.status}]
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">VISION FPS:</span>
                    <span className="text-slate-200 font-bold">
                      {node.sensors?.optical?.fps} FPS
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {node.sensors?.optical?.resolution}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CORE TEMP:</span>
                    <span className="text-emerald-400 font-bold">
                      {node.sensors?.thermal?.tempC}°C
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Uptime: {node.uptimePercent}%
                    </span>
                  </div>
                </div>

                {/* Hardware Actuators: Strobe & Siren */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => toggleNodeStrobe(node.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-colors border ${
                      isStrobeOn
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 animate-pulse'
                        : 'bg-command-800 hover:bg-command-700 text-slate-300 border-command-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>STROBE: {isStrobeOn ? 'ACTIVATED' : 'STANDBY'}</span>
                  </button>

                  <button
                    onClick={() => toggleNodeBeacon(node.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-colors border ${
                      isBeaconOn
                        ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500 animate-pulse'
                        : 'bg-command-800 hover:bg-command-700 text-slate-300 border-command-700'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>BEACON: {isBeaconOn ? 'SIREN ON' : 'IDLE'}</span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                  <span>Firmware: {node.firmwareVersion}</span>
                  <span>Heartbeat: {new Date(node.lastHeartbeat).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demonstration Preferences Console */}
      <div className="glass-panel p-5 rounded-xl border border-command-700/60 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Demonstration Simulation Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg bg-command-950 border border-command-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-slate-200">
                Strobe & Siren Sound Simulation
              </div>
              <div className="text-[11px] text-slate-400">
                Play simulated audio cues when emergency beacons activate.
              </div>
            </div>
            <button
              onClick={() => handleSimSettingToggle('strobeSoundEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                simulationSettings.strobeSoundEnabled ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  simulationSettings.strobeSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-command-950 border border-command-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-slate-200">
                Auto-Acknowledge Patrol Dispatch
              </div>
              <div className="text-[11px] text-slate-400">
                Automatically transition assigned units to responding after 10 seconds.
              </div>
            </div>
            <button
              onClick={() => handleSimSettingToggle('autoAcknowledgeDispatch')}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                simulationSettings.autoAcknowledgeDispatch ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  simulationSettings.autoAcknowledgeDispatch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Demo Data Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-5 rounded-2xl bg-command-900 border border-red-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="text-base font-bold text-white">Reset Demonstration State?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore all Guntur safety nodes, incidents, simulated patrol locations, and privacy configurations back to default hackathon factory values.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Full Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
