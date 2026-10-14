import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { formatCoordinates, estimateEtaMinutes, calculateDistanceKm } from '../../utils/geo';
import {
  X,
  CheckCircle2,
  XCircle,
  Car,
  AlertTriangle,
  Clock,
  Mic,
  Camera,
  MapPin,
  FileText,
  UserCheck,
  Send,
  Zap,
} from 'lucide-react';

export function IncidentModal({ incidentId, onClose }) {
  const {
    incidents,
    patrols,
    verifyIncident,
    dismissIncident,
    assignPatrol,
    updateIncidentStatus,
    toggleNodeStrobe,
    nodes,
    findNearestAvailablePatrol,
  } = useApp();

  const [operatorNoteInput, setOperatorNoteInput] = useState('');
  const [selectedPatrolToAssign, setSelectedPatrolToAssign] = useState('');
  const [dismissReason, setDismissReason] = useState('Benign local disturbance / ambient noise');

  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return null;

  const node = nodes.find((n) => n.id === incident.nodeId);
  const assignedPatrol = patrols.find((p) => p.id === incident.assignedPatrolId);
  const nearestPatrol = findNearestAvailablePatrol(incident.lat, incident.lng);

  const canVerify = incident.status === 'PENDING_REVIEW';
  const canAssign = incident.status === 'VERIFIED';
  const canRespond = incident.status === 'ASSIGNED';
  const canResolve = incident.status === 'RESPONDING';
  const isTerminal = incident.status === 'RESOLVED' || incident.status === 'DISMISSED';

  const handleVerify = () => {
    verifyIncident(incident.id, operatorNoteInput || 'Threat confirmed by operator via audio-visual telemetry');
    setOperatorNoteInput('');
  };

  const handleDismiss = () => {
    dismissIncident(incident.id, dismissReason);
  };

  const handleAssign = (patrolId) => {
    if (!patrolId) return;
    assignPatrol(incident.id, patrolId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-command-900 border border-command-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-command-700/80 bg-command-950/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-extrabold text-cyan-300">
                  {incident.id}
                </span>
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {incident.category}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-command-800 text-slate-400 hover:text-white hover:bg-command-700 border border-command-700 transition-colors"
            aria-label="Close incident inspection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-command-950/80 p-3.5 rounded-xl border border-command-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">TIMESTAMP:</span>
              <span className="text-slate-200 font-semibold">
                {new Date(incident.timestamp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SENSOR NODE:</span>
              <span className="text-cyan-300 font-semibold">{incident.nodeId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">GEO LOCATION:</span>
              <span className="text-slate-300 truncate block">
                {formatCoordinates(incident.lat, incident.lng)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">EDGE CONFIDENCE:</span>
              <span className="text-emerald-400 font-bold">
                {((incident.confidenceScore || 0.9) * 100).toFixed(0)}% Simulated
              </span>
            </div>
          </div>

          {/* Situation Report (SitRep) Banner */}
          <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase font-bold">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Templated Incident Situation Report (SitRep)
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {incident.nodeName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-command-950/50 p-3 rounded-lg border border-command-800">
              {incident.sitrep}
            </p>
          </div>

          {/* Audio & Visual Telemetry Inspection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audio Evidence */}
            <div className="p-3.5 rounded-xl bg-command-950 border border-command-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-cyan-400 font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  Acoustic Telemetry Clip
                </span>
                <span>{incident.audioEvidence?.decibelPeak} dB Peak</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-400">Distress Signature:</span>{' '}
                  <span className="text-amber-300 font-semibold">
                    {incident.audioEvidence?.detectedPhrase || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Spectral Profile:</span>{' '}
                  <span className="text-slate-300">
                    {incident.audioEvidence?.waveformSignature || 'Normal harmonics'}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Evidence */}
            <div className="p-3.5 rounded-xl bg-command-950 border border-command-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-teal-400 font-mono font-bold">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4" />
                  Optical Pose & Density Telemetry
                </span>
                <span>
                  {((incident.visualEvidence?.visualConfidence || 0.9) * 100).toFixed(0)}% Conf
                </span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-400">Pose Classification:</span>{' '}
                  <span className="text-teal-300">
                    {incident.visualEvidence?.postureDetected || 'Nominal posture'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Density Vector:</span>{' '}
                  <span className="text-slate-300">
                    {incident.visualEvidence?.densityAnomaly || 'Nominal flow'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Timeline Audit Log */}
          <div className="p-4 rounded-xl bg-command-950/70 border border-command-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
              <Clock className="w-4 h-4 text-cyan-400" />
              Incident Audit Trail & Timeline
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {incident.timeline?.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs border-l-2 border-cyan-500/40 pl-3 py-1"
                >
                  <span className="font-mono text-[10px] text-cyan-400 shrink-0 mt-0.5">
                    {entry.time}
                  </span>
                  <div className="flex-1">
                    <span className="text-slate-200">{entry.event}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">
                      [{entry.actor}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Workflow Actions (Lifecycle Control) */}
          <div className="p-4 rounded-xl bg-command-850 border border-command-700/80 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-300">
              Command Dispatch Action Console
            </div>

            {/* State 1: PENDING_REVIEW -> Require Operator Verification */}
            {canVerify && (
              <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <UserCheck className="w-4 h-4" />
                  Operator Human-in-the-Loop Verification Required
                </div>
                <p className="text-xs text-slate-300">
                  Autonomous edge nodes do not dispatch police or emergency vehicles without operator confirmation. Inspect the telemetry clips above and verify or dismiss.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={operatorNoteInput}
                    onChange={(e) => setOperatorNoteInput(e.target.value)}
                    placeholder="Enter operator observation notes (optional)..."
                    className="flex-1 px-3 py-2 rounded-lg bg-command-950 border border-command-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleVerify}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Threat
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 hover:text-white font-medium text-xs border border-command-700 shrink-0"
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    Dismiss False Alarm
                  </button>
                </div>
              </div>
            )}

            {/* State 2: VERIFIED -> Ready to Assign Patrol */}
            {canAssign && (
              <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Car className="w-4 h-4" />
                    Verified: Dispatch Nearest Patrol Unit
                  </span>
                  {nearestPatrol && (
                    <span className="text-[11px] font-mono text-emerald-400">
                      Recommendation: {nearestPatrol.callSign} (~{nearestPatrol.distanceKm} km away, ETA {estimateEtaMinutes(nearestPatrol.distanceKm)} min)
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedPatrolToAssign || (nearestPatrol ? nearestPatrol.id : (patrols.find(p => p.status === 'AVAILABLE')?.id || ''))}
                    onChange={(e) => setSelectedPatrolToAssign(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-command-950 border border-command-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    {patrols.filter(p => p.status === 'AVAILABLE').length === 0 ? (
                      <option value="" disabled>No available patrol units in sector</option>
                    ) : (
                      patrols.map((p) => {
                        const dist = calculateDistanceKm(incident.lat, incident.lng, p.lat, p.lng);
                        return (
                          <option
                            key={p.id}
                            value={p.id}
                            disabled={p.status !== 'AVAILABLE'}
                          >
                            {p.callSign} - {p.vehicleType} [{p.status}] (~{dist} km)
                          </option>
                        );
                      })
                    )}
                  </select>

                  <button
                    disabled={!patrols.some(p => p.status === 'AVAILABLE')}
                    onClick={() => {
                      const targetId = selectedPatrolToAssign || (nearestPatrol ? nearestPatrol.id : patrols.find(p => p.status === 'AVAILABLE')?.id);
                      if (targetId) handleAssign(targetId);
                    }}
                    className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shrink-0 ${
                      patrols.some(p => p.status === 'AVAILABLE')
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                        : 'bg-command-800 text-slate-500 cursor-not-allowed border border-command-700'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Dispatch Unit
                  </button>
                </div>
              </div>
            )}

            {/* State 3: ASSIGNED -> Transition to RESPONDING */}
            {canRespond && (
              <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-indigo-300">
                    Unit Assigned: {assignedPatrol?.callSign || incident.assignedPatrolId}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Patrol unit acknowledged dispatch alert. Ready to mark en route.
                  </div>
                </div>

                <button
                  onClick={() => updateIncidentStatus(incident.id, 'RESPONDING')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                >
                  Mark Responding →
                </button>
              </div>
            )}

            {/* State 4: RESPONDING -> Transition to RESOLVED */}
            {canResolve && (
              <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-500/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-blue-300">
                    Unit Responding on Scene: {assignedPatrol?.callSign}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Officers have secured the location. Mark situation de-escalated and resolved.
                  </div>
                </div>

                <button
                  onClick={() => updateIncidentStatus(incident.id, 'RESOLVED')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                >
                  Resolve Incident ✓
                </button>
              </div>
            )}

            {/* Terminal State */}
            {isTerminal && (
              <div className="p-3 rounded-lg bg-command-950 border border-command-800 text-center text-xs text-slate-400">
                This incident is <span className="text-slate-200 font-bold">{incident.status}</span>. Audit timeline is archived.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-command-700/80 bg-command-950/70 flex items-center justify-between text-xs text-slate-400">
          <div className="font-mono text-[11px]">
            Node Hardware ID: {incident.nodeId}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
