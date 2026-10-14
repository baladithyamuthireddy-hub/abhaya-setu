import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  X,
  Radio,
  Zap,
  Volume2,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function SosModal() {
  const { isSosModalOpen, setIsSosModalOpen, triggerSos, nodes, setActiveTab } = useApp();
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-GNT-01');
  const [sosNotes, setSosNotes] = useState('Citizen panic button triggered at public terminal');
  const [isActuating, setIsActuating] = useState(false);
  const [triggeredIncident, setTriggeredIncident] = useState(null);

  if (!isSosModalOpen) return null;

  const handleTrigger = () => {
    setIsActuating(true);
    setTimeout(() => {
      const inc = triggerSos(selectedNodeId, sosNotes);
      setTriggeredIncident(inc);
      setIsActuating(false);
    }, 1200);
  };

  const handleClose = () => {
    setIsSosModalOpen(false);
    setTriggeredIncident(null);
  };

  const handleGoToReview = () => {
    handleClose();
    setActiveTab('incidents');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-command-900 border-2 border-red-500/60 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-command-700/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertOctagon className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Emergency Panic Trigger (SOS)
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
                SIMULATION MODE • NO REAL 112 CALLS
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-command-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!triggeredIncident ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Actuating this emergency trigger simulates a citizen pressing a physical distress button at an Abhaya Setu pole in Guntur.
            </p>

            {/* Select Target Node */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">
                Target Safety Pole Location:
              </label>
              <select
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-command-950 border border-command-700 text-xs text-white focus:outline-none focus:border-red-400 font-mono"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Simulated Action Preview */}
            <div className="p-3 rounded-lg bg-command-950 border border-command-800 space-y-2 text-xs">
              <div className="font-mono text-[11px] text-cyan-300 uppercase font-bold">
                Automated Edge Actions Executed:
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Simulated 2400-lumen emergency LED strobe fires immediately</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Volume2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>High-decibel acoustic guidance siren activates</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Priority 1 SitRep broadcast to Command Center Review Queue</span>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              disabled={isActuating}
              onClick={handleTrigger}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2.5 ${
                isActuating
                  ? 'bg-red-800 text-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-950/60 active:scale-95 border border-red-400/50'
              }`}
            >
              {isActuating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>TRANSMITTING EMERGENCY SOS...</span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-5 h-5" />
                  <span>ACTUATE PHYSICAL SOS BUTTON</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">
                SOS Event Successfully Created
              </h3>
              <div className="font-mono text-xs text-red-400 font-bold">
                INCIDENT ID: {triggeredIncident.id}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Hardware strobe activated at {triggeredIncident.nodeName}. Operator review queue alerted.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleGoToReview}
                className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open in Incident Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
