import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  AlertTriangleIcon,
  ShieldIcon,
  RouteIcon,
  ShelterIcon,
  ActivityIcon,
  RadioIcon,
  MapIcon,
  MapPinIcon,
  NavigationIcon,
  BellIcon,
  CheckIcon,
  ChevronRightIcon,
  WindIcon,
  BotIcon,
  SparklesIcon,
  SendIcon
} from '../components/Icons';
import { CircularGauge, SemiCircularGauge, AlertLevelDial } from '../components/Gauges';
import { MAP_NODES, DEFAULT_AI_PROMPTS } from '../data/mockData';

export const RiskMapPage = () => {
  const {
    scenario,
    currentAlerts,
    acknowledgedAlerts,
    acknowledgeAlert,
    shelters,
    safeRoutes,
    aiMessages,
    isAiTyping,
    sendAiMessage,
    setActiveTab
  } = useDisaster();

  // Left Column: Risk Map State
  const [selectedPin, setSelectedPin] = useState(MAP_NODES[0]);
  const [showFloodLayer, setShowFloodLayer] = useState(true);
  const [showShelterLayer, setShowShelterLayer] = useState(true);
  const [showHazardLayer, setShowHazardLayer] = useState(true);
  const [showUnitLayer, setShowUnitLayer] = useState(true);

  // Right Column: AI Copilot State
  const [chatInput, setChatInput] = useState('');

  // Calculations for Shelter Summary
  const openShelters = shelters.filter((s) => !s.status.includes('CLOSED'));
  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacityTotal, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.capacityOccupied, 0);
  const totalOpenBeds = shelters.reduce((acc, s) => acc + s.bedsAvailable, 0);
  const openBedsPct = totalCapacity > 0 ? Math.round((totalOpenBeds / totalCapacity) * 100) : 30;

  // Primary safe route for preview
  const primaryRoute = safeRoutes[0] || {
    id: 'RT-ALPHA',
    name: 'Corridor Alpha: High Ground Expressway',
    safetyScore: 96,
    distance: '3.8 km',
    estimatedTime: '12 min',
    elevationProfile: '+32m High Ridge'
  };

  // Weather data from scenario
  const weather = scenario.weather;

  // Dynamic 3-day forecast based on scenario
  const forecastDays = [
    { day: 'Wed', temp: weather.temperature, icon: '⛈️', metric: weather.rainfallRate },
    { day: 'Sat', temp: '26°C', icon: '🌧️', metric: '18 mm/h' },
    { day: 'Mon', temp: '29°C', icon: '🌤️', metric: '2 mm/h' }
  ];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendAiMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#06b6d4';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getPinColor = (type) => {
    if (type === 'shelter') return '#10b981';
    if (type === 'hazard') return '#ef4444';
    if (type === 'unit') return '#06b6d4';
    return '#f59e0b';
  };

  return (
    <div className="riskmap-page-view">
      <div className="dashboard-3col-grid">
        {/* =========================================================================
            COLUMN 1 (LEFT, ~38% width): GIS Radar Map & Shelter Summary Preview
            ========================================================================= */}
        <div className="dash-col dash-col-left">
          {/* Card 1.1: Interactive Risk Map & Doppler Radar */}
          <div className="card-glass dash-card risk-map-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon cyan-icon">
                  <MapIcon className="w-3.5 h-3.5 text-cyan" />
                </div>
                <span className="card-hdr-title">RISK MAP & GIS RADAR</span>
              </div>
              <div className="map-badge-live">
                <span className="pulse-dot-cyan"></span>
                <span>DOPPLER LIVE</span>
              </div>
            </div>

            <div className="map-card-body">
              {/* Layer Filter Toggles */}
              <div className="map-layer-pills">
                <button
                  className={`layer-pill ${showFloodLayer ? 'active-flood' : ''}`}
                  onClick={() => setShowFloodLayer(!showFloodLayer)}
                >
                  🌊 Flood Surge
                </button>
                <button
                  className={`layer-pill ${showShelterLayer ? 'active-shelter' : ''}`}
                  onClick={() => setShowShelterLayer(!showShelterLayer)}
                >
                  🏠 Shelters
                </button>
                <button
                  className={`layer-pill ${showHazardLayer ? 'active-hazard' : ''}`}
                  onClick={() => setShowHazardLayer(!showHazardLayer)}
                >
                  ⚠️ Hazards
                </button>
                <button
                  className={`layer-pill ${showUnitLayer ? 'active-unit' : ''}`}
                  onClick={() => setShowUnitLayer(!showUnitLayer)}
                >
                  🚤 Fleet
                </button>
              </div>

              {/* Map Canvas */}
              <div className="interactive-map-canvas">
                <div className="radar-sweep-grid">
                  <div className="radar-beam"></div>
                </div>

                {/* Cartographic GIS Vector Map */}
                <svg className="map-svg-layers" viewBox="0 0 400 220" preserveAspectRatio="none">
                  <defs>
                    <pattern id="city-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.07)" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="urban-footprints" width="40" height="40" patternUnits="userSpaceOnUse">
                      <rect x="2" y="2" width="16" height="16" fill="rgba(30, 41, 59, 0.35)" rx="1" />
                      <rect x="22" y="2" width="16" height="16" fill="rgba(30, 41, 59, 0.25)" rx="1" />
                      <rect x="2" y="22" width="16" height="16" fill="rgba(30, 41, 59, 0.25)" rx="1" />
                      <rect x="22" y="22" width="16" height="16" fill="rgba(30, 41, 59, 0.35)" rx="1" />
                    </pattern>
                    <pattern id="gis-flood-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.2" />
                    </pattern>
                    <linearGradient id="riverGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#081829" />
                      <stop offset="60%" stopColor="#0d2847" />
                      <stop offset="100%" stopColor="#0a1e36" />
                    </linearGradient>
                  </defs>

                  {/* Base Cartographic Slate Background */}
                  <rect width="400" height="220" fill="#060c18" />
                  <rect width="400" height="220" fill="url(#urban-footprints)" />
                  <rect width="400" height="220" fill="url(#city-grid-pattern)" />

                  {/* Organic River Waterway */}
                  <path
                    d="M-10,170 C60,165 110,145 150,130 C190,115 240,105 290,75 C340,45 380,35 410,20 L410,48 C370,68 330,80 280,110 C230,140 180,150 140,165 C95,182 40,195 -10,198 Z"
                    fill="url(#riverGradDark)"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="0.75"
                  />

                  {/* River Label */}
                  <text x="215" y="132" fill="rgba(56, 189, 248, 0.45)" fontSize="5.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.8" transform="rotate(-15, 215, 132)">
                    VICTORIA RIVER (SURGE +3.8m)
                  </text>

                  {/* City Street Network */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="0" y1="45" x2="400" y2="45" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="0" y1="95" x2="400" y2="95" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="0" y1="205" x2="400" y2="205" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />

                  <line x1="35" y1="0" x2="35" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="75" y1="0" x2="75" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="120" y1="0" x2="120" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="165" y1="0" x2="165" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="210" y1="0" x2="210" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="255" y1="0" x2="255" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="300" y1="0" x2="300" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="345" y1="0" x2="345" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />
                  <line x1="380" y1="0" x2="380" y2="220" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.6" />

                  {/* Arterial Highways */}
                  <path d="M-10,35 L140,35 L260,25 L410,15" fill="none" stroke="#223954" strokeWidth="2.5" />
                  <path d="M-10,35 L140,35 L260,25 L410,15" fill="none" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" strokeDasharray="6 3" />

                  {/* Corridor Route */}
                  <path d="M50,210 L80,165 L125,125 L180,85 L265,65 L360,58" fill="none" stroke="#1e3a5f" strokeWidth="2.5" />
                  <path d="M50,210 L80,165 L125,125 L180,85 L265,65 L360,58" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />

                  {/* Victoria Bridge (Closed) */}
                  <line x1="145" y1="132" x2="160" y2="155" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                  <text x="122" y="142" fill="#ef4444" fontSize="5" fontWeight="bold" fontFamily="monospace">✕ BRIDGE CLOSED</text>

                  {/* Metro Elevated Flyover (Open) */}
                  <line x1="260" y1="80" x2="278" y2="102" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <text x="282" y="93" fill="#10b981" fontSize="4.8" fontWeight="bold" fontFamily="monospace">✓ FLYOVER OPEN</text>

                  {/* Safe High Ground Ridge Zone */}
                  <polygon
                    points="0,0 400,0 400,68 310,60 230,50 150,58 70,52 0,62"
                    fill="rgba(16, 185, 129, 0.14)"
                    stroke="#10b981"
                    strokeWidth="0.8"
                    strokeDasharray="4 2"
                  />

                  {/* Hazard Inundation Surge Zone */}
                  {showFloodLayer && (
                    <>
                      <polygon
                        points="0,165 45,155 90,168 140,145 180,135 225,130 285,155 360,185 400,195 400,220 0,220"
                        fill="rgba(239, 68, 68, 0.24)"
                        stroke="#ef4444"
                        strokeWidth="1.2"
                        strokeDasharray="4 2"
                      />
                      <polygon
                        points="0,165 45,155 90,168 140,145 180,135 225,130 285,155 360,185 400,195 400,220 0,220"
                        fill="url(#gis-flood-hatch)"
                      />
                    </>
                  )}

                  {/* Sector Labels */}
                  <g transform="translate(12, 192)">
                    <rect x="0" y="0" width="76" height="12" fill="rgba(15, 23, 42, 0.85)" stroke="#ef4444" strokeWidth="0.6" rx="2" />
                    <circle cx="6" cy="6" r="2.5" fill="#ef4444" />
                    <text x="12" y="8.5" fill="#fca5a5" fontSize="5.5" fontWeight="bold" fontFamily="monospace">COASTAL SECTOR 4</text>
                  </g>

                  <g transform="translate(10, 10)">
                    <rect x="0" y="0" width="92" height="12" fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" strokeWidth="0.6" rx="2" />
                    <circle cx="6" cy="6" r="2.5" fill="#10b981" />
                    <text x="12" y="8.5" fill="#6ee7b7" fontSize="5.5" fontWeight="bold" fontFamily="monospace">NORTH RIDGE SAFE ZONE</text>
                  </g>
                </svg>

                {/* Map Pins */}
                {MAP_NODES.map((node) => {
                  if (node.type === 'shelter' && !showShelterLayer) return null;
                  if (node.type === 'hazard' && !showHazardLayer) return null;
                  if (node.type === 'unit' && !showUnitLayer) return null;
                  const isSelected = selectedPin?.id === node.id;
                  const pinColor = getPinColor(node.type);

                  return (
                    <div
                      key={node.id}
                      className={`map-node-pin ${isSelected ? 'selected' : ''}`}
                      style={{ top: `${node.lat}%`, left: `${node.lng}%` }}
                      onClick={() => setSelectedPin(node)}
                      title={node.label}
                    >
                      <div className="pin-halo" style={{ borderColor: pinColor }}></div>
                      <div className="pin-core" style={{ backgroundColor: pinColor }}>
                        {node.type === 'shelter' && '🏠'}
                        {node.type === 'hazard' && '⚠️'}
                        {node.type === 'unit' && '🚤'}
                        {node.type === 'sensor' && '📡'}
                      </div>
                    </div>
                  );
                })}

                {/* Pin Tooltip */}
                {selectedPin && (
                  <div className="map-selected-popover">
                    <span className="popover-type">{selectedPin.type.toUpperCase()}: </span>
                    <strong className="popover-name">{selectedPin.name}</strong>
                    <span className="popover-desc"> ({selectedPin.label})</span>
                  </div>
                )}
              </div>

              {/* Doppler Radar & Weather Telemetry Panel */}
              <div className="doppler-radar-panel">
                <div className="doppler-top-row">
                  <div className="doppler-temp-box">
                    <span className="d-temp-main">{weather.temperature}</span>
                    <span className="d-temp-sub">Feels {weather.feelsLike}</span>
                  </div>
                  <div className="doppler-cond-info">
                    <span className="d-cond-title">{weather.condition}</span>
                    <span className="d-radar-status">{weather.radarStatus}</span>
                  </div>
                </div>

                {/* 3-Day Forecast Chips */}
                <div className="forecast-chips-grid">
                  {forecastDays.map((fc, idx) => (
                    <div key={idx} className="forecast-chip">
                      <span className="fc-day">{fc.day}</span>
                      <span className="fc-icon">{fc.icon}</span>
                      <span className="fc-temp">{fc.temp}</span>
                      <span className="fc-metric">{fc.metric}</span>
                    </div>
                  ))}
                </div>

                {/* Wind Speed Indicator */}
                <div className="wind-speed-bar-container">
                  <div className="wind-bar-header">
                    <div className="wind-lbl">
                      <WindIcon className="w-3 h-3 text-warning" />
                      <span>Wind: <strong>{weather.windSpeed}</strong> (Gusts {weather.windGusts})</span>
                    </div>
                    <span className="wind-dir">{weather.windDirection}</span>
                  </div>
                  <div className="wind-track">
                    <div className="wind-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>

                {/* Flood Risk Legend */}
                <div className="flood-legend-bar">
                  <div className="legend-item">
                    <span className="legend-dot red"></span>
                    <span>High Surge (&gt;3.5m)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot orange"></span>
                    <span>Moderate Buffer</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot green"></span>
                    <span>Safe Ridge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1.2: Shelter Capacity Summary Preview (Small Overview Card) */}
          <div className="card-glass dash-card shelter-preview-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon green-icon">
                  <ShelterIcon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="card-hdr-title">SHELTER CAPACITY OVERVIEW</span>
              </div>
              <button className="card-action-link" onClick={() => setActiveTab('shelters')}>
                <span>View Shelters ({shelters.length})</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div className="shelter-preview-body">
              <div className="shelter-summary-hero">
                <CircularGauge
                  value={openBedsPct}
                  size={52}
                  strokeWidth={5}
                  color="#10b981"
                  trackColor="rgba(255, 255, 255, 0.08)"
                  label={`${openBedsPct}%`}
                  sublabel="OPEN"
                />
                <div className="summary-hero-meta">
                  <div className="summary-title-row">
                    <span className="summary-title">{totalOpenBeds} Beds Available</span>
                    <span className="summary-badge">{openShelters.length} Facilities Open</span>
                  </div>
                  <span className="summary-desc">
                    {totalOccupied}/{totalCapacity} Total Occupied • High-Ground Ridge Zone Active
                  </span>
                </div>
              </div>

              <div className="shelter-action-strip">
                <span className="strip-text">For full amenities, generator status, and GPS directions:</span>
                <button className="btn-open-directory" onClick={() => setActiveTab('shelters')}>
                  <span>Open Full Shelter Directory</span>
                  <ChevronRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2 (MIDDLE, ~31% width): Disaster Threat & Critical Alerts Preview
            ========================================================================= */}
        <div className="dash-col dash-col-mid">
          {/* Card 2.1: Disaster Threat Risk Index & Hazard Vectors */}
          <div className="card-glass dash-card threat-index-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon danger-icon">
                  <AlertTriangleIcon className="w-3.5 h-3.5 text-danger" />
                </div>
                <span className="card-hdr-title">DISASTER THREAT RISK INDEX</span>
              </div>
              <div className="badge badge-critical">
                <span className="blinking">●</span> {scenario.severity}
              </div>
            </div>

            <div className="threat-card-body">
              {/* Semi-Circular Speedometer Gauge */}
              <div className="threat-gauge-box">
                <SemiCircularGauge
                  value={scenario.riskScore}
                  max={100}
                  severity={scenario.threatLevel}
                  width={130}
                  height={68}
                  color={getScoreColor(scenario.riskScore)}
                />
              </div>

              {/* 2x2 Stats Grid */}
              <div className="threat-stats-grid">
                <div className="t-stat-tile">
                  <span className="t-stat-key">Status</span>
                  <span className="t-stat-val text-danger">{scenario.status}</span>
                </div>
                <div className="t-stat-tile">
                  <span className="t-stat-key">Radius</span>
                  <span className="t-stat-val">{scenario.affectedRadius}</span>
                </div>
                <div className="t-stat-tile">
                  <span className="t-stat-key">Impact Zone</span>
                  <span className="t-stat-val">{scenario.impactZone}</span>
                </div>
                <div className="t-stat-tile">
                  <span className="t-stat-key">At Risk</span>
                  <span className="t-stat-val text-warning">{scenario.populationAtRisk}</span>
                </div>
              </div>

              {/* Urgency Callout */}
              <div className="threat-urgency-callout">
                <span className="urgency-icon-sm">⚠️</span>
                <div className="urgency-text-block">
                  <span className="urgency-head">{scenario.evacuationUrgency}</span>
                  <p className="urgency-body">{scenario.summary}</p>
                </div>
              </div>

              {/* Key Hazard Vectors */}
              <div className="hazard-vectors-section">
                <div className="hazard-hdr">
                  <ActivityIcon className="w-3 h-3 text-danger" />
                  <span>KEY HAZARD VECTORS</span>
                </div>
                <div className="hazard-bars-list">
                  {scenario.threatBreakdown.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="hazard-bar-row">
                      <div className="hazard-row-labels">
                        <span className="h-name">{item.name}</span>
                        <span className="h-score" style={{ color: item.color }}>{item.score}%</span>
                      </div>
                      <div className="h-track">
                        <div className="h-fill" style={{ width: `${item.score}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2.2: Emergency Broadcast Alerts Preview (Top 2 Critical Alerts) */}
          <div className="card-glass dash-card alerts-preview-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon warning-icon">
                  <BellIcon className="w-3.5 h-3.5 text-warning" />
                </div>
                <span className="card-hdr-title">EMERGENCY BROADCASTS</span>
              </div>
              <button className="card-action-link" onClick={() => setActiveTab('alerts')}>
                <span>View All ({currentAlerts.length})</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div className="alerts-preview-body">
              {/* Alert Level Dial Banner */}
              <div className="alerts-dial-banner">
                <AlertLevelDial level={4} maxLevel={5} label="CRITICAL" color="#ef4444" size={38} />
                <div className="dial-banner-info">
                  <span className="dial-banner-title">P2P EMERGENCY BROADCAST ACTIVE</span>
                  <span className="dial-banner-sub">
                    {currentAlerts.filter((a) => a.priority === 'CRITICAL').length} Critical Warnings • 48 LoRa Nodes
                  </span>
                </div>
              </div>

              {/* Top 2 Critical Alerts */}
              <div className="alerts-preview-list">
                {currentAlerts.slice(0, 2).map((alert, idx) => {
                  const isAck = acknowledgedAlerts.includes(alert.id);
                  const isCrit = alert.priority === 'CRITICAL';

                  return (
                    <div key={alert.id} className={`preview-alert-item ${isCrit ? 'is-crit' : ''} ${isAck ? 'is-acked' : ''}`}>
                      <div className="p-alert-top">
                        <span className={`p-priority-badge ${isCrit ? 'crit' : 'warn'}`}>{alert.priority}</span>
                        <span className="p-time-badge">{alert.timestamp}</span>
                        <button
                          className={`p-ack-btn ${isAck ? 'acked' : ''}`}
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <CheckIcon className="w-2.5 h-2.5" />
                          <span>{isAck ? 'Ack' : 'Ack'}</span>
                        </button>
                      </div>

                      <h5 className="p-alert-title">{alert.title}</h5>
                      <div className="p-alert-loc">
                        <MapPinIcon className="w-2.5 h-2.5 text-cyan" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="p-alert-action">
                        <span className="action-tag">ACTION:</span>
                        <span className="action-text">{alert.actionRequired}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 3 (RIGHT, ~31% width): Safe Route Preview & AI Copilot Chat
            ========================================================================= */}
        <div className="dash-col dash-col-right">
          {/* Card 3.1: Safe Evacuation Corridor Preview (Small Overview Card) */}
          <div className="card-glass dash-card evac-preview-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon cyan-icon">
                  <RouteIcon className="w-3.5 h-3.5 text-cyan" />
                </div>
                <span className="card-hdr-title">SAFE EVACUATION CORRIDOR</span>
              </div>
              <div className="badge badge-success">
                <CheckIcon className="w-3 h-3" /> CLEAR
              </div>
            </div>

            <div className="evac-preview-body">
              <div className="corridor-hero-box">
                <div className="corridor-top-line">
                  <strong className="corridor-name">{primaryRoute.name.split(':')[0]}</strong>
                  <span className="corridor-score" style={{ color: getScoreColor(primaryRoute.safetyScore) }}>
                    {primaryRoute.safetyScore}% Safe
                  </span>
                </div>
                <div className="corridor-specs-row">
                  <span><strong>Dist:</strong> {primaryRoute.distance}</span>
                  <span>•</span>
                  <span><strong>ETA:</strong> {primaryRoute.estimatedTime}</span>
                  <span>•</span>
                  <span><strong>Elev:</strong> {primaryRoute.elevationProfile}</span>
                </div>
                <div className="corridor-hazard-note">
                  <ShieldIcon className="w-3 h-3 text-emerald-400" />
                  <span>Bypassed: <strong>Victoria Bridge Submerged</strong> (Ridge Expressway Clear)</span>
                </div>
              </div>

              <button className="btn-view-routes" onClick={() => setActiveTab('routes')}>
                <NavigationIcon className="w-3 h-3" />
                <span>Launch Full Route Navigation HUD ({safeRoutes.length} Routes)</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3.2: AI Disaster Copilot Chat Widget */}
          <div className="card-glass dash-card ai-copilot-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon purple-icon">
                  <BotIcon className="w-3.5 h-3.5 text-purple" />
                </div>
                <span className="card-hdr-title">AI DISASTER COPILOT</span>
              </div>
              <div className="badge badge-purple">
                <SparklesIcon className="w-2.5 h-2.5" /> LORA READY
              </div>
            </div>

            <div className="copilot-card-body">
              {/* Chat History Box */}
              <div className="copilot-chat-history">
                {aiMessages.slice(-3).map((msg) => (
                  <div
                    key={msg.id}
                    className={`copilot-bubble-row ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                  >
                    <div className="copilot-bubble-content">
                      <span className="copilot-sender">
                        {msg.sender === 'user' ? 'You' : 'ResQ Copilot'}
                      </span>
                      <p className="copilot-text">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="copilot-bubble-row bot-msg">
                    <div className="copilot-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="copilot-quick-chips">
                {DEFAULT_AI_PROMPTS.slice(0, 3).map((prompt, idx) => {
                  const short = prompt.split('?')[0] + '?';
                  return (
                    <button
                      key={idx}
                      className="copilot-chip-btn"
                      onClick={() => sendAiMessage(prompt)}
                      title={prompt}
                    >
                      ⚡ {short.length > 22 ? `${short.slice(0, 22)}...` : short}
                    </button>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleChatSubmit} className="copilot-input-form">
                <input
                  type="text"
                  placeholder="Ask AI Copilot for safety guidance..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="copilot-input"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiTyping}
                  className="copilot-send-btn"
                  title="Send message"
                >
                  <SendIcon className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .riskmap-page-view {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          min-width: 0;
        }

        /* 3-Column Grid Layout */
        .dashboard-3col-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: 0.75rem;
          width: 100%;
          min-width: 0;
          align-items: start;
        }

        .dash-col {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 0;
          width: 100%;
        }

        /* Card Container Styles */
        .dash-card {
          background: #0d1424;
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .dash-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.42rem 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.02);
          gap: 0.4rem;
          min-width: 0;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          min-width: 0;
        }

        .card-hdr-icon {
          width: 22px;
          height: 22px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cyan-icon { background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); }
        .green-icon { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
        .danger-icon { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); }
        .warning-icon { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }
        .purple-icon { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); }

        .card-hdr-title {
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-action-link {
          display: flex;
          align-items: center;
          gap: 0.15rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.65rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .card-action-link:hover {
          text-decoration: underline;
        }

        .map-badge-live {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          font-family: var(--font-mono);
          font-weight: 800;
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.35);
          padding: 0.1rem 0.4rem;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .pulse-dot-cyan {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 5px var(--cyan);
          animation: blink 1.2s infinite;
        }

        /* -------------------------------------------------------------
           COLUMN 1: Risk Map & Doppler Radar Styles
           ------------------------------------------------------------- */
        .map-card-body {
          padding: 0.55rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          min-width: 0;
        }

        .map-layer-pills {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .layer-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: #94a3b8;
          font-family: var(--font-main);
          font-size: 0.58rem;
          font-weight: 700;
          padding: 0.14rem 0.4rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .layer-pill.active-flood { background: rgba(239, 68, 68, 0.18); border-color: #ef4444; color: #fca5a5; }
        .layer-pill.active-shelter { background: rgba(16, 185, 129, 0.18); border-color: #10b981; color: #6ee7b7; }
        .layer-pill.active-hazard { background: rgba(245, 158, 11, 0.18); border-color: #f59e0b; color: #fcd34d; }
        .layer-pill.active-unit { background: rgba(6, 182, 212, 0.18); border-color: #06b6d4; color: #67e8f9; }

        .interactive-map-canvas {
          position: relative;
          width: 100%;
          height: 125px;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          overflow: hidden;
        }

        .radar-sweep-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }

        .radar-beam {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.15) 50%, rgba(6, 182, 212, 0.4) 100%);
          animation: radarSweep 4s linear infinite;
        }

        @keyframes radarSweep {
          0% { transform: translateX(0); }
          100% { transform: translateX(200%); }
        }

        .map-svg-layers {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .map-node-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-halo {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid;
          opacity: 0.6;
          animation: pinPulse 2s infinite ease-out;
        }

        @keyframes pinPulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .pin-core {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.5rem;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
          border: 1px solid #ffffff;
        }

        .map-node-pin.selected .pin-core {
          transform: scale(1.2);
          box-shadow: 0 0 10px var(--cyan);
        }

        .map-selected-popover {
          position: absolute;
          bottom: 4px;
          left: 4px;
          background: rgba(9, 14, 26, 0.92);
          border: 1px solid var(--cyan);
          border-radius: 4px;
          padding: 0.2rem 0.4rem;
          z-index: 20;
          backdrop-filter: blur(6px);
          font-size: 0.58rem;
          color: #ffffff;
        }

        .popover-type {
          font-weight: 800;
          color: var(--cyan);
        }

        .doppler-radar-panel {
          background: #090e18;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.45rem 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .doppler-top-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .doppler-temp-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.15rem 0.4rem;
          min-width: 48px;
        }

        .d-temp-main {
          font-size: 1.25rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #ffffff;
          line-height: 1;
        }

        .d-temp-sub {
          font-size: 0.52rem;
          color: var(--text-muted);
        }

        .d-cond-info {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
          min-width: 0;
          flex: 1;
        }

        .d-cond-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: #ffffff;
        }

        .d-radar-status {
          font-size: 0.58rem;
          color: var(--cyan);
          line-height: 1.15;
        }

        .forecast-chips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.3rem;
        }

        .forecast-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.18rem 0.35rem;
          font-size: 0.56rem;
        }

        .fc-day {
          font-weight: 700;
          color: var(--text-secondary);
        }

        .fc-icon {
          font-size: 0.7rem;
        }

        .fc-temp {
          font-weight: 800;
          font-family: var(--font-mono);
          color: #ffffff;
        }

        .fc-metric {
          font-size: 0.5rem;
          color: var(--cyan);
          font-family: var(--font-mono);
        }

        .wind-speed-bar-container {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.25rem 0.45rem;
        }

        .wind-bar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.58rem;
          color: #cbd5e1;
        }

        .wind-lbl {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .wind-dir {
          font-size: 0.52rem;
          color: #fca5a5;
          font-family: var(--font-mono);
        }

        .wind-track {
          width: 100%;
          height: 3.5px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }

        .wind-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8 0%, #f59e0b 60%, #ef4444 100%);
          border-radius: 9999px;
        }

        .flood-legend-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.54rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 0.25rem;
          padding-top: 0.15rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .legend-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
        .legend-dot.red { background: #ef4444; }
        .legend-dot.orange { background: #f59e0b; }
        .legend-dot.green { background: #10b981; }

        /* Shelter Capacity Summary Preview */
        .shelter-preview-body {
          padding: 0.55rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .shelter-summary-hero {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(16, 185, 129, 0.07);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 6px;
          padding: 0.35rem 0.55rem;
        }

        .summary-hero-meta {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
          flex: 1;
        }

        .summary-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.35rem;
        }

        .summary-title {
          font-size: 0.84rem;
          font-weight: 800;
          color: #34d399;
        }

        .summary-badge {
          font-size: 0.58rem;
          font-weight: 800;
          color: #34d399;
          background: rgba(16, 185, 129, 0.15);
          padding: 0.08rem 0.35rem;
          border-radius: 3px;
        }

        .summary-desc {
          font-size: 0.6rem;
          color: #94a3b8;
        }

        .shelter-action-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.62rem;
          color: var(--text-secondary);
          gap: 0.5rem;
        }

        .btn-open-directory {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-main);
          font-size: 0.64rem;
          font-weight: 700;
          padding: 0.2rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-open-directory:hover {
          background: #10b981;
          color: #050810;
        }

        /* -------------------------------------------------------------
           COLUMN 2: Disaster Threat & Critical Alerts Preview Styles
           ------------------------------------------------------------- */
        .threat-card-body, .alerts-preview-body {
          padding: 0.55rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .threat-gauge-box {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.1rem 0;
        }

        .threat-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.25rem;
        }

        .t-stat-tile {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.22rem 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.04rem;
        }

        .t-stat-key {
          font-size: 0.5rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.03em;
        }

        .t-stat-val {
          font-size: 0.80rem;
          font-weight: 800;
          color: #f1f5f9;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .threat-urgency-callout {
          display: flex;
          align-items: flex-start;
          gap: 0.35rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 5px;
          padding: 0.3rem 0.45rem;
        }

        .urgency-icon-sm {
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .urgency-text-block {
          display: flex;
          flex-direction: column;
          gap: 0.04rem;
          min-width: 0;
        }

        .urgency-head {
          font-size: 0.76rem;
          font-weight: 800;
          color: #fca5a5;
        }

        .urgency-body {
          font-size: 0.58rem;
          color: #cbd5e1;
          line-height: 1.25;
          margin: 0;
        }

        .hazard-vectors-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .hazard-hdr {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.56rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #f87171;
        }

        .hazard-bars-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .hazard-bar-row {
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
        }

        .hazard-row-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          font-weight: 600;
        }

        .h-name {
          color: #e2e8f0;
        }

        .h-score {
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 0.68rem;
        }

        .h-track {
          width: 100%;
          height: 3px;
          background: #050810;
          border-radius: 9999px;
          overflow: hidden;
        }

        .h-fill {
          height: 100%;
          border-radius: 9999px;
        }

        /* Alerts Preview Card Styles */
        .alerts-dial-banner {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(239, 68, 68, 0.07);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 5px;
          padding: 0.25rem 0.4rem;
        }

        .dial-banner-info {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .dial-banner-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #fca5a5;
          letter-spacing: 0.02em;
        }

        .dial-banner-sub {
          font-size: 0.55rem;
          color: var(--text-secondary);
        }

        .alerts-preview-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .preview-alert-item {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-left: 2.5px solid #64748b;
          border-radius: 5px;
          padding: 0.35rem 0.45rem;
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
        }

        .preview-alert-item.is-crit {
          border-left-color: #ef4444;
          background: radial-gradient(circle at top right, rgba(239, 68, 68, 0.08) 0%, #080d19 70%);
          border-color: rgba(239, 68, 68, 0.25);
        }

        .preview-alert-item.is-acked {
          opacity: 0.6;
          border-left-color: #334155;
        }

        .p-alert-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.25rem;
        }

        .p-priority-badge {
          font-size: 0.60rem;
          font-weight: 800;
          padding: 0.08rem 0.32rem;
          border-radius: 3px;
        }
        .p-priority-badge.crit { background: #ef4444; color: #ffffff; }
        .p-priority-badge.warn { background: #f59e0b; color: #111827; }

        .p-time-badge {
          font-size: 0.52rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .p-ack-btn {
          display: flex;
          align-items: center;
          gap: 0.15rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: #cbd5e1;
          font-family: var(--font-main);
          font-size: 0.52rem;
          font-weight: 700;
          padding: 0.08rem 0.3rem;
          border-radius: 2px;
          cursor: pointer;
        }

        .p-ack-btn.acked {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border-color: #10b981;
        }

        .p-alert-title {
          font-size: 0.68rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin: 0;
        }

        .p-alert-loc {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.56rem;
          color: var(--cyan);
        }

        .p-alert-action {
          background: #050810;
          border-radius: 3px;
          padding: 0.15rem 0.35rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.54rem;
        }

        .action-tag {
          color: #fbbf24;
          font-weight: 800;
        }

        .action-text {
          color: #f1f5f9;
        }

        /* -------------------------------------------------------------
           COLUMN 3: Safe Route Preview & AI Copilot Styles
           ------------------------------------------------------------- */
        .evac-preview-body, .copilot-card-body {
          padding: 0.55rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .corridor-hero-box {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 5px;
          padding: 0.45rem 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .corridor-top-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
        }

        .corridor-name {
          font-size: 0.74rem;
          font-weight: 800;
          color: #ffffff;
        }

        .corridor-score {
          font-size: 0.78rem;
          font-weight: 800;
          font-family: var(--font-mono);
        }

        .corridor-specs-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.58rem;
          color: var(--text-secondary);
        }

        .corridor-specs-row strong {
          color: #cbd5e1;
        }

        .corridor-hazard-note {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.55rem;
          color: #cbd5e1;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 3px;
          padding: 0.2rem 0.35rem;
        }

        .corridor-hazard-note strong {
          color: #34d399;
        }

        .btn-view-routes {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.64rem;
          font-weight: 800;
          padding: 0.38rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-view-routes:hover {
          background: var(--cyan);
          color: #050810;
        }

        /* AI Copilot Chat Styles */
        .copilot-chat-history {
          height: 105px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding-right: 0.2rem;
        }

        .copilot-bubble-row {
          display: flex;
          width: 100%;
        }

        .copilot-bubble-row.user-msg {
          justify-content: flex-end;
        }

        .copilot-bubble-content {
          max-width: 92%;
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.25rem 0.45rem;
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .user-msg .copilot-bubble-content {
          background: rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.35);
        }

        .copilot-sender {
          font-size: 0.5rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .copilot-text {
          font-size: 0.62rem;
          color: #f1f5f9;
          line-height: 1.25;
          margin: 0;
          word-break: break-word;
        }

        .copilot-typing {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 0.25rem 0.45rem;
          background: #080d19;
          border-radius: 4px;
        }

        .copilot-typing span {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--cyan);
          animation: blink 1.2s infinite ease-in-out;
        }

        .copilot-quick-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2rem;
        }

        .copilot-chip-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.54rem;
          font-weight: 600;
          padding: 0.1rem 0.35rem;
          border-radius: 9999px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .copilot-chip-btn:hover {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
        }

        .copilot-input-form {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.1rem;
        }

        .copilot-input {
          flex: 1;
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.25rem 0.45rem;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.65rem;
          outline: none;
        }

        .copilot-input:focus {
          border-color: var(--cyan);
        }

        .copilot-send-btn {
          background: var(--cyan);
          border: none;
          color: #050810;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .copilot-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .copilot-send-btn:not(:disabled):hover {
          box-shadow: 0 0 8px var(--cyan);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .dashboard-3col-grid {
            grid-template-columns: 1fr 1fr;
          }
          .dash-col-left {
            grid-column: span 2;
          }
        }

        @media (max-width: 860px) {
          .dashboard-3col-grid {
            grid-template-columns: 1fr;
          }
          .dash-col-left {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default RiskMapPage;
