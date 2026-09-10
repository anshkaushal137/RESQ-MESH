// Stats Service
// Aggregates operational telemetry for high-level command dashboard counters and gauges.

import { getDisasterRisk } from './disasterRiskService.js';
import { getAlerts } from './alertsService.js';
import { getShelters, getShelterSystemStats } from './sheltersService.js';

/**
 * Fetch live aggregated operations stats for the dashboard stat counters
 * @param {string} [scenarioKey='cyclone-surge']
 * @returns {Promise<Object>} Aggregated metrics for StatCard widgets
 */
export async function getDashboardStats(scenarioKey = 'cyclone-surge') {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/dashboard/stats?scenarioKey=${scenarioKey}`);
  // if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  // return res.json();

  const [scenario, alerts, shelterStats] = await Promise.all([
    getDisasterRisk(scenarioKey),
    getAlerts(scenarioKey),
    getShelterSystemStats()
  ]);

  const criticalAlertsCount = alerts.filter((a) => a.priority === 'CRITICAL').length;

  return {
    incidentThreat: {
      title: 'Incident Threat Index',
      value: `${scenario.riskScore}/100`,
      subtext: scenario.threatLevel,
      trend: 'LIVE DIAL',
      color: 'danger',
      gaugeValue: scenario.riskScore
    },
    activeAlerts: {
      title: 'Active Alerts',
      value: `${alerts.length} Active`,
      subtext: `${criticalAlertsCount} Evacuations Ordered`,
      trend: '+2 Broadcast',
      color: 'warning'
    },
    operationalShelters: {
      title: 'Operational Shelters',
      value: `${shelterStats.activeCount} Open`,
      subtext: `${shelterStats.totalOpenBeds} Total Beds Verified`,
      trend: `${shelterStats.overallOccupancy}% Occupied`,
      color: 'success',
      gaugeValue: shelterStats.overallOccupancy
    },
    responseUnits: {
      title: 'Response Units Online',
      value: scenario.activeResponseUnits,
      subtext: 'Boat, Heli & Ambulances',
      trend: '48 Mesh Nodes',
      color: 'cyan'
    }
  };
}

/**
 * Live Resource Allocation & Fleet Telemetry Data
 */
export const mockResourceAllocation = [
  {
    id: 'res-ambulances',
    type: 'Ambulances',
    icon: 'AmbulanceIcon',
    deployed: 14,
    total: 18,
    available: 4,
    unit: 'Vehicles',
    color: 'danger',
    status: 'High Demand',
    sectors: 'Sector 4, West Ridge',
    description: 'Rapid-response emergency medical transit vehicles equipped with oxygen, defibrillators, and multi-patient stretchers.',
    units: [
      {
        id: 'AMB-01',
        name: 'Ambulance Unit 01',
        status: 'DEPLOYED',
        statusType: 'deployed',
        location: 'Sector 4: West Ridge Transit Hub',
        mission: 'Multi-patient trauma evacuation',
        eta: 'On Scene',
        crew: '2 Paramedics, 1 EMT',
        channel: 'Ch 4 (Mesh-Alpha)'
      },
      {
        id: 'AMB-04',
        name: 'Ambulance Unit 04',
        status: 'EN ROUTE',
        statusType: 'enroute',
        location: 'Lowland Way & 5th Ave',
        mission: 'Elderly evacuation transport',
        eta: '4 mins',
        crew: '2 Paramedics',
        channel: 'Ch 4 (Mesh-Alpha)'
      },
      {
        id: 'AMB-07',
        name: 'Ambulance Unit 07',
        status: 'EN ROUTE',
        statusType: 'enroute',
        location: 'Zone 2: Estuary Blvd (Sector 4B)',
        mission: 'Head trauma & severe injury triage',
        eta: '8 mins',
        crew: '1 Critical Care Doc, 2 EMTs',
        channel: 'Ch 2 (Mesh-Priority)'
      },
      {
        id: 'AMB-11',
        name: 'Ambulance Unit 11',
        status: 'STANDBY READY',
        statusType: 'available',
        location: 'Central Medical Staging Base',
        mission: 'Rapid dispatch queue reserve',
        eta: 'Immediate (2 mins)',
        crew: '2 EMTs',
        channel: 'Ch 1 (Base-Mesh)'
      },
      {
        id: 'AMB-15',
        name: 'Ambulance Unit 15',
        status: 'STANDBY READY',
        statusType: 'available',
        location: 'North Civic Evacuation Depot',
        mission: 'Corridor Alpha standby reserve',
        eta: 'Immediate (3 mins)',
        crew: '2 Paramedics',
        channel: 'Ch 1 (Base-Mesh)'
      }
    ]
  },
  {
    id: 'res-boats',
    type: 'Rescue Boats',
    icon: 'BoatIcon',
    deployed: 8,
    total: 10,
    available: 2,
    unit: 'Vessels',
    color: 'cyan',
    status: 'Inundation Active',
    sectors: 'Delta Basin, Lowland Way',
    description: 'Motorized flood extraction craft with shallow draft capabilities, lifejackets, and high-capacity rescue rafts.',
    units: [
      {
        id: 'BOAT-01',
        name: 'Rescue Boat Unit 01',
        status: 'DEPLOYED',
        statusType: 'deployed',
        location: 'Delta Basin Inundation Zone',
        mission: 'Rooftop extraction & river patrol',
        eta: 'On Scene',
        crew: '3 Rescue Swimmers, 1 Pilot',
        channel: 'Ch 6 (Marine-Mesh)'
      },
      {
        id: 'BOAT-02',
        name: 'Rescue Boat Unit 02',
        status: 'REDIRECTED / EN ROUTE',
        statusType: 'enroute',
        location: 'Zone 2: Lower Estuary Blvd',
        mission: 'Surge response: 7 Trapped individuals',
        eta: '9 mins',
        crew: '2 Rescue Swimmers, 1 Medic',
        channel: 'Ch 2 (Mesh-Priority)'
      },
      {
        id: 'BOAT-05',
        name: 'Rescue Boat Unit 05',
        status: 'DEPLOYED',
        statusType: 'deployed',
        location: 'Corridor Alpha Water Crossing',
        mission: 'Safe corridor perimeter patrol',
        eta: 'On Scene',
        crew: '2 Rescue Swimmers, 1 Pilot',
        channel: 'Ch 6 (Marine-Mesh)'
      },
      {
        id: 'BOAT-08',
        name: 'Rescue Boat Unit 08',
        status: 'STANDBY READY',
        statusType: 'available',
        location: 'Harbor Marina Staging Base',
        mission: 'High-water reserve squad',
        eta: 'Immediate (4 mins)',
        crew: '3 Rescue Swimmers',
        channel: 'Ch 6 (Marine-Mesh)'
      },
      {
        id: 'BOAT-10',
        name: 'Rescue Boat Unit 10',
        status: 'STANDBY READY',
        statusType: 'available',
        location: 'South Pier Launch Ramp',
        mission: 'Secondary surge contingency',
        eta: 'Immediate (5 mins)',
        crew: '2 Rescue Swimmers',
        channel: 'Ch 6 (Marine-Mesh)'
      }
    ]
  },
  {
    id: 'res-volunteers',
    type: 'Field Volunteers',
    icon: 'UsersIcon',
    deployed: 145,
    total: 200,
    available: 55,
    unit: 'Responders',
    color: 'success',
    status: 'Staging & Triage',
    sectors: 'North Civic, St. Jude',
    description: 'Mobilized community emergency response volunteers trained in shelter operations, first aid, and evacuation guiding.',
    units: [
      {
        id: 'VOL-SQ-A',
        name: 'Volunteer Squad Alpha (35 pax)',
        status: 'DEPLOYED',
        statusType: 'deployed',
        location: 'Safe Ridge High School Shelter',
        mission: 'Beds & hot meal logistics triage',
        eta: 'Active On Site',
        crew: '35 CERT Volunteers',
        channel: 'Ch 3 (Shelter-Net)'
      },
      {
        id: 'VOL-SQ-B',
        name: 'Volunteer Squad Bravo (40 pax)',
        status: 'DEPLOYED',
        statusType: 'deployed',
        location: 'St. Jude Sanctuary & Clinic',
        mission: 'Medical assistance & registration',
        eta: 'Active On Site',
        crew: '40 CERT Volunteers',
        channel: 'Ch 3 (Shelter-Net)'
      },
      {
        id: 'VOL-SQ-C',
        name: 'Volunteer Squad Charlie (45 pax)',
        status: 'DEPLOYED',
        statusType: 'deployed',
        location: 'North Civic Center',
        mission: 'Evacuation corridor perimeter routing',
        eta: 'Active On Site',
        crew: '45 CERT Volunteers',
        channel: 'Ch 5 (Corridor-Net)'
      },
      {
        id: 'VOL-SQ-D',
        name: 'Volunteer Squad Delta (25 pax)',
        status: 'DEPLOYED',
        statusType: 'deployed',
        location: 'Sector 4 Transit Staging Hub',
        mission: 'Crowd management & bus loading',
        eta: 'Active On Site',
        crew: '25 CERT Volunteers',
        channel: 'Ch 5 (Corridor-Net)'
      },
      {
        id: 'VOL-RES-01',
        name: 'Volunteer Reserve Pool (55 pax)',
        status: 'STANDBY READY',
        statusType: 'available',
        location: 'Central Command Assembly Point',
        mission: 'Rapid mobilization surge reserve',
        eta: 'Immediate (10 mins)',
        crew: '55 CERT Responders',
        channel: 'Ch 1 (Base-Mesh)'
      }
    ]
  },
  {
    id: 'res-supplies',
    type: 'Medical & Ration Kits',
    icon: 'PackageIcon',
    deployed: 380,
    total: 500,
    available: 120,
    unit: 'Kits',
    color: 'warning',
    status: 'Rationed Buffer',
    sectors: 'Shelters 01-03',
    description: 'Standardized emergency trauma kits, drinking water packs, and 72-hour survival rations deployed to active evacuation shelters.',
    units: [
      {
        id: 'KIT-PKG-01',
        name: 'Trauma & Wound Care Batch (130 kits)',
        status: 'DISTRIBUTED',
        statusType: 'deployed',
        location: 'Safe Ridge High School (Shelter 01)',
        mission: 'Immediate triage trauma replenishment',
        eta: 'Delivered',
        crew: 'Logistics Courier 01',
        channel: 'Ch 8 (Supply-Net)'
      },
      {
        id: 'KIT-PKG-02',
        name: 'Water & 72-Hr Ration Packs (150 kits)',
        status: 'DISTRIBUTED',
        statusType: 'deployed',
        location: 'North Civic Center (Shelter 02)',
        mission: 'High-density population sustenance',
        eta: 'Delivered',
        crew: 'Logistics Courier 02',
        channel: 'Ch 8 (Supply-Net)'
      },
      {
        id: 'KIT-PKG-03',
        name: 'Pediatric & Hygiene Kits (100 kits)',
        status: 'DISTRIBUTED',
        statusType: 'deployed',
        location: 'St. Jude Sanctuary (Shelter 03)',
        mission: 'Vulnerable family supply dispatch',
        eta: 'Delivered',
        crew: 'Logistics Courier 03',
        channel: 'Ch 8 (Supply-Net)'
      },
      {
        id: 'KIT-RES-01',
        name: 'Reserve Emergency Trauma Kits (60 kits)',
        status: 'AVAILABLE AT DEPOT',
        statusType: 'available',
        location: 'Warehouse Logistics Hub Alpha',
        mission: 'Ready for instant vehicle loading',
        eta: 'Immediate (15 mins dispatch)',
        crew: 'Logistics Depot Alpha',
        channel: 'Ch 8 (Supply-Net)'
      },
      {
        id: 'KIT-RES-02',
        name: 'High-Calorie Emergency Rations (60 kits)',
        status: 'AVAILABLE AT DEPOT',
        statusType: 'available',
        location: 'Central Storage Vault Beta',
        mission: 'Surge buffer reserve',
        eta: 'Immediate (15 mins dispatch)',
        crew: 'Logistics Depot Beta',
        channel: 'Ch 8 (Supply-Net)'
      }
    ]
  }
];

/**
 * Fetch live resource allocation and asset deployment counts
 * @returns {Promise<Array>}
 */
export async function getResourceAllocation() {
  return new Promise((resolve) => {
    resolve([...mockResourceAllocation]);
  });
}

