// SOS Service
// Handles emergency distress beacon broadcasts, dispatch telemetry, and hotline agencies.

export const mockEmergencyContacts = [
  { agency: 'National Disaster Response Force (NDRF)', number: '1078 / 112', type: 'Primary Rescue Command' },
  { agency: 'Coast Guard & Maritime Water Rescue', number: '1554', type: 'Flood & Inundation Extraction' },
  { agency: 'State Emergency Operations Center', number: '1070', type: 'Helicopter & Triage Dispatch' },
  { agency: 'Disaster Ambulance & Trauma Line', number: '108', type: 'Medical Emergency Services' }
];

export const mockSosCategories = [
  { id: 'flood', label: 'Rising Flood Water / Trapped', icon: '🌊', color: '#06b6d4' },
  { id: 'medical', label: 'Severe Medical Injury / Trauma', icon: '🩺', color: '#ef4444' },
  { id: 'fire', label: 'Fire / Smoke Inhalation', icon: '🔥', color: '#f59e0b' },
  { id: 'collapse', label: 'Structural Collapse / Stranded', icon: '🏚️', color: '#8b5cf6' }
];

/**
 * Fetch emergency response agency hotlines
 * @returns {Promise<Array>}
 */
export async function getEmergencyContacts() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/sos/contacts');
  // if (!res.ok) throw new Error('Failed to fetch emergency contacts');
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEmergencyContacts]);
    }, 10);
  });
}

/**
 * Fetch standard emergency distress categories
 * @returns {Promise<Array>}
 */
export async function getSosCategories() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/sos/categories');
  // return res.json();

  return new Promise((resolve) => {
    resolve([...mockSosCategories]);
  });
}

/**
 * Dispatch an emergency SOS beacon to backend / mesh relays
 * @param {Object} details - Distress details (category, personsCount, medicalUrgent, notes)
 * @returns {Promise<Object>} Dispatched beacon payload
 */
export async function triggerSosBeacon(details) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/sos/dispatch', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(details)
  // });
  // return res.json();

  return new Promise((resolve) => {
    const packet = {
      ...details,
      timestamp: new Date().toLocaleTimeString(),
      id: `SOS-${Math.floor(100000 + Math.random() * 900000)}`,
      coords: {
        lat: 18.5204 + (Math.random() - 0.5) * 0.02,
        lng: 73.8567 + (Math.random() - 0.5) * 0.02
      },
      meshHops: 3,
      status: 'TRANSMITTING TO DISPATCH'
    };
    resolve(packet);
  });
}

/**
 * Cancel an active emergency SOS distress beacon
 * @param {string} sosId
 * @returns {Promise<{success: boolean, id: string}>}
 */
export async function cancelSosBeacon(sosId) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/sos/${sosId}/cancel`, { method: 'POST' });
  // return res.json();

  return new Promise((resolve) => {
    resolve({ success: true, id: sosId, cancelledAt: new Date().toISOString() });
  });
}

/**
 * Mark user status as safe across emergency network and contacts
 * @param {Object} [data] - Optional metadata (notes, contact, etc.)
 * @returns {Promise<Object>}
 */
export async function markSelfSafe(data = {}) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/sos/safe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const referenceId = `${Math.floor(1000 + Math.random() * 9000)}`;
      resolve({
        success: true,
        referenceId,
        status: 'MARKED_SAFE',
        message: 'Marked as Safe. Your status has been shared with your emergency contacts and the ResQ Mesh network.',
        timestamp: now.toISOString(),
        formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        formattedDate: now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        meshNodesAcknowledged: 48,
        ...data
      });
    }, 250);
  });
}

/**
 * Submit an emergency help request (Citizen Triage flow)
 * @param {Object} data - Request details { location, peopleCount, emergencyType, notes, coords }
 * @returns {Promise<Object>}
 */
export async function submitHelpRequest(data) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/sos/request-help', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const referenceId = `${Math.floor(1000 + Math.random() * 9000)}`;
      resolve({
        success: true,
        referenceId,
        status: 'HELP_ROUTED',
        headline: `Request received. Reference ID: #${referenceId}. Help is being routed to your location.`,
        timestamp: now.toISOString(),
        formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        formattedDate: now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        dispatchSector: 'North-East Riverine Triage Station',
        estimatedEta: '12-18 mins',
        summary: {
          emergencyType: data.emergencyType || 'General Emergency',
          location: data.location || (data.coords ? `${data.coords.lat.toFixed(4)}° N, ${data.coords.lng.toFixed(4)}° E` : 'Current GPS Lock'),
          coords: data.coords || null,
          peopleCount: data.peopleCount || 1,
          notes: data.notes || 'None provided'
        }
      });
    }, 350);
  });
}

/**
 * Submit a missing person report
 * @param {Object} data - Missing person report details { name, lastKnownLocation, description, reporterName, reporterPhone }
 * @returns {Promise<Object>}
 */
export async function submitMissingPersonReport(data) {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/sos/missing-person', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const referenceId = `${Math.floor(1000 + Math.random() * 9000)}`;
      resolve({
        success: true,
        referenceId,
        status: 'REPORT_BROADCASTED',
        headline: `Request received. Reference ID: #${referenceId}. Help is being routed to your location.`,
        timestamp: now.toISOString(),
        formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        formattedDate: now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        dispatchedAgencies: ['NDRF Search & Rescue', 'State Police Disaster Cell', 'Local Mesh Volunteers'],
        summary: {
          missingPersonName: data.name || 'Unnamed Person',
          lastKnownLocation: data.lastKnownLocation || 'Unknown Area',
          description: data.description || 'None provided',
          reporterName: data.reporterName || 'Anonymous',
          reporterPhone: data.reporterPhone || 'Not provided'
        }
      });
    }, 350);
  });
}

/**
 * Incoming AI Triage Help Requests Mock Queue
 */
export const mockTriageQueue = [
  {
    id: 'TRG-8041',
    urgency: 'CRITICAL',
    type: 'Trapped / Water Rising (>1.2m)',
    location: 'Sector 4, Bldg B (Ground Floor)',
    peopleCount: 4,
    timestamp: '2 mins ago',
    eta: '6 mins',
    assignedUnit: 'Rescue Boat Unit 02',
    status: 'Unit En Route'
  },
  {
    id: 'TRG-8042',
    urgency: 'CRITICAL',
    type: 'Severe Medical / Head Trauma',
    location: '88 Riverview Lane, Apt 4',
    peopleCount: 1,
    timestamp: '5 mins ago',
    eta: '8 mins',
    assignedUnit: 'Ambulance Unit 07',
    status: 'Paramedic Dispatch'
  },
  {
    id: 'TRG-8043',
    urgency: 'HIGH',
    type: 'Elderly / Mobility Impaired Stranded',
    location: '312 Elm Street, Flat 3A',
    peopleCount: 2,
    timestamp: '11 mins ago',
    eta: '14 mins',
    assignedUnit: 'Volunteer Squad 4',
    status: 'Ground Team Moving'
  },
  {
    id: 'TRG-8044',
    urgency: 'HIGH',
    type: 'Roof Stranded / Power Grid Failure',
    location: 'Lowland Maritime Way #14',
    peopleCount: 3,
    timestamp: '19 mins ago',
    eta: '18 mins',
    assignedUnit: 'Helicopter Unit 01',
    status: 'Aero Triage Queued'
  },
  {
    id: 'TRG-8045',
    urgency: 'MEDIUM',
    type: 'Insulin & Clean Water Supply Needed',
    location: '104 North Ridge Terrace',
    peopleCount: 2,
    timestamp: '28 mins ago',
    eta: '25 mins',
    assignedUnit: 'Mobile Supply Van 03',
    status: 'Supply Scheduled'
  }
];

/**
 * Fetch incoming AI triage queue sorted by urgency
 * @returns {Promise<Array>}
 */
export async function getTriageQueue() {
  return new Promise((resolve) => {
    const urgencyOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    const sorted = [...mockTriageQueue].sort(
      (a, b) => (urgencyOrder[a.urgency] || 99) - (urgencyOrder[b.urgency] || 99)
    );
    resolve(sorted);
  });
}


