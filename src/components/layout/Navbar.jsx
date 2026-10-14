import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Radio,
  Car,
  Bell,
  Clock,
  Layers,
  Menu,
  X,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';

export function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { incidents, nodes, patrols, setIsSosModalOpen, resetAllData } = useApp();
  const [currentTime, setCurrentTime] = useState('');

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'DISMISSED'
  );
  const pendingReviewCount = incidents.filter((i) => i.status === 'PENDING_REVIEW').length;
  const onlineNodes = nodes.filter((n) => n.status === 'ONLINE').length;
  const availablePatrols = patrols.filter((p) => p.status === 'AVAILABLE').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-command-900/90 backdrop-blur-md border-b border-command-700/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg bg-command-800 text-slate-300 hover:text-white border border-command-700 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/40 shadow-inner group cursor-pointer">
              <ShieldAlert className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">
                  ABHAYA SETU
                </h1>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono hidden sm:inline-block">
                  अभय सेतु
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  DEMO MODE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
                Bridging Distress to Rescue • Guntur Central Hub
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Operational Telemetry Pill (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 px-3.5 py-1.5 rounded-full bg-command-950/70 border border-command-700/60 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>NODES:</span>
            <span className="text-emerald-400 font-bold">
              {onlineNodes}/{nodes.length}
            </span>
          </div>

          <div className="w-px h-3.5 bg-command-700" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Car className="w-3.5 h-3.5 text-cyan-400" />
            <span>PATROLS:</span>
            <span className="text-cyan-400 font-bold">
              {availablePatrols}/{patrols.length}
            </span>
          </div>

          <div className="w-px h-3.5 bg-command-700" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>ACTIVE:</span>
            <span
              className={`font-bold ${
                activeIncidents.length > 0 ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {activeIncidents.length}
            </span>
            {pendingReviewCount > 0 && (
              <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300">
                {pendingReviewCount} PENDING
              </span>
            )}
          </div>
        </div>

        {/* Right: Clock & SOS Quick Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-command-800/80 border border-command-700/60 text-xs font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime || '12:00:00 PM'}</span>
            <span className="text-[9px] text-slate-400">IST</span>
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-900/40 border border-red-400/40 transform active:scale-95 transition-all duration-200"
            title="Trigger High Priority Demonstration SOS"
          >
            <AlertOctagon className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">EMERGENCY</span>
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
