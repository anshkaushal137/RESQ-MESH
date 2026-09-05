// Risk Map Service
// Manages GIS map nodes, telemetry pins, sensor readings, and polygon overlays.

export const mockMapNodes = [
  { id: 'PIN-1', type: 'shelter', name: 'North Civic Center', lat: 38, lng: 62, status: 'safe', label: 'Civic Center (780/1200)' },
  { id: 'PIN-2', type: 'shelter', name: 'St. Jude Arena', lat: 24, lng: 32, status: 'warning', label: 'St. Jude Arena (87% Full)' },
  { id: 'PIN-3', type: 'hazard', name: 'Bridge Collapse / Surge Breach', lat: 54, lng: 48, status: 'danger', label: 'Victoria Bridge Closed' },
  { id: 'PIN-4', type: 'hazard', name: 'Submerged Underpass', lat: 68, lng: 70, status: 'danger', label: 'Water Depth: 1.4m' },
  { id: 'PIN-5', type: 'unit', name: 'Rescue Boat Unit 02', lat: 60, lng: 52, status: 'active', label: 'Water Rescue in progress' },
  { id: 'PIN-6', type: 'unit', name: 'Ambulance Unit 07', lat: 30, lng: 58, status: 'active', label: 'Paramedic Transit' },
  { id: 'PIN-7', type: 'sensor', name: 'Water Gauge S-12', lat: 72, lng: 38, status: 'danger', label: 'Water Level +4.2m' }
];

export const mockMapLayers = {
  highHazardZone: {
    points: '10,80 40,88 75,70 95,90 95,98 5,98',
    fill: 'rgba(239, 68, 68, 0.22)',
    stroke: '#ef4444'
  },
  moderateSurgeZone: {
    points: '15,55 55,62 85,45 95,65 95,90 10,80',
    fill: 'rgba(245, 158, 11, 0.12)',
    stroke: '#f59e0b'
  },
  safeRidgeZone: {
    points: '10,5 90,5 90,35 60,30 20,40',
    fill: 'rgba(16, 185, 129, 0.1)',
    stroke: '#10b981'
  }
};

/**
 * Fetch all GIS map nodes and telemetry pins
 * @returns {Promise<Array>} List of map pins
 */
export async function getMapNodes() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/map/nodes');
  // if (!res.ok) throw new Error('Failed to fetch map pins');
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockMapNodes]);
    }, 10);
  });
}

/**
 * Fetch map layer vector coordinates and metadata
 * @returns {Promise<Object>} Map layers definition
 */
export async function getMapLayers() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/map/layers');
  // return res.json();

  return new Promise((resolve) => {
    resolve({ ...mockMapLayers });
  });
}
