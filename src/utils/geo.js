/**
 * Geographic calculation utilities for Abhaya Setu
 * Center: Guntur, Andhra Pradesh (approx 16.3067° N, 80.4365° E)
 */

// Calculate haversine distance in kilometers between two lat/lng points
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 999.0;
  }
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Format coordinates to standard notation
export function formatCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined) return 'N/A';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

// Approximate simulated response time based on Euclidean/Haversine distance (assumes 30 km/h city response speed + 1 min prep)
// NOTE: Demonstrative approximation, not live traffic satellite routing
export function estimateEtaMinutes(distanceKm) {
  if (!distanceKm || distanceKm <= 0) return 2;
  const transitMinutes = (distanceKm / 30) * 60;
  return Math.max(1, Math.round(transitMinutes + 1));
}

export function formatEstimatedEta(distanceKm) {
  const eta = estimateEtaMinutes(distanceKm);
  return `~${eta} min (Simulated ETA)`;
}

