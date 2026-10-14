import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { IncidentModal } from './IncidentModal';
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  UserCheck,
  XCircle,
  FileText,
} from 'lucide-react';

export function IncidentManagement() {
  const {
    incidents,
    selectedIncidentId,
    setSelectedIncidentId,
    verifyIncident,
    dismissIncident,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Filter & Search Logic
  const filtered = incidents.filter((inc) => {
    // Status filter
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) {
      return false;
    }
    // Severity filter
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = inc.id?.toLowerCase().includes(q);
      const matchCategory = inc.category?.toLowerCase().includes(q);
      const matchNode = inc.nodeName?.toLowerCase().includes(q) || inc.nodeId?.toLowerCase().includes(q);
      const matchSitrep = inc.sitrep?.toLowerCase().includes(q);
      if (!matchId && !matchCategory && !matchNode && !matchSitrep) {
        return false;
      }
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'NEWEST') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortBy === 'OLDEST') {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (sortBy === 'SEVERITY') {
      const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    }
    return 0;
  });

  const pendingReviewCount = incidents.filter((i) => i.status === 'PENDING_REVIEW').length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-command-900 border border-command-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Incident Management & Human-in-the-Loop Review
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {incidents.length} TOTAL ARCHIVED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Audit, verify, and dispatch emergency incidents. Human operator verification is strictly required prior to automated patrol unit dispatch.
          </p>
        </div>

        {pendingReviewCount > 0 && (
          <div className="px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 shrink-0 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{pendingReviewCount} AWAITING OPERATOR VERIFICATION</span>
          </div>
        )}
      </div>

      {/* Control Filters Bar */}
      <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword (e.g. Bus Stand, Fall), or sensor..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-command-950 border border-command-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Severity Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-command-950 border border-command-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Severity</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="LOW">Low Severity</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-command-950 border border-command-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="SEVERITY">Highest Severity</option>
            </select>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-xs font-mono">
          {[
            { id: 'ALL', label: 'All Incidents' },
            { id: 'PENDING_REVIEW', label: 'Pending Review' },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'ASSIGNED', label: 'Assigned' },
            { id: 'RESPONDING', label: 'Responding' },
            { id: 'RESOLVED', label: 'Resolved' },
            { id: 'DISMISSED', label: 'Dismissed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'bg-command-950/60 hover:bg-command-800 text-slate-400 border border-command-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table / Cards Grid */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-command-700/60 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No Incidents Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No recorded events match the selected search or filter criteria. You can trigger a new test incident in the Detection Lab.
            </p>
          </div>
        ) : (
          sorted.map((inc) => {
            const isPending = inc.status === 'PENDING_REVIEW';
            const isCritical = inc.severity === 'CRITICAL';

            return (
              <div
                key={inc.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-400'
                    : isPending
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                    : 'bg-command-900/80 border-command-700/60 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: ID & Metadata */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-cyan-300">
                        {inc.id}
                      </span>
                      <SeverityBadge severity={inc.severity} />
                      <StatusBadge status={inc.status} />
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(inc.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {inc.category}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{inc.nodeName}</span>
                      <span className="font-mono text-[11px] text-slate-400">({inc.nodeId})</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2 bg-command-950/70 p-2 rounded-lg border border-command-800 mt-2">
                      {inc.sitrep}
                    </p>
                  </div>

                  {/* Right: Quick Review Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-cyan-950/30"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Situation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => verifyIncident(inc.id, 'Verified threat from quick list')}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                          title="Quick Verify"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                        <button
                          onClick={() => dismissIncident(inc.id, 'Quick operator dismissal')}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-command-700 transition-colors"
                          title="Quick Dismiss"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Incident Deep Inspection Modal */}
      {selectedIncidentId && (
        <IncidentModal
          incidentId={selectedIncidentId}
          onClose={() => setSelectedIncidentId(null)}
        />
      )}
    </div>
  );
}
