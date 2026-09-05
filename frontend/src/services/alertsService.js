// Alerts Service
// Provides live emergency broadcast feeds, priority filters, and alert acknowledgments.

export const mockAlerts = [
  {
    id: 'ALT-101',
    scenarioId: 'cyclone-surge',
    priority: 'CRITICAL',
    title: 'MANDATORY EVACUATION: Coastal Sector 4 & Low Basin',
    timestamp: '3 mins ago',
    source: 'National Emergency Management Bureau (NEMB)',
    location: 'Coastal Sectors 1-6 (< 5m elevation)',
    summary: 'Water level surging rapidly. Breaches observed at South Levee. All residents must evacuate to designated high-ground shelters immediately.',
    actionRequired: 'Move Inland via Route Alpha (High Ground Corridor). Do NOT attempt to cross causeways.',
    type: 'Evacuation',
    status: 'Active'
  },
  {
    id: 'ALT-102',
    scenarioId: 'cyclone-surge',
    priority: 'CRITICAL',
    title: 'Severe Infrastructure Alert: Victoria Bridge Inundated',
    timestamp: '14 mins ago',
    source: 'Department of Public Safety & Highways',
    location: 'Victoria Bridge (Connecting East & Central Sector)',
    summary: 'Structural integrity compromised due to heavy debris collision. Bridge closed in both directions.',
    actionRequired: 'Reroute to Metro Flyover or West Ring Expressway.',
    type: 'Road Hazard',
    status: 'Active'
  },
  {
    id: 'ALT-103',
    scenarioId: 'cyclone-surge',
    priority: 'WARNING',
    title: 'High-Tension Power Grid Emergency De-energization',
    timestamp: '28 mins ago',
    source: 'Regional Energy Grid Commission',
    location: 'Delta Substation Grid #2 & #4',
    summary: 'Preventative shutoff initiated to avoid catastrophic transformer explosions and electrocution hazards in submerged zones.',
    actionRequired: 'Rely on battery backup and ResQ Mesh low-frequency radio beacons.',
    type: 'Infrastructure',
    status: 'Active'
  },
  {
    id: 'ALT-104',
    scenarioId: 'cyclone-surge',
    priority: 'ADVISORY',
    title: 'Mobile Water Purification Unit Deployed at North Shelter',
    timestamp: '42 mins ago',
    source: 'Red Cross Disaster Relief Corps',
    location: 'North High School Shelter (Zone 2)',
    summary: 'Safe drinking water distribution active. 10,000L clean water and emergency rations available.',
    actionRequired: 'Bring clean storage containers if possible. Water is ration-free for all evacuees.',
    type: 'Relief & Supplies',
    status: 'Active'
  },
  {
    id: 'ALT-105',
    scenarioId: 'flash-flood',
    priority: 'CRITICAL',
    title: 'FLASH FLOOD EMERGENCY: East River Overflow',
    timestamp: '5 mins ago',
    source: 'Hydrological Warning Center',
    location: 'East Riverbank & Market District',
    summary: 'Water level rising at 30cm every 15 minutes. Ground floor buildings in Market District are taking on water.',
    actionRequired: 'Climb to second floor or move toward East High Ridge Community Shelter.',
    type: 'Evacuation',
    status: 'Active'
  },
  {
    id: 'ALT-106',
    scenarioId: 'wildfire-blaze',
    priority: 'CRITICAL',
    title: 'IMMEDIATE EVACUATION: West Foothills Community',
    timestamp: '2 mins ago',
    source: 'Forest Fire Unified Command',
    location: 'Zone A & B (Pine Crest to Oak Valley)',
    summary: 'Fireline shifted due to sudden 60 km/h wind shift. Smoke density is critical.',
    actionRequired: 'Evacuate South along Interstate Highway 4. Turn on vehicle headlights and hazard flashers.',
    type: 'Evacuation',
    status: 'Active'
  }
];

/**
 * Fetch all alerts, optionally filtered by scenario
 * @param {string} [scenarioId] - Optional scenario key to filter by
 * @returns {Promise<Array>} List of emergency broadcast alerts
 */
export async function getAlerts(scenarioId = null) {
  // TODO: replace with real API call, e.g.:
  // const url = scenarioId ? `/api/alerts?scenarioId=${encodeURIComponent(scenarioId)}` : '/api/alerts';
  // const res = await fetch(url);
  // if (!res.ok) throw new Error('Failed to fetch alerts from backend');
  // return res.json();

  return new Promise((resolve) => {
    // Mimic slight network latency if needed, or return immediate mock data
    setTimeout(() => {
      if (scenarioId) {
        resolve(
          mockAlerts.filter(
            (a) => a.scenarioId === scenarioId || a.scenarioId === 'cyclone-surge'
          )
        );
      } else {
        resolve([...mockAlerts]);
      }
    }, 10);
  });
}

/**
 * Fetch a single alert by its unique ID
 * @param {string} alertId
 * @returns {Promise<Object|null>} Alert object or null if not found
 */
export async function getAlertById(alertId) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/alerts/${alertId}`);
  // return res.json();

  return new Promise((resolve) => {
    const alert = mockAlerts.find((a) => a.id === alertId) || null;
    resolve(alert);
  });
}

/**
 * Acknowledge an alert to dismiss notification or log user compliance
 * @param {string} alertId
 * @returns {Promise<{success: boolean, alertId: string}>}
 */
export async function acknowledgeAlertApi(alertId) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/alerts/${alertId}/ack`, { method: 'POST' });
  // return res.json();

  return new Promise((resolve) => {
    resolve({ success: true, alertId, timestamp: new Date().toISOString() });
  });
}
