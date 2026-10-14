import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FlaskConical,
  AlertTriangle,
  Car,
  BarChart3,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab, incidents, nodes, patrols, resetAllData } = useApp();

  const pendingReviewCount = incidents.filter((i) => i.status === 'PENDING_REVIEW').length;
  const availablePatrols = patrols.filter((p) => p.status === 'AVAILABLE').length;

  const navItems = [
    {
      id: 'command',
      label: 'Command Center',
      sublabel: 'Map & Live Feed',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'lab',
      label: 'Detection Lab',
      sublabel: 'Simulated Edge AI',
      icon: FlaskConical,
      highlight: true,
    },
    {
      id: 'incidents',
      label: 'Incident Manager',
      sublabel: 'Review & SitRep',
      icon: AlertTriangle,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} Review` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'patrols',
      label: 'Patrol Dispatch',
      sublabel: 'Fleet & Assignment',
      icon: Car,
      badge: `${availablePatrols} Ready`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'analytics',
      label: 'City Analytics',
      sublabel: 'Trends & False Positives',
      icon: BarChart3,
    },
    {
      id: 'privacy',
      label: 'Privacy Center',
      sublabel: 'Edge-First & Ethics',
      icon: ShieldCheck,
    },
    {
      id: 'settings',
      label: 'Device Manager',
      sublabel: 'Sensors & Hardware',
      icon: Cpu,
    },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-command-900 border-r border-command-700/60 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3.5 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-mono tracking-wider uppercase text-slate-400">
            Operations Matrix
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/20'
                    : 'text-slate-300 hover:text-white hover:bg-command-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-command-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                      {item.label}
                      {item.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom System Status & Reset Seed Data */}
        <div className="p-3.5 border-t border-command-700/60 space-y-2.5 bg-command-950/60">
          <div className="p-2.5 rounded-lg bg-command-900 border border-command-800 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400 font-mono">
              <span>EDGE SECURITY:</span>
              <span className="text-emerald-400 font-semibold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 font-mono">
              <span>JURISDICTION:</span>
              <span className="text-cyan-300">GUNTUR AP</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all demonstration data to factory defaults?')) {
                resetAllData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-command-800 hover:bg-command-700/80 border border-command-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
}
