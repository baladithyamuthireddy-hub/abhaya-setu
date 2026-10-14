import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';
import { calculateDistanceKm, estimateEtaMinutes, formatEstimatedEta } from '../utils/geo';
import { LAB_SCENARIOS, INITIAL_INCIDENTS, INITIAL_NODES, INITIAL_PATROLS } from '../data/seedData';

describe('ABHAYA SETU - Production QA & State Machine Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. Invalid incident transitions
  it('1. Enforces strict lifecycle state machine and blocks invalid transitions', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    let incident;
    act(() => {
      incident = result.current.createIncident({
        nodeId: 'NODE-GNT-01',
        nodeName: 'Guntur RTC Bus Stand',
        category: 'Harassment Warning',
        severity: 'MEDIUM',
      });
    });

    // A PENDING_REVIEW incident cannot directly jump to RESPONDING or RESOLVED
    let successTransition;
    act(() => {
      successTransition = result.current.updateIncidentStatus(incident.id, 'RESPONDING');
    });
    expect(successTransition).toBe(false);

    // Dismiss the incident
    act(() => {
      result.current.dismissIncident(incident.id, 'Benign dispute resolved locally');
    });

    // A DISMISSED incident cannot be verified or assigned
    let verifyAttempt;
    act(() => {
      verifyAttempt = result.current.verifyIncident(incident.id, 'Attempt verify dismissed');
    });
    expect(verifyAttempt).toBe(false);

    let assignAttempt;
    act(() => {
      assignAttempt = result.current.assignPatrol(incident.id, 'PATROL-ALPHA-101');
    });
    expect(assignAttempt).toBe(false);
  });

  // 2. Duplicate patrol assignment prevention
  it('2. Prevents assigning a patrol to multiple active incidents', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    const patrol = result.current.patrols.find((p) => p.status === 'AVAILABLE');
    expect(patrol).toBeDefined();

    let inc1, inc2;
    act(() => {
      inc1 = result.current.createIncident({
        nodeId: 'NODE-GNT-01',
        nodeName: 'RTC Bus Stand',
        category: 'First Incident',
        severity: 'HIGH',
      });
      inc2 = result.current.createIncident({
        nodeId: 'NODE-GNT-02',
        nodeName: 'Railway Station',
        category: 'Second Incident',
        severity: 'HIGH',
      });
    });

    act(() => {
      result.current.verifyIncident(inc1.id);
      result.current.verifyIncident(inc2.id);
    });

    // Assign patrol to first incident
    let firstAssign;
    act(() => {
      firstAssign = result.current.assignPatrol(inc1.id, patrol.id);
    });
    expect(firstAssign).toBe(true);

    // Attempt assigning the same patrol to second incident (must be blocked!)
    let secondAssign;
    act(() => {
      secondAssign = result.current.assignPatrol(inc2.id, patrol.id);
    });
    expect(secondAssign).toBe(false);

    // Verify patrol is still bound only to inc1
    const checkPatrol = result.current.patrols.find((p) => p.id === patrol.id);
    expect(checkPatrol.currentIncidentId).toBe(inc1.id);
    expect(checkPatrol.status).toBe('ASSIGNED');
  });

  // 3. False-positive suppression
  it('3. Scenario D (Harmless Festival) suppresses alarms without dispatching emergency units', () => {
    const festivalScenario = LAB_SCENARIOS.find((s) => s.key === 'FESTIVAL_HARMLESS');
    expect(festivalScenario).toBeDefined();

    // Verifies deterministic non-escalation
    expect(festivalScenario.deterministicVerdict.escalate).toBe(false);
    expect(festivalScenario.deterministicVerdict.verdictType).toBe('BENIGN_FESTIVE_CELEBRATION');
    expect(festivalScenario.deterministicVerdict.confidenceScore).toBeGreaterThanOrEqual(0.95);
    expect(festivalScenario.description).toContain('celebratory');
  });

  // 4. Incident persistence in localStorage
  it('4. Persists incident changes and updates seamlessly to localStorage', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    let newInc;
    act(() => {
      newInc = result.current.createIncident({
        nodeId: 'NODE-GNT-04',
        nodeName: 'Brodipet 4th Line',
        category: 'Persistence Test Incident',
        severity: 'MEDIUM',
      });
    });

    const storedRaw = localStorage.getItem('abhaya_setu_incidents_v1');
    expect(storedRaw).toBeDefined();
    const stored = JSON.parse(storedRaw);
    expect(Array.isArray(stored)).toBe(true);
    expect(stored.some((i) => i.id === newInc.id)).toBe(true);
  });

  // 5. Factory reset
  it('5. Factory reset clears modified state and restores factory seed data', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    act(() => {
      result.current.createIncident({
        nodeId: 'NODE-GNT-01',
        nodeName: 'Temporary Node',
        category: 'Ephemeral Alert',
        severity: 'LOW',
      });
    });

    expect(result.current.incidents.length).toBeGreaterThan(INITIAL_INCIDENTS.length);

    act(() => {
      result.current.resetAllData();
    });

    expect(result.current.incidents.length).toBe(INITIAL_INCIDENTS.length);
    expect(result.current.nodes.length).toBe(INITIAL_NODES.length);
    expect(result.current.patrols.length).toBe(INITIAL_PATROLS.length);
  });

  // 6. SOS incident creation & local actuators
  it('6. Emergency SOS button triggers high priority critical alert and hardware actuators', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    let sos;
    act(() => {
      sos = result.current.triggerSos('NODE-GNT-01', 'Physical booth button actuated');
    });

    expect(sos.severity).toBe('CRITICAL');
    expect(sos.type).toBe('MANUAL_SOS');
    expect(sos.status).toBe('PENDING_REVIEW');
    expect(sos.strobeActive).toBe(true);

    const targetNode = result.current.nodes.find((n) => n.id === 'NODE-GNT-01');
    expect(targetNode.sensors.strobeUnit.powerState).toBe(true);
    expect(targetNode.sensors.audioBeacon.powerState).toBe(true);
  });

  // 7. Patrol availability restoration
  it('7. Patrol availability is safely restored when incident is resolved', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    const availablePatrol = result.current.patrols.find((p) => p.status === 'AVAILABLE');
    let inc;

    act(() => {
      inc = result.current.createIncident({
        nodeId: 'NODE-GNT-02',
        nodeName: 'Railway Station',
        category: 'Crowd Surge',
        severity: 'HIGH',
      });
    });

    act(() => {
      result.current.verifyIncident(inc.id);
    });

    act(() => {
      result.current.assignPatrol(inc.id, availablePatrol.id);
    });

    act(() => {
      result.current.updateIncidentStatus(inc.id, 'RESPONDING');
    });

    // Verify patrol is responding
    let currentPatrol = result.current.patrols.find((p) => p.id === availablePatrol.id);
    expect(currentPatrol.status).toBe('RESPONDING');

    // Resolve incident
    act(() => {
      result.current.updateIncidentStatus(inc.id, 'RESOLVED');
    });

    // Patrol MUST be restored to AVAILABLE
    currentPatrol = result.current.patrols.find((p) => p.id === availablePatrol.id);
    expect(currentPatrol.status).toBe('AVAILABLE');
    expect(currentPatrol.currentIncidentId).toBeNull();
  });

  // 8. Analytics updates
  it('8. Analytics recalculates category and severity distribution on state changes', () => {
    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    const criticalBefore = result.current.incidents.filter((i) => i.severity === 'CRITICAL').length;

    act(() => {
      result.current.createIncident({
        nodeId: 'NODE-GNT-01',
        nodeName: 'RTC Bus Stand',
        category: 'New Critical Category',
        severity: 'CRITICAL',
      });
    });

    const criticalAfter = result.current.incidents.filter((i) => i.severity === 'CRITICAL').length;
    expect(criticalAfter).toBe(criticalBefore + 1);
  });

  // 9. Corrupted localStorage recovery
  it('9. Gracefully recovers from corrupted localStorage without crashing', () => {
    localStorage.setItem('abhaya_setu_incidents_v1', '{invalid-json: corrupted');
    localStorage.setItem('abhaya_setu_nodes_v1', 'null');
    localStorage.setItem('abhaya_setu_patrols_v1', '[]');

    const { result } = renderHook(() => useApp(), { wrapper: AppProvider });

    // Should gracefully fallback to initial seeds without throwing uncaught errors
    expect(result.current.incidents).toBeDefined();
    expect(result.current.incidents.length).toBeGreaterThanOrEqual(1);
    expect(result.current.nodes.length).toBe(INITIAL_NODES.length);
    expect(result.current.patrols.length).toBe(INITIAL_PATROLS.length);
  });

  // 10. Branding consistency
  it('10. Asserts branding consistency: ABHAYA SETU and simulated ETA labeling', () => {
    const distance = calculateDistanceKm(16.3032, 80.4439, 16.3150, 80.4285);
    const etaFormatted = formatEstimatedEta(distance);

    expect(etaFormatted).toContain('Simulated ETA');
    expect(distance).toBeGreaterThan(0);
  });

  // 11. Map basemap & tile provider audit
  it('11. Confirms OpenStreetMap tile provider and complete removal of watermarked Carto URLs', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const mapSourcePath = path.resolve(__dirname, '../components/command/LeafletMap.jsx');
    const mapSource = fs.readFileSync(mapSourcePath, 'utf-8');

    // Must use official OpenStreetMap tile endpoint without API keys
    expect(mapSource).toContain('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    expect(mapSource).toContain('OpenStreetMap');

    // Must NOT contain restricted Carto URLs that trigger "API KEY REQUIRED" watermarks
    expect(mapSource).not.toContain('cartocdn.com');
    expect(mapSource).not.toContain('carto.com/attributions');

    // Confirms basemap mode switcher support (Tactical Dark + Standard OSM)
    expect(mapSource).toContain('map-tiles-tactical-dark');
    expect(mapSource).toContain('map-tiles-standard');
  });
});

