import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateDistanceKm, estimateEtaMinutes, formatCoordinates } from '../../utils/geo';
import {
  Car,
  Shield,
  Navigation,
  Send,
  CheckCircle2,
  Clock,
  Battery,
  Phone,
  UserCheck,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

export function PatrolDispatch() {
  const {
    patrols,
    incidents,
    assignPatrol,
    updateIncidentStatus,
    setSelectedIncidentId,
    setActiveTab,
  } = useApp();

  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState('');

  // Unassigned or verified incidents awaiting dispatch
  const assignableIncidents = incidents.filter(
    (i) => i.status === 'VERIFIED' || i.status === 'PENDING_REVIEW'
  );

  const activePatrols = patrols.filter((p) => p.status !== 'AVAILABLE');
  const availablePatrols = patrols.filter((p) => p.status === 'AVAILABLE');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-command-900 border border-command-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-cyan-400" />
              Civic Patrol Dispatch & Response Engine
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              SIMULATED FLEET DISPATCH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Proximity-based nearest unit routing for rapid intervention. Fictional mobile units operating within Guntur Municipal Jurisdiction.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            {availablePatrols.length} Units Ready
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            {activePatrols.length} Deployed
          </span>
        </div>
      </div>

      {/* Quick Dispatch Assignment Box (if incidents are waiting) */}
      {assignableIncidents.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-amber-500/40 bg-amber-950/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>{assignableIncidents.length} Incident(s) Waiting in Dispatch Queue</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Operator verification status preserved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assignableIncidents.map((inc) => {
              const isVerified = inc.status === 'VERIFIED';

              return (
                <div
                  key={inc.id}
                  className="p-3 rounded-lg bg-command-950 border border-command-800 text-xs space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-cyan-400 font-mono font-bold text-[11px]">
                      <span>{inc.id}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded ${
                          isVerified
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </div>
                    <div className="font-bold text-white mt-1 line-clamp-1">{inc.category}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{inc.nodeName}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedIncidentId(inc.id);
                      setActiveTab('incidents');
                    }}
                    className={`w-full py-1.5 px-2 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      isVerified
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                        : 'bg-amber-600 hover:bg-amber-500 text-black'
                    }`}
                  >
                    {isVerified ? 'Assign Available Patrol →' : 'Review & Verify Threat →'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Patrol Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patrols.map((patrol) => {
          const isAvailable = patrol.status === 'AVAILABLE';
          const isResponding = patrol.status === 'RESPONDING';
          const isAssigned = patrol.status === 'ASSIGNED';
          const isBusy = patrol.status === 'BUSY';

          const assignedInc = incidents.find((i) => i.id === patrol.currentIncidentId);

          return (
            <div
              key={patrol.id}
              className={`p-4 rounded-xl border transition-all ${
                isAvailable
                  ? 'bg-command-900/90 border-cyan-500/40 hover:border-cyan-400'
                  : isResponding
                  ? 'bg-blue-950/20 border-blue-500/50'
                  : isAssigned
                  ? 'bg-indigo-950/20 border-indigo-500/50'
                  : 'bg-command-950 border-command-800 opacity-90'
              }`}
            >
              {/* Unit Title & Status */}
              <div className="flex items-start justify-between gap-3 border-b border-command-700/60 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isAvailable
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        : isResponding
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 animate-pulse'
                        : 'bg-command-800 border-command-700 text-slate-400'
                    }`}
                  >
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-sm font-bold text-white">
                        {patrol.callSign}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-400">
                        {patrol.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{patrol.vehicleType}</p>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-full border font-bold ${
                    isAvailable
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isResponding
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                      : isAssigned
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {patrol.status}
                </span>
              </div>

              {/* Roster & Specs */}
              <div className="grid grid-cols-2 gap-3 py-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">CREW COMMANDER:</span>
                  <span className="text-slate-200 font-semibold">{patrol.officer1}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TACTICAL WING:</span>
                  <span className="text-cyan-300 font-semibold">{patrol.officer2}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT COORDS:</span>
                  <span className="text-slate-300">{formatCoordinates(patrol.lat, patrol.lng)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">BATTERY / FUEL:</span>
                  <span className="text-emerald-400 font-bold">{patrol.batteryOrFuel}</span>
                </div>
              </div>

              {/* Active Engagement Info (if assigned or responding) */}
              {assignedInc && (
                <div className="p-3 rounded-lg bg-command-950 border border-command-800 text-xs space-y-1.5 my-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">ENGAGED WITH:</span>
                    <span className="text-cyan-400 font-bold">{assignedInc.id}</span>
                  </div>
                  <div className="font-medium text-slate-200 line-clamp-1">
                    {assignedInc.category}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Target: {assignedInc.nodeName}
                  </div>

                  {/* Lifecycle actions for this engaged patrol */}
                  <div className="pt-2 flex items-center gap-2">
                    {isAssigned && (
                      <button
                        onClick={() => updateIncidentStatus(assignedInc.id, 'RESPONDING')}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        Acknowledge & Respond →
                      </button>
                    )}
                    {isResponding && (
                      <button
                        onClick={() => updateIncidentStatus(assignedInc.id, 'RESOLVED')}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        Arrived & Mark Resolved ✓
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Nearest Incident Dispatch Action if Available */}
              {isAvailable && (
                <div className="pt-2 border-t border-command-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{patrol.contactNumber}</span>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Standby in Sector
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
