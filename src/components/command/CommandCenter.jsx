import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from './LeafletMap';
import { SeverityBadge, StatusBadge, NodeStatusBadge } from '../common/Badge';
import {
  AlertTriangle,
  Radio,
  Car,
  Shield,
  Activity,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

export function CommandCenter() {
  const {
    incidents,
    nodes,
    patrols,
    setSelectedIncidentId,
    setActiveTab,
    setIsSosModalOpen,
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Quick stats
  const activeIncidents = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'DISMISSED'
  );
  const pendingReviewIncidents = incidents.filter((i) => i.status === 'PENDING_REVIEW');
  const criticalCount = activeIncidents.filter((i) => i.severity === 'CRITICAL').length;
  const onlineNodesCount = nodes.filter((n) => n.status === 'ONLINE').length;
  const availablePatrolsCount = patrols.filter((p) => p.status === 'AVAILABLE').length;

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'ACTIVE') return inc.status !== 'RESOLVED' && inc.status !== 'DISMISSED';
    if (filterSeverity === 'PENDING') return inc.status === 'PENDING_REVIEW';
    return inc.severity === filterSeverity;
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Active Incidents */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 shadow-lg relative overflow-hidden group hover:border-red-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Active Incidents
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {activeIncidents.length}
            </span>
            {criticalCount > 0 && (
              <span className="text-xs font-bold text-red-400 font-mono">
                ({criticalCount} Critical)
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{pendingReviewIncidents.length} awaiting human review</span>
          </div>
        </div>

        {/* Card 2: Monitored Nodes */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Safety Nodes
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
              {onlineNodesCount}
              <span className="text-base text-slate-400 font-normal">/{nodes.length}</span>
            </span>
            <span className="text-xs text-emerald-400 font-mono font-medium">99.4% Avg</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Acoustic & Vision Edge AI active</span>
          </div>
        </div>

        {/* Card 3: Ready Patrols */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Patrol Fleet
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
              {availablePatrolsCount}
              <span className="text-base text-slate-400 font-normal">/{patrols.length}</span>
            </span>
            <span className="text-xs text-cyan-400 font-mono font-medium">Available</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Avg Response ETA ~3.2 mins</span>
          </div>
        </div>

        {/* Card 4: Quick Actions Hub */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Rapid Simulation
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => setActiveTab('lab')}
              className="py-1.5 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold text-center transition-colors"
            >
              Detection Lab →
            </button>
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="py-1.5 px-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[11px] font-semibold text-center transition-colors"
            >
              Test SOS 🚨
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Live Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Section (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Guntur Civic Safety Grid (Andhra Pradesh)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-command-800 text-slate-300 border border-command-700">
                16.3067° N, 80.4365° E
              </span>
            </div>

            <div className="text-xs font-mono text-slate-400 hidden sm:block">
              Interactive OpenStreetMap
            </div>
          </div>

          {/* Leaflet Map Container */}
          <div className="h-[460px] w-full rounded-xl overflow-hidden">
            <LeafletMap onSelectIncident={(id) => setSelectedIncidentId(id)} />
          </div>

          {/* Node Quick Selector Bar */}
          <div className="p-3 rounded-xl bg-command-900 border border-command-700/60">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Demonstration Safety Nodes in Guntur:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {nodes.slice(0, 4).map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-2 rounded-lg text-left border text-xs transition-all ${
                    selectedNodeId === node.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-command-950 hover:bg-command-800/80 border-command-800 text-slate-300'
                  }`}
                >
                  <div className="font-mono text-[10px] text-cyan-400 flex items-center justify-between">
                    <span>{node.id}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        node.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                  </div>
                  <div className="font-medium truncate mt-0.5 text-[11px]">
                    {node.name.split(' - ')[0]}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Node Details Box */}
            {selectedNode && (
              <div className="mt-3 p-3 rounded-lg bg-command-950 border border-cyan-500/30 text-xs animate-in fade-in space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-100">{selectedNode.name}</div>
                  <NodeStatusBadge status={selectedNode.status} />
                </div>
                <div className="text-slate-400 text-[11px]">{selectedNode.landmark}</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedNode.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-command-800 border border-command-700 text-[10px] font-mono text-cyan-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Incident Feed (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Live Incident Feed
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              {filteredIncidents.length} Events
            </span>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-command-900 border border-command-700/60 text-xs overflow-x-auto">
            {['ALL', 'ACTIVE', 'PENDING', 'CRITICAL', 'HIGH'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterSeverity(tab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors whitespace-nowrap ${
                  filterSeverity === tab
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Incidents List Container */}
          <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">
            {filteredIncidents.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-xl border border-command-700/60 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-semibold text-slate-200">
                  No matching incidents
                </div>
                <div className="text-xs text-slate-400">
                  All safety nodes in Guntur report nominal state for this filter.
                </div>
              </div>
            ) : (
              filteredIncidents.map((inc) => {
                const isPending = inc.status === 'PENDING_REVIEW';
                const isCritical = inc.severity === 'CRITICAL';

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer group hover:scale-[1.01] ${
                      isCritical
                        ? 'bg-red-950/20 border-red-500/40 hover:border-red-400'
                        : isPending
                        ? 'bg-amber-950/15 border-amber-500/40 hover:border-amber-400'
                        : 'bg-command-900/80 border-command-700/60 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {inc.id}
                          </span>
                          <SeverityBadge severity={inc.severity} />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                          {inc.category}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{inc.nodeName}</p>
                      </div>

                      <StatusBadge status={inc.status} />
                    </div>

                    {/* SitRep snippet */}
                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed bg-command-950/60 p-2 rounded border border-command-800 font-sans">
                      {inc.sitrep}
                    </p>

                    {/* Footer metadata */}
                    <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-command-800/80 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(inc.timestamp).toLocaleTimeString()}</span>
                      </div>

                      <div className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Review SitRep</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
