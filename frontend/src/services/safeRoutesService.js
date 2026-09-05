// Safe Routes Service
// Manages AI-evaluated evacuation corridors, road obstacle avoidance, and turn-by-turn guidance.

export const mockSafeRoutes = [
  {
    id: 'RT-ALPHA',
    name: 'Corridor Alpha: North High Ground Expressway',
    destination: 'North Central Civic Center',
    recommended: true,
    safetyScore: 96,
    estimatedTime: '11 mins (Drive) / 32 mins (Walk)',
    distance: '3.4 km',
    elevationProfile: 'Ascending (+32m climb, zero flood dip)',
    status: 'CLEAR & MONITORED',
    hazardsAvoided: [
      'Bypasses Lowland Underpass (Submerged 1.4m)',
      'Avoids Victoria Bridge Collision Zone',
      'Steers clear of down powerline sector #4'
    ],
    turnByTurn: [
      { step: 1, action: 'Head North on Parkline Blvd for 600m', safe: true },
      { step: 2, action: 'Turn right onto Ridgeview Overpass (Elevated Roadway)', safe: true },
      { step: 3, action: 'Continue 2.1 km along High Crest Highway (Free flowing)', safe: true },
      { step: 4, action: 'Take Exit 4B straight into North Civic Center Triage Gate', safe: true }
    ]
  },
  {
    id: 'RT-BETA',
    name: 'Corridor Beta: West Ridge Secondary Bypass',
    destination: 'St. Jude Memorial Arena',
    recommended: false,
    safetyScore: 78,
    estimatedTime: '19 mins (Drive) / 48 mins (Walk)',
    distance: '4.8 km',
    elevationProfile: 'Rolling hills, minor water pooling near Mile 2',
    status: 'PASSABLE WITH CAUTION',
    hazardsAvoided: [
      'Avoids main coastal artery',
      'Bypasses congested city center gridlock'
    ],
    turnByTurn: [
      { step: 1, action: 'Head West on Valley Street for 800m', safe: true },
      { step: 2, action: 'Caution: Shallow water pooling (10cm) near Rail Crossing', safe: false },
      { step: 3, action: 'Ascend West Hill Boulevard for 3.2 km', safe: true },
      { step: 4, action: 'Arrive at St. Jude Memorial Arena West Parking Entrance', safe: true }
    ]
  }
];

/**
 * Fetch all available evacuation routes
 * @param {Object} [options] - Routing constraints (e.g. avoidFloods, avoidBridges)
 * @returns {Promise<Array>} List of safe route plans
 */
export async function getSafeRoutes(options = {}) {
  // TODO: replace with real API call, e.g.:
  // const query = new URLSearchParams(options).toString();
  // const res = await fetch(`/api/routes?${query}`);
  // if (!res.ok) throw new Error('Failed to fetch evacuation routes');
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockSafeRoutes]);
    }, 10);
  });
}

/**
 * Fetch a specific evacuation route by ID
 * @param {string} routeId
 * @returns {Promise<Object|null>}
 */
export async function getRouteById(routeId) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/routes/${routeId}`);
  // return res.json();

  return new Promise((resolve) => {
    const route = mockSafeRoutes.find((r) => r.id === routeId) || null;
    resolve(route);
  });
}
