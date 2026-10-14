import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_NODES,
  INITIAL_PATROLS,
  INITIAL_INCIDENTS,
  INITIAL_ANALYTICS_DATA,
} from '../data/seedData';
import { calculateDistanceKm } from '../utils/geo';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  INCIDENTS: 'abhaya_setu_incidents_v1',
  NODES: 'abhaya_setu_nodes_v1',
  PATROLS: 'abhaya_setu_patrols_v1',
  PRIVACY: 'abhaya_setu_privacy_v1',
  SETTINGS: 'abhaya_setu_settings_v1',
};

const DEFAULT_PRIVACY_CONFIG = {
  edgeOnlyProcessing: true,
  zeroContinuousCloudVideo: true,
  rollingBufferMinutes: 5,
  metadataRetentionDays: 7,
  voicePitchAnonymization: true,
  biometricFacialRecognition: false, // Strict NO
  humanVerificationMandatory: true,
  auditLogImmutable: true,
};

const DEFAULT_SIMULATION_CONFIG = {
  edgeSimDelayMs: 1000,
  strobeSoundEnabled: true,
  autoAcknowledgeDispatch: false,
  highContrastMode: false,
};

// Helper for safe JSON parsing with corrupted data recovery
function safeParseArray(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch (e) {
    console.warn(`Recovered from invalid/corrupted localStorage key [${key}]. Restoring default seeds.`, e);
    return fallback;
  }
}

function safeParseObject(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return typeof parsed === 'object' && parsed !== null ? parsed : fallback;
  } catch (e) {
    console.warn(`Recovered from invalid/corrupted localStorage key [${key}]. Restoring defaults.`, e);
    return fallback;
  }
}

export function AppProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('command');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Persistent Domain State with corrupted JSON recovery
  const [incidents, setIncidents] = useState(() => safeParseArray(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS));
  const [nodes, setNodes] = useState(() => safeParseArray(STORAGE_KEYS.NODES, INITIAL_NODES));
  const [patrols, setPatrols] = useState(() => safeParseArray(STORAGE_KEYS.PATROLS, INITIAL_PATROLS));
  const [privacySettings, setPrivacySettings] = useState(() => safeParseObject(STORAGE_KEYS.PRIVACY, DEFAULT_PRIVACY_CONFIG));
  const [simulationSettings, setSimulationSettings] = useState(() => safeParseObject(STORAGE_KEYS.SETTINGS, DEFAULT_SIMULATION_CONFIG));

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
    } catch (e) {
      console.error('Error saving incidents', e);
    }
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(nodes));
    } catch (e) {
      console.error('Error saving nodes', e);
    }
  }, [nodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATROLS, JSON.stringify(patrols));
    } catch (e) {
      console.error('Error saving patrols', e);
    }
  }, [patrols]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(privacySettings));
    } catch (e) {
      console.error('Error saving privacy settings', e);
    }
  }, [privacySettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(simulationSettings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }, [simulationSettings]);

  // Toast notification helper
  const addToast = (message, type = 'info', durationMs = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper: Find Nearest Patrol to a node coordinate
  const findNearestAvailablePatrol = (targetLat, targetLng) => {
    const available = patrols.filter((p) => p.status === 'AVAILABLE');
    if (!available.length) return null;

    let nearest = null;
    let minDistance = Infinity;

    for (const patrol of available) {
      const dist = calculateDistanceKm(targetLat, targetLng, patrol.lat, patrol.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { ...patrol, distanceKm: dist };
      }
    }
    return nearest;
  };

  // 1. CREATE INCIDENT (e.g. from Detection Lab or SOS)
  const createIncident = (newIncidentData) => {
    const id = `INC-2026-${Math.floor(882 + Math.random() * 115)}`;
    const now = new Date();

    const incident = {
      id,
      timestamp: now.toISOString(),
      status: 'PENDING_REVIEW', // detected -> pending review
      timeline: [
        {
          time: now.toLocaleTimeString(),
          event: `Incident flagged by node ${newIncidentData.nodeId || 'SYSTEM'}`,
          actor: 'EDGE_INFERENCE_ENGINE',
        },
        {
          time: now.toLocaleTimeString(),
          event: 'Queued for Operator Human-in-the-Loop review',
          actor: 'SETU_DISPATCH_CORE',
        },
      ],
      assignedPatrolId: null,
      strobeActive: false,
      operatorNotes: '',
      ...newIncidentData,
    };

    setIncidents((prev) => [incident, ...prev]);
    addToast(`New incident created: ${incident.id} (${incident.category || 'Emergency Alert'})`, 'warning');
    return incident;
  };

  // 2. TRIGGER EMERGENCY SOS
  const triggerSos = (nodeId = 'NODE-GNT-01', customNotes = 'Emergency SOS triggered by public booth') => {
    const targetNode = nodes.find((n) => n.id === nodeId) || nodes[0];
    const now = new Date();
    const id = `INC-2026-SOS-${Math.floor(100 + Math.random() * 900)}`;

    const sosIncident = {
      id,
      nodeId: targetNode.id,
      nodeName: targetNode.name,
      lat: targetNode.lat,
      lng: targetNode.lng,
      timestamp: now.toISOString(),
      type: 'MANUAL_SOS',
      category: 'Direct SOS Trigger / High Priority Distress',
      severity: 'CRITICAL',
      status: 'PENDING_REVIEW',
      confidenceScore: 1.0,
      audioEvidence: {
        detectedPhrase: 'Direct Public Physical SOS Button Actuated',
        decibelPeak: 98.0,
        acousticConfidence: 1.0,
        waveformSignature: 'Continuous Dual-Tone Siren / Strobe Beacon Sync',
      },
      visualEvidence: {
        postureDetected: 'Immediate Manual Activation at Safety Pole',
        densityAnomaly: 'High priority zone alert',
        visualConfidence: 1.0,
      },
      assignedPatrolId: null,
      sitrep: `HIGH PRIORITY SOS: Emergency distress button pressed at ${targetNode.name}. Local audio-visual beacon activated. Immediate operator verification required.`,
      timeline: [
        {
          time: now.toLocaleTimeString(),
          event: 'Physical SOS button activated on node',
          actor: 'CITIZEN_PANIC_TRIGGER',
        },
        {
          time: now.toLocaleTimeString(),
          event: 'Local safety node siren and 2400-lumen strobe illuminated',
          actor: 'NODE_ACTUATOR',
        },
        {
          time: now.toLocaleTimeString(),
          event: 'Priority-1 escalation routed to human review desk',
          actor: 'SETU_CORE_ROUTER',
        },
      ],
      strobeActive: true,
      operatorNotes: customNotes,
    };

    // Activate strobe on that node
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === targetNode.id
          ? {
              ...n,
              sensors: {
                ...n.sensors,
                strobeUnit: { ...n.sensors.strobeUnit, powerState: true },
                audioBeacon: { ...n.sensors.audioBeacon, powerState: true },
              },
            }
          : n
      )
    );

    setIncidents((prev) => [sosIncident, ...prev]);
    setSelectedIncidentId(sosIncident.id);
    addToast(`🚨 CRITICAL SOS ACTIVATED at ${targetNode.name}!`, 'danger', 6000);
    return sosIncident;
  };

  // 3. OPERATOR VERIFICATION
  const verifyIncident = (incidentId, operatorNotes = 'Verified by Command Center Operator') => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) {
      addToast(`Incident not found: ${incidentId}`, 'danger');
      return false;
    }
    if (targetInc.status === 'DISMISSED') {
      addToast(`Cannot verify: Incident ${incidentId} was dismissed as a false alarm.`, 'danger');
      return false;
    }
    if (targetInc.status === 'RESOLVED') {
      addToast(`Cannot verify: Incident ${incidentId} is already resolved.`, 'warning');
      return false;
    }
    if (targetInc.status !== 'PENDING_REVIEW') {
      addToast(`Incident ${incidentId} is already verified (Status: ${targetInc.status}).`, 'info');
      return false;
    }

    const now = new Date();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updatedTimeline = [
            ...inc.timeline,
            {
              time: now.toLocaleTimeString(),
              event: `Operator verified threat: ${operatorNotes}`,
              actor: 'OPERATOR_DESK',
            },
          ];
          return {
            ...inc,
            status: 'VERIFIED',
            operatorNotes: operatorNotes,
            timeline: updatedTimeline,
          };
        }
        return inc;
      })
    );
    addToast(`Incident ${incidentId} marked VERIFIED. Ready for patrol dispatch.`, 'info');
    return true;
  };

  // 4. DISMISS FALSE ALARM
  const dismissIncident = (incidentId, reason = 'Operator classified as Benign / False Alarm') => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) {
      addToast(`Incident not found: ${incidentId}`, 'danger');
      return false;
    }
    if (targetInc.status === 'RESOLVED') {
      addToast(`Cannot dismiss: Incident ${incidentId} is already resolved.`, 'warning');
      return false;
    }
    if (targetInc.status === 'DISMISSED') {
      addToast(`Incident ${incidentId} is already dismissed.`, 'info');
      return false;
    }

    const now = new Date();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'DISMISSED',
            operatorNotes: `[DISMISSED] ${reason}`,
            timeline: [
              ...inc.timeline,
              {
                time: now.toLocaleTimeString(),
                event: `False alarm dismissed: ${reason}`,
                actor: 'OPERATOR_DESK',
              },
            ],
          };
        }
        return inc;
      })
    );

    // If patrol was assigned, release them back to AVAILABLE
    if (targetInc.assignedPatrolId) {
      setPatrols((prev) =>
        prev.map((p) =>
          p.id === targetInc.assignedPatrolId
            ? { ...p, status: 'AVAILABLE', currentIncidentId: null }
            : p
        )
      );
    }

    // Turn off strobe on the node if it was active
    if (targetInc.nodeId) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === targetInc.nodeId
            ? {
                ...n,
                sensors: {
                  ...n.sensors,
                  strobeUnit: { ...n.sensors.strobeUnit, powerState: false },
                  audioBeacon: { ...n.sensors.audioBeacon, powerState: false },
                },
              }
            : n
        )
      );
    }

    addToast(`Incident ${incidentId} dismissed as False Positive.`, 'info');
    return true;
  };

  // 5. ASSIGN PATROL TO INCIDENT
  const assignPatrol = (incidentId, patrolId) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) {
      addToast(`Incident not found: ${incidentId}`, 'danger');
      return false;
    }

    // Guard: Incident must be in VERIFIED state
    if (targetInc.status === 'DISMISSED') {
      addToast(`Cannot dispatch: Incident ${incidentId} was dismissed as a false alarm.`, 'danger');
      return false;
    }
    if (targetInc.status === 'RESOLVED') {
      addToast(`Cannot dispatch: Incident ${incidentId} is already resolved.`, 'danger');
      return false;
    }
    if (targetInc.status === 'PENDING_REVIEW') {
      addToast(`Operator verification required before dispatching patrol to ${incidentId}.`, 'warning');
      return false;
    }
    if (targetInc.status !== 'VERIFIED') {
      addToast(`Incident ${incidentId} is not in a dispatchable state (${targetInc.status}).`, 'warning');
      return false;
    }

    const patrol = patrols.find((p) => p.id === patrolId);
    if (!patrol) {
      addToast(`Patrol unit not found: ${patrolId}`, 'danger');
      return false;
    }

    // Guard: patrol must be AVAILABLE (cannot assign to 2 active incidents!)
    if (patrol.status !== 'AVAILABLE') {
      addToast(`Patrol ${patrol.callSign} is currently busy (${patrol.status}) and cannot be assigned to multiple active incidents.`, 'danger');
      return false;
    }

    const now = new Date();

    // Update Incident
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'ASSIGNED',
            assignedPatrolId: patrolId,
            timeline: [
              ...inc.timeline,
              {
                time: now.toLocaleTimeString(),
                event: `Assigned to ${patrol.callSign} (${patrol.officer1})`,
                actor: 'DISPATCH_CONTROLLER',
              },
            ],
          };
        }
        return inc;
      })
    );

    // Update Patrol
    setPatrols((prev) =>
      prev.map((p) => {
        if (p.id === patrolId) {
          return {
            ...p,
            status: 'ASSIGNED',
            currentIncidentId: incidentId,
          };
        }
        return p;
      })
    );

    addToast(`Assigned ${patrol.callSign} to ${incidentId}.`, 'success');
    return true;
  };

  // 6. UPDATE INCIDENT LIFECYCLE (e.g. ASSIGNED -> RESPONDING -> RESOLVED)
  const updateIncidentStatus = (incidentId, newStatus) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    if (!targetInc) {
      addToast(`Incident not found: ${incidentId}`, 'danger');
      return false;
    }

    // Prevent transitions on terminal states
    if (targetInc.status === 'RESOLVED' || targetInc.status === 'DISMISSED') {
      addToast(`Cannot modify terminal incident ${incidentId} (${targetInc.status}).`, 'danger');
      return false;
    }

    // State machine check
    const validTransitions = {
      'PENDING_REVIEW': ['VERIFIED', 'DISMISSED'],
      'VERIFIED': ['ASSIGNED', 'DISMISSED'],
      'ASSIGNED': ['RESPONDING', 'DISMISSED'],
      'RESPONDING': ['RESOLVED', 'DISMISSED'],
    };

    const allowed = validTransitions[targetInc.status] || [];
    if (!allowed.includes(newStatus)) {
      addToast(`Invalid lifecycle transition from ${targetInc.status} to ${newStatus}.`, 'warning');
      return false;
    }

    const now = new Date();

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: newStatus,
            timeline: [
              ...inc.timeline,
              {
                time: now.toLocaleTimeString(),
                event: `Status transitioned to ${newStatus}`,
                actor: 'COMMAND_SYSTEM',
              },
            ],
          };
        }
        return inc;
      })
    );

    // Sync patrol status
    if (targetInc.assignedPatrolId) {
      if (newStatus === 'RESPONDING') {
        setPatrols((prev) =>
          prev.map((p) =>
            p.id === targetInc.assignedPatrolId
              ? { ...p, status: 'RESPONDING', speedKmh: 42 }
              : p
          )
        );
      } else if (newStatus === 'RESOLVED') {
        // Free patrol back to AVAILABLE
        setPatrols((prev) =>
          prev.map((p) =>
            p.id === targetInc.assignedPatrolId
              ? { ...p, status: 'AVAILABLE', currentIncidentId: null, speedKmh: 0 }
              : p
          )
        );
        // Turn off strobe on the node if still on
        setNodes((prev) =>
          prev.map((n) =>
            n.id === targetInc.nodeId
              ? {
                  ...n,
                  sensors: {
                    ...n.sensors,
                    strobeUnit: { ...n.sensors.strobeUnit, powerState: false },
                    audioBeacon: { ...n.sensors.audioBeacon, powerState: false },
                  },
                }
              : n
          )
        );

        // Visual celebration burst for successful de-escalation
        try {
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#06B6D4', '#14B8A6', '#10B981'],
            });
          }
        } catch (e) {
          // Graceful fallback in non-browser/test environments
        }
      }
    }

    addToast(`Incident ${incidentId} is now ${newStatus}.`, 'info');
    return true;
  };

  // 7. TOGGLE HARDWARE ACTUATORS
  const toggleNodeStrobe = (nodeId) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const currentState = n.sensors.strobeUnit.powerState;
          const nextState = !currentState;
          addToast(
            `Node ${nodeId} high-intensity strobe turned ${nextState ? 'ON' : 'OFF'}`,
            nextState ? 'warning' : 'info'
          );
          return {
            ...n,
            sensors: {
              ...n.sensors,
              strobeUnit: { ...n.sensors.strobeUnit, powerState: nextState },
            },
          };
        }
        return n;
      })
    );
  };

  const toggleNodeBeacon = (nodeId) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const currentState = n.sensors.audioBeacon.powerState;
          const nextState = !currentState;
          addToast(
            `Node ${nodeId} audio guidance beacon turned ${nextState ? 'ON' : 'OFF'}`,
            nextState ? 'warning' : 'info'
          );
          return {
            ...n,
            sensors: {
              ...n.sensors,
              audioBeacon: { ...n.sensors.audioBeacon, powerState: nextState },
            },
          };
        }
        return n;
      })
    );
  };

  // 8. UPDATE NODE DETAILS
  const updateNode = (nodeId, updates) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
    );
    addToast(`Node ${nodeId} updated.`, 'info');
  };

  // 9. COMPLETE SYSTEM RESET
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.NODES);
    localStorage.removeItem(STORAGE_KEYS.PATROLS);
    localStorage.removeItem(STORAGE_KEYS.PRIVACY);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    setIncidents(INITIAL_INCIDENTS);
    setNodes(INITIAL_NODES);
    setPatrols(INITIAL_PATROLS);
    setPrivacySettings(DEFAULT_PRIVACY_CONFIG);
    setSimulationSettings(DEFAULT_SIMULATION_CONFIG);
    setSelectedIncidentId(null);

    addToast('System reset: All demonstration data and states restored to factory defaults.', 'success', 5000);
  };

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || null;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedIncidentId,
        setSelectedIncidentId,
        selectedIncident,
        isSosModalOpen,
        setIsSosModalOpen,
        incidents,
        nodes,
        patrols,
        privacySettings,
        setPrivacySettings,
        simulationSettings,
        setSimulationSettings,
        toasts,
        addToast,
        removeToast,
        createIncident,
        triggerSos,
        verifyIncident,
        dismissIncident,
        assignPatrol,
        updateIncidentStatus,
        toggleNodeStrobe,
        toggleNodeBeacon,
        updateNode,
        findNearestAvailablePatrol,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
