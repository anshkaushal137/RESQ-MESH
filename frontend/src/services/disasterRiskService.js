// Disaster Risk Service
// Manages multi-hazard scenario telemetry, severity indices, risk breakdowns, and Doppler weather feeds.

export const mockDisasterScenarios = {
  'cyclone-surge': {
    id: 'cyclone-surge',
    title: 'Super Cyclone "Amphan-X" & Storm Surge',
    type: 'Cyclone / Coastal Flood',
    severity: 'CRITICAL',
    riskScore: 92,
    threatLevel: 'Severe Category 4',
    status: 'ACTIVE RED WARNING',
    affectedRadius: '45 km',
    impactZone: 'Coastal Sector 4 & Lower Delta Basin',
    evacuationUrgency: 'Immediate Mandatory Evacuation',
    populationAtRisk: '142,500 people',
    activeResponseUnits: 28,
    summary: 'Sustained destructive winds exceeding 165 km/h with an estimated 4.2m storm surge. Coastal dykes at Sector 4 showing active breach risk.',
    keyHazard: 'Storm Surge & Extreme Wind Shear',
    weather: {
      condition: 'Violent Rainstorm & Gale',
      temperature: '24°C',
      feelsLike: '21°C',
      rainfallRate: '48 mm/hr',
      rainfallAccumulation: '184 mm (Last 12h)',
      windSpeed: '142 km/h',
      windGusts: '175 km/h',
      windDirection: 'ENE (065°)',
      humidity: '98%',
      pressure: '942 hPa (Falling rapidly)',
      visibility: '0.8 km',
      uvIndex: '0 (Overcast)',
      radarStatus: 'Live Doppler Radar Tracking active storm eye at 22.4 km Offshore'
    },
    threatBreakdown: [
      { name: 'Storm Surge Inundation', score: 95, color: '#ef4444', desc: 'Water rise 3.5m - 4.5m along shoreline' },
      { name: 'Structural Wind Damage', score: 90, color: '#ef4444', desc: 'Roofs, hoardings & power poles at high failure risk' },
      { name: 'Flash Urban Flooding', score: 82, color: '#f59e0b', desc: 'Low-lying underpasses submerged (>1.2m water)' },
      { name: 'Grid & Telemetry Loss', score: 78, color: '#f59e0b', desc: 'Cell towers running on emergency backup mesh' }
    ]
  },
  'flash-flood': {
    id: 'flash-flood',
    title: 'Monsoon Flash Inundation & Debris Flow',
    type: 'Flash Flood / Mudslide',
    severity: 'HIGH',
    riskScore: 84,
    threatLevel: 'Tier 3 Red Inundation',
    status: 'RISING WATER LEVELS',
    affectedRadius: '30 km',
    impactZone: 'River Valley District & East Ridge',
    evacuationUrgency: 'Urgent Precautionary Evacuation',
    populationAtRisk: '86,200 people',
    activeResponseUnits: 19,
    summary: 'Continuous cloudburst dumped 210mm rainfall in 6 hours. Upper River reservoir discharging at maximum spillway capacity.',
    keyHazard: 'Submerged Roadways & Bridge Overwash',
    weather: {
      condition: 'Heavy Continuous Downpour',
      temperature: '22°C',
      feelsLike: '20°C',
      rainfallRate: '36 mm/hr',
      rainfallAccumulation: '220 mm (Last 6h)',
      windSpeed: '45 km/h',
      windGusts: '65 km/h',
      windDirection: 'SW (220°)',
      humidity: '99%',
      pressure: '998 hPa (Steady)',
      visibility: '2.1 km',
      uvIndex: '0 (Rain)',
      radarStatus: 'Hydrological sensor net: River depth +3.8m above danger mark'
    },
    threatBreakdown: [
      { name: 'Bridge & Causeway Flooding', score: 92, color: '#ef4444', desc: 'North causeway fully impassable' },
      { name: 'Hillside Slope Failure', score: 85, color: '#ef4444', desc: 'Debris flow risk on East Valley highway' },
      { name: 'Potable Water Contamination', score: 74, color: '#f59e0b', desc: 'Treatment plant switched to auxiliary chlorination' },
      { name: 'Power Line Submersion', score: 68, color: '#10b981', desc: 'Substations in Lowlands proactively de-energized' }
    ]
  },
  'wildfire-blaze': {
    id: 'wildfire-blaze',
    title: 'Ridge Fire Complex & High Smoke Front',
    type: 'Wildfire / Toxic Smoke',
    severity: 'CRITICAL',
    riskScore: 89,
    threatLevel: 'Extreme Fire Danger Index',
    status: 'RAPID ADVANCE (WEST FLANK)',
    affectedRadius: '38 km',
    impactZone: 'North Ridge Forest & Foothill Subdivisions',
    evacuationUrgency: 'Immediate Evacuation Order (Zones A & B)',
    populationAtRisk: '54,000 people',
    activeResponseUnits: 34,
    summary: 'Fast-moving blaze driven by erratic 55 km/h ridge winds. Dense smoke plume reducing visibility and deteriorating AQI to hazardous levels.',
    keyHazard: 'Ember Cast & Air Quality Crisis',
    weather: {
      condition: 'Extreme Dry Heat & Dense Smog',
      temperature: '39°C',
      feelsLike: '42°C',
      rainfallRate: '0 mm/hr',
      rainfallAccumulation: '0 mm (Drought condition)',
      windSpeed: '58 km/h',
      windGusts: '80 km/h',
      windDirection: 'NNW (330°)',
      humidity: '11%',
      pressure: '1012 hPa',
      visibility: '1.2 km (Smoke particulate)',
      uvIndex: '9 (Extreme)',
      radarStatus: 'Satellite thermal infrared detects 3 new spot-fire ignitions'
    },
    threatBreakdown: [
      { name: 'Wildland Perimeter Spread', score: 94, color: '#ef4444', desc: 'Advancing at 1.8 km/h towards West Foothills' },
      { name: 'Hazardous Air Quality (AQI 420)', score: 91, color: '#ef4444', desc: 'Severe respiratory risk; N95/P100 required outdoors' },
      { name: 'Embers Leaping Firebreaks', score: 86, color: '#f59e0b', desc: 'Spotted 600m ahead of main fireline' },
      { name: 'Evacuation Route Chokepoints', score: 70, color: '#f59e0b', desc: 'Route 102 closed; Route 4 South clear' }
    ]
  }
};

/**
 * Fetch all registered disaster scenarios
 * @returns {Promise<Record<string, Object>>}
 */
export async function getDisasterScenarios() {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch('/api/disasters/scenarios');
  // if (!res.ok) throw new Error('Failed to fetch disaster scenarios');
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockDisasterScenarios });
    }, 10);
  });
}

/**
 * Fetch current disaster risk assessment and breakdown for a scenario
 * @param {string} [scenarioKey='cyclone-surge']
 * @returns {Promise<Object>}
 */
export async function getDisasterRisk(scenarioKey = 'cyclone-surge') {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/disasters/${scenarioKey}/risk`);
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      const scenario = mockDisasterScenarios[scenarioKey] || mockDisasterScenarios['cyclone-surge'];
      resolve({ ...scenario });
    }, 10);
  });
}

/**
 * Fetch Doppler radar and weather telemetry for a scenario
 * @param {string} [scenarioKey='cyclone-surge']
 * @returns {Promise<Object>}
 */
export async function getWeatherTelemetry(scenarioKey = 'cyclone-surge') {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/disasters/${scenarioKey}/weather`);
  // return res.json();

  return new Promise((resolve) => {
    const scenario = mockDisasterScenarios[scenarioKey] || mockDisasterScenarios['cyclone-surge'];
    resolve({ ...scenario.weather });
  });
}
