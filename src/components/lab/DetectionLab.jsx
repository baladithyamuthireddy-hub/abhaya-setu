import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LAB_SCENARIOS } from '../../data/seedData';
import { AudioWaveform } from '../common/AudioWaveform';
import { SeverityBadge } from '../common/Badge';
import {
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Cpu,
  Mic,
  Camera,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export function DetectionLab() {
  const { createIncident, setSelectedIncidentId, setActiveTab, addToast } = useApp();

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [createdIncidentId, setCreatedIncidentId] = useState(null);
  const timerRef = React.useRef(null);

  const scenario = LAB_SCENARIOS[selectedScenarioIndex];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset / cancel analysis when user picks another scenario
  const handleSelectScenario = (index) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedScenarioIndex(index);
    setAnalyzing(false);
    setCurrentStepIndex(-1);
    setAnalysisComplete(false);
    setCreatedIncidentId(null);
  };

  // Operator can explicitly cancel the in-flight analysis
  const handleCancelAnalysis = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setAnalyzing(false);
    setCurrentStepIndex(-1);
    setAnalysisComplete(false);
    addToast('Simulated edge analysis canceled by user.', 'info');
  };

  // Run the simulated edge-device processing sequence
  const handleStartAnalysis = () => {
    if (analyzing) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setAnalyzing(true);
    setCurrentStepIndex(0);
    setAnalysisComplete(false);
    setCreatedIncidentId(null);

    // Step-by-step pipeline simulation
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      if (step < scenario.simulationSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(timerRef.current);
        setAnalyzing(false);
        setAnalysisComplete(true);

        // Escalation Logic:
        // Scenarios A, B, C escalate and create an incident
        // Scenario D (Festival) is harmless and suppressed!
        if (scenario.deterministicVerdict.escalate) {
          const newInc = createIncident({
            nodeId: scenario.nodeId,
            nodeName: scenario.locationName,
            lat: scenario.nodeId === 'NODE-GNT-01' ? 16.3032 : scenario.nodeId === 'NODE-GNT-04' ? 16.3150 : 16.2978,
            lng: scenario.nodeId === 'NODE-GNT-01' ? 80.4439 : scenario.nodeId === 'NODE-GNT-04' ? 80.4285 : 80.4534,
            type: scenario.key,
            category: scenario.category,
            severity: scenario.severity,
            confidenceScore: scenario.deterministicVerdict.confidenceScore,
            audioEvidence: {
              detectedPhrase: scenario.audioSignals.primaryKeyword,
              decibelPeak: parseFloat(scenario.audioSignals.detectedDecibel) || 88,
              acousticConfidence: scenario.audioSignals.confidence / 100,
              waveformSignature: `${scenario.audioSignals.peakFrequency} simulated signature`,
            },
            visualEvidence: {
              postureDetected: scenario.visualSignals.postureAnomaly,
              densityAnomaly: scenario.visualSignals.motionEntropy,
              visualConfidence: scenario.visualSignals.confidence / 100,
            },
            sitrep: `[Simulated Lab Escalation] ${scenario.title}: ${scenario.description}`,
          });
          setCreatedIncidentId(newInc.id);
        } else {
          addToast(
            'Harmless festive noise suppressed: Benign classification confirmed. Zero false emergency dispatches.',
            'info',
            6000
          );
        }
      }
    }, 850);
  };

  const isEscalated = scenario.deterministicVerdict.escalate;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-command-900 border border-command-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Distress Detection & Edge AI Laboratory
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              SIMULATED EDGE INFERENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate real-time multi-modal edge sensor processing (Indic acoustic keyword spotting + optical pose/density estimation) on autonomous civic safety nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {analyzing && (
            <button
              onClick={handleCancelAnalysis}
              className="px-3.5 py-2.5 rounded-xl bg-command-800 hover:bg-command-700 text-red-400 border border-red-500/40 text-xs font-bold font-mono uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
          )}

          <button
            disabled={analyzing}
            onClick={handleStartAnalysis}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
              analyzing
                ? 'bg-command-800 text-cyan-300 border border-cyan-500/40 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black shadow-cyan-950/40 border border-cyan-400/40 active:scale-95'
            }`}
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Simulating Stream ({currentStepIndex + 1}/5)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{analysisComplete ? 'Re-Run Edge Simulation' : 'Start Edge Analysis'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Selectable Scenarios Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LAB_SCENARIOS.map((item, idx) => {
          const isSelected = selectedScenarioIndex === idx;
          const isBenign = !item.deterministicVerdict.escalate;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectScenario(idx)}
              className={`p-3.5 rounded-xl text-left border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-command-850 border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                  : 'bg-command-900/80 hover:bg-command-850/80 border-command-700/60 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {item.id.replace('_', ' ')}
                </span>
                {isBenign ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    BENIGN
                  </span>
                ) : (
                  <SeverityBadge severity={item.severity} />
                )}
              </div>

              <div className="font-bold text-xs text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                {item.title.split('. ')[1]}
              </div>

              <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {item.description}
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Scenario Inspection & Multi-Modal Signal Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Waveform, Signals, & Real-Time Indicators (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Audio Waveform Card */}
          <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold font-mono text-slate-200">
                  ACOUSTIC SENSOR STREAM [DUAL-MIC ARRAY]
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                Peak: {scenario.audioSignals.detectedDecibel}
              </span>
            </div>

            <AudioWaveform
              active={analyzing || analysisComplete}
              scenarioKey={scenario.key}
              color={
                scenario.key === 'FESTIVAL_HARMLESS'
                  ? '#10B981'
                  : scenario.severity === 'CRITICAL'
                  ? '#EF4444'
                  : '#06B6D4'
              }
              height={100}
            />

            {/* Audio Signal Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono bg-command-950 p-2.5 rounded-lg border border-command-800">
              <div>
                <span className="text-slate-400 block text-[10px]">DETECTED KEYWORD:</span>
                <span className="text-cyan-300 font-semibold truncate block">
                  {scenario.audioSignals.primaryKeyword}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">FREQ PROFILE:</span>
                <span className="text-slate-200 block truncate">
                  {scenario.audioSignals.peakFrequency}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NLP CONFIDENCE:</span>
                <span className="text-emerald-400 font-bold block">
                  {scenario.audioSignals.confidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Visual Sensor Reticle & Signal Breakdown */}
          <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold font-mono text-slate-200">
                  OPTICAL SKELETAL / DENSITY SCANNER
                </span>
              </div>
              <span className="text-[11px] font-mono text-teal-400">
                Confidence: {scenario.visualSignals.confidence}%
              </span>
            </div>

            {/* Scanning Reticle Graphic */}
            <div className="relative h-44 rounded-lg bg-command-950 border border-command-800 flex items-center justify-center overflow-hidden">
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Scanning laser line if analyzing */}
              {analyzing && (
                <div className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#00F0FF] animate-bounce top-2" />
              )}

              {/* Reticle UI */}
              <div className="relative z-10 text-center space-y-1.5 p-4">
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-cyan-500/50 flex items-center justify-center animate-spin-slow">
                  <div className="w-10 h-10 rounded-full border border-teal-400/80 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                </div>

                <div className="font-mono text-xs text-cyan-300 font-bold">
                  {scenario.locationName}
                </div>
                <div className="text-[11px] text-slate-400">
                  Posture: <span className="text-slate-200">{scenario.visualSignals.postureAnomaly}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Motion Entropy: {scenario.visualSignals.motionEntropy}
                </div>
              </div>

              {/* Bounding Box Corner Reticles */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Edge Inference Pipeline & Classification Verdict (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step Sequence Timeline */}
          <div className="glass-panel p-4 rounded-xl border border-command-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Edge Processing Sequence
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {currentStepIndex >= 0 ? `Step ${currentStepIndex + 1}/5` : 'Standby'}
              </span>
            </div>

            <div className="space-y-2">
              {scenario.simulationSteps.map((s, idx) => {
                const isCurrent = currentStepIndex === idx && analyzing;
                const isPassed = currentStepIndex > idx || analysisComplete;

                return (
                  <div
                    key={s.step}
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-500/50'
                        : isPassed
                        ? 'bg-command-950/80 border-emerald-500/30 text-slate-300'
                        : 'bg-command-950/30 border-command-800/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono font-semibold">
                      {isPassed ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[10px] flex items-center justify-center shrink-0">
                          {s.step}
                        </span>
                      )}
                      <span>{s.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 pl-5.5 leading-relaxed">
                      {s.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Classification Verdict & Outcome Card */}
          <div
            className={`p-4 rounded-xl border shadow-xl transition-all ${
              analysisComplete
                ? isEscalated
                  ? 'bg-red-950/30 border-red-500/60'
                  : 'bg-emerald-950/30 border-emerald-500/60'
                : 'bg-command-900 border-command-700/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Deterministic Fusion Verdict
              </span>
              {analysisComplete && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isEscalated
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isEscalated ? 'ESCALATION REQUIRED' : 'BENIGN EVENT'}
                </span>
              )}
            </div>

            {analysisComplete ? (
              <div className="mt-3 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  {isEscalated ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-sm font-bold text-white">
                      {scenario.deterministicVerdict.verdictType}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {scenario.deterministicVerdict.recommendedAction}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-command-950 border border-command-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Edge Confidence Score:</span>
                  <span
                    className={`font-bold ${
                      isEscalated ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {(scenario.deterministicVerdict.confidenceScore * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Action button post-analysis */}
                {isEscalated && createdIncidentId ? (
                  <button
                    onClick={() => {
                      setSelectedIncidentId(createdIncidentId);
                      setActiveTab('incidents');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-red-950/40 transition-colors"
                  >
                    <span>View Created Incident ({createdIncidentId}) →</span>
                  </button>
                ) : !isEscalated ? (
                  <div className="text-[11px] text-emerald-300/90 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed">
                    ✓ Intelligent False Positive Suppression: Festive rhythmic drumming and absence of threat keywords properly prevented public panic and unnecessary emergency dispatch.
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 text-center py-4 text-slate-400 text-xs">
                Press <span className="text-cyan-300 font-semibold">Start Edge Analysis</span> above to trigger the simulated dual-modal inference pipeline.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
