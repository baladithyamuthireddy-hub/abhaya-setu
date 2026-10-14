import React from 'react';

export function SeverityBadge({ severity }) {
  const configs = {
    CRITICAL: {
      bg: 'bg-red-500/20 text-red-400 border-red-500/40',
      dot: 'bg-red-500 animate-pulse',
      label: 'CRITICAL',
    },
    HIGH: {
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dot: 'bg-amber-400',
      label: 'HIGH',
    },
    MEDIUM: {
      bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      dot: 'bg-yellow-400',
      label: 'MEDIUM',
    },
    LOW: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dot: 'bg-emerald-400',
      label: 'LOW',
    },
  };

  const current = configs[severity] || configs.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const configs = {
    PENDING_REVIEW: {
      bg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      label: 'Pending Review',
      pulse: true,
    },
    VERIFIED: {
      bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
      label: 'Verified',
      pulse: false,
    },
    ASSIGNED: {
      bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
      label: 'Patrol Assigned',
      pulse: false,
    },
    RESPONDING: {
      bg: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
      label: 'Responding',
      pulse: true,
    },
    RESOLVED: {
      bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      label: 'Resolved',
      pulse: false,
    },
    DISMISSED: {
      bg: 'bg-slate-800 text-slate-400 border-slate-700',
      label: 'Dismissed',
      pulse: false,
    },
  };

  const current = configs[status] || {
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    label: status,
    pulse: false,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${current.bg}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          current.pulse ? 'bg-amber-400 animate-ping' : 'bg-current opacity-70'
        }`}
      />
      {current.label}
    </span>
  );
}

export function NodeStatusBadge({ status }) {
  const configs = {
    ONLINE: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: 'ONLINE',
    },
    DEGRADED: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
      label: 'DEGRADED',
    },
    OFFLINE: {
      bg: 'bg-red-500/10 text-red-400 border-red-500/30',
      dot: 'bg-red-500',
      label: 'OFFLINE',
    },
  };

  const current = configs[status] || configs.ONLINE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider border ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}
