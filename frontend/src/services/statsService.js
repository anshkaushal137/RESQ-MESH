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
    sectors: 'Sector 4, West Ridge'
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
    sectors: 'Delta Basin, Lowland Way'
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
    sectors: 'North Civic, St. Jude'
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
    sectors: 'Shelters 01-03'
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

