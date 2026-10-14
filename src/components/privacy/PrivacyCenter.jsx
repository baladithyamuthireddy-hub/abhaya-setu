import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  HardDrive,
  UserCheck,
  Cpu,
  FileCheck,
  Sliders,
  AlertCircle,
  CheckCircle2,
  ServerOff,
} from 'lucide-react';

export function PrivacyCenter() {
  const { privacySettings, setPrivacySettings, addToast } = useApp();

  const handleToggle = (key) => {
    setPrivacySettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      addToast(
        `Privacy policy setting [${key}] updated to ${next[key] ? 'ENABLED' : 'DISABLED'}`,
        'info'
      );
      return next;
    });
  };

  const handleRetentionChange = (days) => {
    setPrivacySettings((prev) => {
      const next = { ...prev, metadataRetentionDays: days };
      addToast(`Metadata retention policy updated to ${days} days`, 'info');
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
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              Privacy-by-Design & Ethical Civic Architecture
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
              CONCEPTUAL DPDPA 2023 ALIGNMENT (DEMO ARCHITECTURE)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Abhaya Setu is designed conceptually for zero-mass-surveillance. All sensory processing occurs locally on edge microprocessors.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>ZERO BIOMETRICS</span>
        </div>
      </div>

      {/* Conceptual vs Implemented Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-cyan-300">
            Transparency Declaration: Architecture vs Demonstration Controls
          </div>
          <p className="text-slate-300 leading-relaxed">
            The toggles below configure demonstration policy state. In actual physical hardware deployments, these principles are enforced via hardware cryptographic tamper-evident Trusted Platform Modules (TPM 2.0). <strong className="text-white">Note:</strong> This demonstration does not constitute formal legal certification under the Digital Personal Data Protection Act (DPDPA 2023) and does not capture or store real citizen biometric audio/video feeds.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Ethical Civic Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold font-mono text-slate-100">1. EDGE-FIRST COMPUTE</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Acoustic keyword spotting and pose analysis execute entirely on local node neural accelerators.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ServerOff className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold font-mono text-slate-100">2. NO CLOUD VIDEO STREAM</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero continuous video broadcasting. The cloud receives only lightweight encrypted incident metadata.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold font-mono text-slate-100">3. ROLLING RAM BUFFER</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            A circular 5-minute ephemeral memory buffer constantly overwrites itself in RAM. Unflagged footage is permanently lost.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold font-mono text-slate-100">4. ZERO FACE RECOGNITION</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict algorithmic prohibition of facial identification, age profiling, and biometric citizen indexing.
          </p>
        </div>
      </div>

      {/* Interactive Policy Configuration Console */}
      <div className="glass-panel p-5 rounded-xl border border-command-700/60 space-y-4">
        <div className="flex items-center justify-between border-b border-command-700/60 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Simulated Node Privacy Controls & Policy Toggles
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Persistent in Browser Session
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle 1: Edge Only */}
          <div className="p-3.5 rounded-lg bg-command-950 border border-command-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-slate-200">
                Edge-Only Sensor Processing
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Disable any cloud upload of raw acoustic/optical feeds.
              </div>
            </div>
            <button
              onClick={() => handleToggle('edgeOnlyProcessing')}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                privacySettings.edgeOnlyProcessing ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  privacySettings.edgeOnlyProcessing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Zero Cloud Video */}
          <div className="p-3.5 rounded-lg bg-command-950 border border-command-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-slate-200">
                Zero Continuous Cloud Streaming
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Prevent real-time surveillance live-cams.
              </div>
            </div>
            <button
              onClick={() => handleToggle('zeroContinuousCloudVideo')}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                privacySettings.zeroContinuousCloudVideo ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  privacySettings.zeroContinuousCloudVideo ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Human Verification Mandatory */}
          <div className="p-3.5 rounded-lg bg-command-950 border border-command-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-slate-200">
                Mandatory Human-in-the-Loop Verification
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Require human operator sign-off before dispatching emergency sirens.
              </div>
            </div>
            <button
              onClick={() => handleToggle('humanVerificationMandatory')}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                privacySettings.humanVerificationMandatory ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  privacySettings.humanVerificationMandatory ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 4: Voice Pitch Anonymization */}
          <div className="p-3.5 rounded-lg bg-command-950 border border-command-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-slate-200">
                Acoustic Voice Pitch Anonymization
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Scramble citizen vocal pitch before creating telemetry snippets.
              </div>
            </div>
            <button
              onClick={() => handleToggle('voicePitchAnonymization')}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                privacySettings.voicePitchAnonymization ? 'bg-cyan-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  privacySettings.voicePitchAnonymization ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Retention Period Setting */}
        <div className="p-4 rounded-lg bg-command-950 border border-command-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Encrypted Incident Metadata Retention Window
            </span>
            <span className="font-mono text-cyan-300 text-xs font-bold">
              Current: {privacySettings.metadataRetentionDays} Days
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Automatically purge verified incident logs and telemetry after the defined audit window.
          </p>

          <div className="flex gap-2 pt-1 font-mono text-xs">
            {[3, 7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => handleRetentionChange(days)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  privacySettings.metadataRetentionDays === days
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                    : 'bg-command-900 text-slate-400 border-command-700 hover:text-white'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Role-Based Access Architecture */}
      <div className="glass-panel p-5 rounded-xl border border-command-700/60 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          Role-Based Access Control (RBAC) Specification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-command-950 border border-command-800 space-y-1">
            <div className="font-bold text-cyan-300 font-mono">OPERATOR / DISPATCHER</div>
            <div className="text-[11px] text-slate-400">
              Can verify alerts, view 10-second telemetry snippets, and route nearest patrol units. Cannot access raw historical data.
            </div>
          </div>
          <div className="p-3 rounded-lg bg-command-950 border border-command-800 space-y-1">
            <div className="font-bold text-teal-300 font-mono">FIELD PATROL OFFICER</div>
            <div className="text-[11px] text-slate-400">
              Receives only waypoint coordinates, emergency category, and estimated victim count. No raw video feed sent to mobile devices.
            </div>
          </div>
          <div className="p-3 rounded-lg bg-command-950 border border-command-800 space-y-1">
            <div className="font-bold text-amber-300 font-mono">INDEPENDENT CIVIC AUDITOR</div>
            <div className="text-[11px] text-slate-400">
              Inspects false-positive rates and data retention logs. Cryptographically forbidden from viewing footage or incident identities.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
