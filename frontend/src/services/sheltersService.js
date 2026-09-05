// Shelters Service
// Manages safe emergency shelter registry, live capacity, bed availability, and telemetry.

export const mockShelters = [
  {
    id: 'SHL-01',
    name: 'North Central Civic Center (Primary Safe Hub)',
    type: 'Mega Shelter & Triage Base',
    distance: '1.2 km',
    elevation: '42m (High Ground Safe Zone)',
    capacityTotal: 1200,
    capacityOccupied: 780,
    status: 'OPEN & ACCEPTING',
    statusColor: '#10b981',
    address: '740 Grand Avenue, North Ridge Safe Zone',
    contact: '+1 (800) 555-RESQ (Ext 1)',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    amenities: [
      'Level-2 Medical Triage',
      'Backup Diesel Generators (72hr)',
      'Clean Water & Hot Meals',
      'Pet Shelter Area',
      'Wheelchair Accessible',
      'Child Safe Zone',
      'Mesh Radio Beacon'
    ],
    suppliesStatus: 'Plentiful (3-Day Buffer)',
    doctorOnSite: true,
    bedsAvailable: 420
  },
  {
    id: 'SHL-02',
    name: 'St. Jude Memorial Arena Shelter',
    type: 'Regional Evacuation Point',
    distance: '2.8 km',
    elevation: '38m (Safe Elevation)',
    capacityTotal: 850,
    capacityOccupied: 740,
    status: 'NEAR CAPACITY (87%)',
    statusColor: '#f59e0b',
    address: '120 Stadium Way, West Hills District',
    contact: '+1 (800) 555-RESQ (Ext 2)',
    coordinates: { lat: 18.5312, lng: 73.8421 },
    amenities: [
      'First Aid Station',
      'Food & Baby Formula',
      'Emergency Blankets & Cots',
      'Mobile Phone Charging Kiosk',
      'Sanitation Showers'
    ],
    suppliesStatus: 'Moderate',
    doctorOnSite: true,
    bedsAvailable: 110
  },
  {
    id: 'SHL-03',
    name: 'Summit Heights High School Shelter',
    type: 'Community Relief Center',
    distance: '4.1 km',
    elevation: '55m (Peak Safe Elevation)',
    capacityTotal: 600,
    capacityOccupied: 210,
    status: 'OPEN & ACCEPTING',
    statusColor: '#10b981',
    address: '950 Summit Ridge Road',
    contact: '+1 (800) 555-RESQ (Ext 3)',
    coordinates: { lat: 18.5489, lng: 73.8694 },
    amenities: [
      'Basic Medical Aid',
      'Solar Microgrid',
      'Packaged Food Rations',
      'Clean Potable Water Tanks',
      'Family Dormitories'
    ],
    suppliesStatus: 'Plentiful',
    doctorOnSite: false,
    bedsAvailable: 390
  },
  {
    id: 'SHL-04',
    name: 'Lowland Maritime Terminal (Former Shelter)',
    type: 'Waterfront Transit Point',
    distance: '3.4 km',
    elevation: '2.5m (HIGH RISK)',
    capacityTotal: 400,
    capacityOccupied: 0,
    status: 'CLOSED & EVACUATED (FLOOD RISK)',
    statusColor: '#ef4444',
    address: '1 Harbor View Blvd',
    contact: 'DECOMMISSIONED',
    coordinates: { lat: 18.4981, lng: 73.8123 },
    amenities: ['NO SERVICES - INUNDATED'],
    suppliesStatus: 'None (Evacuated)',
    doctorOnSite: false,
    bedsAvailable: 0
  }
];

/**
 * Fetch all shelters in the disaster zone
 * @returns {Promise<Array>} List of shelters
 */
export async function getShelters() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/shelters');
  // if (!res.ok) throw new Error('Failed to fetch shelters');
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockShelters]);
    }, 10);
  });
}

/**
 * Fetch a specific shelter by ID
 * @param {string} shelterId
 * @returns {Promise<Object|null>}
 */
export async function getShelterById(shelterId) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/shelters/${shelterId}`);
  // return res.json();

  return new Promise((resolve) => {
    const shelter = mockShelters.find((s) => s.id === shelterId) || null;
    resolve(shelter);
  });
}

/**
 * Calculate systemwide shelter metrics (occupancy, bed counts, active facilities)
 * @returns {Promise<Object>} Aggregated metrics object
 */
export async function getShelterSystemStats() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/shelters/stats');
  // return res.json();

  return new Promise((resolve) => {
    const totalCapacity = mockShelters.reduce((acc, s) => acc + s.capacityTotal, 0);
    const totalOccupied = mockShelters.reduce((acc, s) => acc + s.capacityOccupied, 0);
    const overallOccupancy = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
    const totalOpenBeds = mockShelters.reduce((acc, s) => acc + s.bedsAvailable, 0);
    const activeCount = mockShelters.filter((s) => !s.status.includes('CLOSED')).length;

    resolve({
      totalCapacity,
      totalOccupied,
      overallOccupancy,
      totalOpenBeds,
      activeCount,
      sheltersCount: mockShelters.length
    });
  });
}
