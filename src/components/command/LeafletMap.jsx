import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { calculateDistanceKm } from '../../utils/geo';
import { SeverityBadge, StatusBadge } from '../common/Badge';

// Helper component to smoothly center map when an incident is selected
function MapRecenter({ targetCoords }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords && targetCoords[0] && targetCoords[1]) {
      map.flyTo(targetCoords, 15, { duration: 1.2 });
    }
  }, [targetCoords, map]);
  return null;
}

// Custom SVG Icons
function createNodeIcon(status, isStrobeActive) {
  const color = isStrobeActive
    ? '#EF4444'
    : status === 'ONLINE'
    ? '#06B6D4'
    : status === 'DEGRADED'
    ? '#F59E0B'
    : '#94A3B8';

  const pulseClass = isStrobeActive
    ? 'animate-ping opacity-75'
    : status === 'ONLINE'
    ? 'animate-pulse'
    : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: ${color}33; border: 1.5px solid ${color};" class="${pulseClass}"></div>
        <div style="position: relative; width: 22px; height: 22px; border-radius: 6px; background: #0B1220; border: 1.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}88;">
          <svg style="width: 13px; height: 13px; fill: none; stroke: ${color}; stroke-width: 2.2;" viewBox="0 0 24 24">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function createIncidentIcon(severity, isResolved) {
  const color = isResolved
    ? '#10B981'
    : severity === 'CRITICAL'
    ? '#EF4444'
    : severity === 'HIGH'
    ? '#F59E0B'
    : '#06B6D4';

  return L.divIcon({
    className: 'custom-incident-marker',
    html: `
      <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        ${
          !isResolved
            ? `<div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: ${color}44; border: 2px solid ${color}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ''
        }
        <div style="position: relative; width: 24px; height: 24px; border-radius: 9999px; background: #0F172A; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${color};">
          <svg style="width: 13px; height: 13px; fill: none; stroke: ${color}; stroke-width: 2.5;" viewBox="0 0 24 24">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

function createPatrolIcon(status) {
  const color =
    status === 'AVAILABLE'
      ? '#22D3EE'
      : status === 'RESPONDING'
      ? '#F59E0B'
      : '#94A3B8';

  return L.divIcon({
    className: 'custom-patrol-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 22px; height: 22px; border-radius: 9999px; background: #060A13; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px ${color}99;">
          <svg style="width: 12px; height: 12px; fill: none; stroke: ${color}; stroke-width: 2.2;" viewBox="0 0 24 24">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

export function LeafletMap({
  center = [16.3067, 80.4365],
  zoom = 14,
  focusCoords = null,
  onSelectIncident,
}) {
  const { incidents, nodes, patrols, toggleNodeStrobe } = useApp();
  const [basemapMode, setBasemapMode] = useState('dark'); // 'dark' (tactical dark filter) | 'standard' (natural OSM)

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-command-700/60 shadow-2xl bg-command-950">
      {/* Basemap Switcher (Tactical Dark vs Standard OSM) */}
      <div className="absolute top-3 right-3 z-[500] p-1 rounded-lg bg-command-900/95 backdrop-blur-md border border-command-700/80 shadow-xl flex items-center gap-1 text-[11px] font-mono pointer-events-auto">
        <button
          type="button"
          onClick={() => setBasemapMode('dark')}
          className={`px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 ${
            basemapMode === 'dark'
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-command-800'
          }`}
          title="Tactical Dark command-center filter"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]"></span>
          Tactical Dark
        </button>
        <button
          type="button"
          onClick={() => setBasemapMode('standard')}
          className={`px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1.5 ${
            basemapMode === 'standard'
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-command-800'
          }`}
          title="Standard OpenStreetMap natural view"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Standard OSM
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[500] p-2.5 rounded-lg bg-command-900/90 backdrop-blur-md border border-command-700/70 text-[11px] font-mono space-y-1.5 shadow-xl hidden sm:block pointer-events-auto">
        <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
          Map Layers
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-cyan-300" />
          <span className="text-slate-300">Safety Nodes ({nodes.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse border border-red-300" />
          <span className="text-slate-300">Active Incidents</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 border border-cyan-100" />
          <span className="text-slate-300">Patrol Units ({patrols.length})</span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter targetCoords={focusCoords} />

        {/* Supported OpenStreetMap tile provider (100% free, zero API key required, zero watermarks) */}
        <TileLayer
          key={basemapMode}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains="abc"
          maxZoom={19}
          className={basemapMode === 'dark' ? 'map-tiles-tactical-dark' : 'map-tiles-standard'}
          eventHandlers={{
            tileerror: (error) => {
              console.warn('Map tile load fallback handled gracefully:', error);
            },
          }}
        />


        {/* Safety Nodes Markers */}
        {nodes.map((node) => {
          const isStrobeOn = node.sensors?.strobeUnit?.powerState;
          return (
            <React.Fragment key={node.id}>
              {/* Radius ring */}
              <Circle
                center={[node.lat, node.lng]}
                radius={220}
                pathOptions={{
                  color: isStrobeOn ? '#EF4444' : '#06B6D4',
                  fillColor: isStrobeOn ? '#EF4444' : '#06B6D4',
                  fillOpacity: isStrobeOn ? 0.2 : 0.06,
                  weight: 1,
                  dashArray: '3, 6',
                }}
              />
              <Marker
                position={[node.lat, node.lng]}
                icon={createNodeIcon(node.status, isStrobeOn)}
              >
                <Popup className="custom-popup">
                  <div className="p-1 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-command-700 pb-1.5">
                      <span className="font-bold text-cyan-300 font-mono">{node.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        {node.status}
                      </span>
                    </div>

                    <div>
                      <div className="font-semibold text-slate-100">{node.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{node.landmark}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-command-950 p-1.5 rounded border border-command-800">
                      <div>
                        <span className="text-slate-400">NOISE:</span>{' '}
                        <span className="text-cyan-300">{node.sensors?.acoustic?.noiseDb} dB</span>
                      </div>
                      <div>
                        <span className="text-slate-400">UPTIME:</span>{' '}
                        <span className="text-emerald-300">{node.uptimePercent}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">STROBE:</span>{' '}
                        <span className={isStrobeOn ? 'text-red-400 font-bold' : 'text-slate-400'}>
                          {isStrobeOn ? 'STROBING' : 'OFF'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">BEACON:</span>{' '}
                        <span className="text-slate-300">
                          {node.sensors?.audioBeacon?.powerState ? 'ACTIVE' : 'IDLE'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleNodeStrobe(node.id)}
                      className={`w-full py-1 px-2 rounded text-[11px] font-semibold tracking-wide transition-colors ${
                        isStrobeOn
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-command-800 hover:bg-command-700 text-cyan-300 border border-command-700'
                      }`}
                    >
                      {isStrobeOn ? 'Deactivate Strobe' : 'Simulate Strobe Activation'}
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Incidents Markers */}
        {incidents.map((inc) => {
          const isResolved = inc.status === 'RESOLVED' || inc.status === 'DISMISSED';
          return (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={createIncidentIcon(inc.severity, isResolved)}
              eventHandlers={{
                click: () => {
                  if (onSelectIncident) onSelectIncident(inc.id);
                },
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-command-700 pb-1">
                    <span className="font-mono font-bold text-red-400">{inc.id}</span>
                    <SeverityBadge severity={inc.severity} />
                  </div>

                  <div>
                    <div className="font-semibold text-slate-100">{inc.category}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{inc.nodeName}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Status:</span>
                    <StatusBadge status={inc.status} />
                  </div>

                  <div className="text-[11px] text-slate-300 italic bg-command-950 p-1.5 rounded border border-command-800">
                    "{inc.sitrep?.slice(0, 90)}..."
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectIncident) onSelectIncident(inc.id);
                    }}
                    className="w-full py-1.5 px-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs tracking-wide"
                  >
                    Open Incident Situation Room
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Patrol Units Markers */}
        {patrols.map((patrol) => (
          <Marker
            key={patrol.id}
            position={[patrol.lat, patrol.lng]}
            icon={createPatrolIcon(patrol.status)}
          >
            <Popup>
              <div className="p-1 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2 border-b border-command-700 pb-1">
                  <span className="font-mono font-bold text-cyan-300">{patrol.callSign}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      patrol.status === 'AVAILABLE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : patrol.status === 'RESPONDING'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {patrol.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300">{patrol.vehicleType}</div>

                <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                  <div>Crew: {patrol.officer1}</div>
                  <div>Wing: {patrol.officer2}</div>
                  <div>Power: {patrol.batteryOrFuel}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
