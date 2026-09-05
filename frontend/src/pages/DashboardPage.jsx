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
  RainIcon,
  DropletsIcon,
  BotIcon,
  SparklesIcon,
  SendIcon,
  TrendingUpIcon,
  CloudLightningIcon,
  SunIcon,
  CrosshairIcon,
  LayersIcon
} from '../components/Icons';
import { CircularGauge, SemiCircularGauge, AlertLevelDial } from '../components/Gauges';
import { MAP_NODES, DEFAULT_AI_PROMPTS } from '../data/mockData';

export const DashboardPage = () => {
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

  // Right Column: AI Evacuation Corridor State
  const [selectedRouteId, setSelectedRouteId] = useState(safeRoutes[0]?.id || 'RT-ALPHA');
  const selectedRoute = safeRoutes.find((r) => r.id === selectedRouteId) || safeRoutes[0];

  // Right Column: AI Copilot State
  const [chatInput, setChatInput] = useState('');

  // Calculations for Shelter Capacity Card
  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacityTotal, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.capacityOccupied, 0);
  const totalOpenBeds = shelters.reduce((acc, s) => acc + s.bedsAvailable, 0);
  const openBedsPct = totalCapacity > 0 ? Math.round((totalOpenBeds / totalCapacity) * 100) : 30;
  const occupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 70;

  // Weather data from scenario
  const weather = scenario.weather;

  // Dynamic 3-day forecast based on scenario
  const forecastDays = [
    { day: 'Wed (Today)', temp: weather.temperature, icon: '⛈️', condition: 'Violent Surge', metric: weather.rainfallRate },
    { day: 'Sat', temp: '26°C', icon: '🌧️', condition: 'Heavy Rain', metric: '18 mm/hr' },
    { day: 'Mon', temp: '29°C', icon: '🌤️', condition: 'Receding Flood', metric: '2 mm/hr' }
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
    <div className="dashboard-redesign-view">
      <div className="dashboard-3col-grid">
        {/* =========================================================================
            COLUMN 1 (LEFT, ~40% width): Risk Map & Shelter Capacity
            ========================================================================= */}
        <div className="dash-col dash-col-left">
          {/* Card 1.1: Interactive Risk Map with Live Doppler Radar Overlay */}
          <div className="card-glass dash-card risk-map-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon cyan-icon">
                  <MapIcon className="w-4 h-4 text-cyan" />
                </div>
                <span className="card-hdr-title">RISK MAP & GIS RADAR</span>
              </div>
              <div className="map-badge-live">
                <span className="pulse-dot-cyan"></span>
                <span>DOPPLER ACTIVE</span>
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

              {/* Map Canvas / Visualization */}
              <div className="interactive-map-canvas">
                <div className="radar-sweep-grid">
                  <div className="radar-beam"></div>
                </div>

                {/* SVG Polygons: Flood Surge, Moderate Buffer, Safe Ridge, Evac Polyline */}
                <svg className="map-svg-layers" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {showFloodLayer && (
                    <polygon
                      points="8,78 38,86 74,68 96,88 96,98 5,98"
                      fill="rgba(239, 68, 68, 0.25)"
                      stroke="#ef4444"
                      strokeWidth="0.8"
                      strokeDasharray="2 1"
                    />
                  )}
                  {showFloodLayer && (
                    <polygon
                      points="12,54 52,60 82,42 94,62 94,88 8,78"
                      fill="rgba(245, 158, 11, 0.14)"
                      stroke="#f59e0b"
                      strokeWidth="0.5"
                    />
                  )}
                  <polygon
                    points="8,6 92,6 92,34 58,28 18,38"
                    fill="rgba(16, 185, 129, 0.12)"
                    stroke="#10b981"
                    strokeWidth="0.5"
                  />
                  {/* Evacuation Route Corridor Line */}
                  <polyline
                    points="20,74 34,48 64,36 86,22"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeDasharray="2.5 1.5"
                  />
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

                {/* Pin Hover/Select Tooltip */}
                {selectedPin && (
                  <div className="map-selected-popover">
                    <div className="popover-type">{selectedPin.type.toUpperCase()}</div>
                    <div className="popover-name">{selectedPin.name}</div>
                    <div className="popover-desc">{selectedPin.label}</div>
                  </div>
                )}
              </div>

              {/* Overlay Panel: Live Doppler Radar Telemetry */}
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

                {/* 3-Day Forecast Chips (Today, Sat, Mon) */}
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

                {/* Wind Speed Slider / Bar Indicator */}
                <div className="wind-speed-bar-container">
                  <div className="wind-bar-header">
                    <div className="wind-lbl">
                      <WindIcon className="w-3.5 h-3.5 text-warning" />
                      <span>Sustained Wind: <strong>{weather.windSpeed}</strong></span>
                    </div>
                    <span className="wind-gusts">Gusts: {weather.windGusts} ({weather.windDirection})</span>
                  </div>
                  <div className="wind-track">
                    <div className="wind-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>

                {/* Flood Risk Legend */}
                <div className="flood-legend-bar">
                  <div className="legend-item">
                    <span className="legend-dot red"></span>
                    <span>High Inundation (&gt;3.5m)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot orange"></span>
                    <span>Moderate Surge Buffer</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot green"></span>
                    <span>Safe Ridge Corridor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1.2: High-Ground Relief Shelter Capacity */}
          <div className="card-glass dash-card shelter-capacity-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon green-icon">
                  <ShelterIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="card-hdr-title">HIGH-GROUND RELIEF SHELTER CAPACITY</span>
              </div>
              <button className="card-action-link" onClick={() => setActiveTab('shelters')}>
                <span>Directory</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div className="shelter-capacity-body">
              {/* Left Circular Percentage Gauge alongside Shelters List */}
              <div className="shelter-gauge-hero">
                <div className="gauge-circle-wrap">
                  <CircularGauge
                    value={openBedsPct}
                    size={72}
                    strokeWidth={6}
                    color="#10b981"
                    trackColor="rgba(255, 255, 255, 0.08)"
                    label={`${openBedsPct}%`}
                    sublabel="OPEN BEDS"
                  />
                </div>
                <div className="gauge-hero-meta">
                  <span className="hero-meta-title">{totalOpenBeds} BEDS AVAILABLE</span>
                  <span className="hero-meta-sub">
                    {totalOccupied}/{totalCapacity} Total Capacity Occupied
                  </span>
                  <div className="high-ground-tag">
                    <ShieldIcon className="w-3 h-3 text-emerald-400" />
                    <span>VERIFIED FLOOD-CLEAR ZONE</span>
                  </div>
                </div>
              </div>

              {/* Shelters List with Progress Bars */}
              <div className="shelters-compact-list">
                {shelters.slice(0, 3).map((shelter) => {
                  const occ = Math.round((shelter.capacityOccupied / shelter.capacityTotal) * 100);
                  const isClosed = shelter.status.includes('CLOSED');
                  const barColor = occ > 85 ? '#ef4444' : occ > 75 ? '#f59e0b' : '#10b981';

                  return (
                    <div key={shelter.id} className={`shelter-compact-item ${isClosed ? 'is-closed' : ''}`}>
                      <div className="s-compact-top">
                        <div className="s-compact-name-wrap">
                          <span className="s-name">{shelter.name}</span>
                          <span className="s-meta">
                            {shelter.distance} • Elev: {shelter.elevation}
                          </span>
                        </div>
                        <span className="s-beds-count" style={{ color: barColor }}>
                          {isClosed ? 'ZONE CLOSED' : `${shelter.bedsAvailable} Beds Open`}
                        </span>
                      </div>

                      {/* Occupancy Progress Bar */}
                      <div className="s-progress-track">
                        <div
                          className="s-progress-fill"
                          style={{
                            width: isClosed ? '100%' : `${occ}%`,
                            backgroundColor: isClosed ? '#ef4444' : barColor
                          }}
                        ></div>
                      </div>

                      <div className="s-compact-foot">
                        <span className="s-occ-text">{isClosed ? 'Submerged Roadway' : `${occ}% Occupied`}</span>
                        {!isClosed && (
                          <button
                            className="s-nav-mini-btn"
                            onClick={() => setActiveTab('routes')}
                          >
                            <NavigationIcon className="w-3 h-3" />
                            <span>Navigate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2 (MIDDLE, ~30% width): Disaster Risk Threat & Alerts Feed
            ========================================================================= */}
        <div className="dash-col dash-col-mid">
          {/* Card 2.1: Disaster Threat Risk Index */}
          <div className="card-glass dash-card threat-index-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon danger-icon">
                  <AlertTriangleIcon className="w-4 h-4 text-danger" />
                </div>
                <span className="card-hdr-title">DISASTER THREAT RISK INDEX</span>
              </div>
              <div className="badge badge-critical">
                <span className="blinking">●</span> {scenario.severity}
              </div>
            </div>

            <div className="threat-card-body">
              {/* Large Circular Arc Gauge (Speedometer Style) */}
              <div className="threat-gauge-box">
                <SemiCircularGauge
                  value={scenario.riskScore}
                  max={100}
                  severity={scenario.threatLevel}
                  width={150}
                  height={82}
                  color={getScoreColor(scenario.riskScore)}
                />
              </div>

              {/* Threat Key Stats Grid */}
              <div className="threat-stats-grid">
                <div className="t-stat-tile">
                  <span className="t-stat-key">Status</span>
                  <span className="t-stat-val text-danger">{scenario.status}</span>
                </div>
                <div className="t-stat-tile">
                  <span className="t-stat-key">Affected Radius</span>
                  <span className="t-stat-val">{scenario.affectedRadius}</span>
                </div>
                <div className="t-stat-tile">
                  <span className="t-stat-key">Primary Impact</span>
                  <span className="t-stat-val">{scenario.impactZone}</span>
                </div>
                <div className="t-stat-tile">
                  <span className="t-stat-key">Population at Risk</span>
                  <span className="t-stat-val text-warning">{scenario.populationAtRisk}</span>
                </div>
              </div>

              {/* Urgency Callout Banner */}
              <div className="threat-urgency-callout">
                <div className="urgency-icon-wrap">⚠️</div>
                <div className="urgency-text-block">
                  <span className="urgency-head">{scenario.evacuationUrgency}</span>
                  <p className="urgency-body">{scenario.summary}</p>
                </div>
              </div>

              {/* Key Hazard Vectors Progress Bars */}
              <div className="hazard-vectors-section">
                <div className="hazard-hdr">
                  <ActivityIcon className="w-3.5 h-3.5 text-danger" />
                  <span>KEY HAZARD VECTORS</span>
                </div>
                <div className="hazard-bars-list">
                  {scenario.threatBreakdown.map((item, idx) => (
                    <div key={idx} className="hazard-bar-row">
                      <div className="hazard-row-labels">
                        <span className="h-name">{item.name}</span>
                        <span className="h-score" style={{ color: item.color }}>
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-track">
                        <div
                          className="h-fill"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: item.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2.2: Emergency Broadcast Alert Feed */}
          <div className="card-glass dash-card alerts-feed-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon warning-icon">
                  <BellIcon className="w-4 h-4 text-warning" />
                </div>
                <span className="card-hdr-title">EMERGENCY BROADCAST ALERTS</span>
              </div>
              <button className="card-action-link" onClick={() => setActiveTab('alerts')}>
                <span>View All ({currentAlerts.length})</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>

            <div className="alerts-feed-body">
              {/* Small Dial Gauge for Alert Threat Level */}
              <div className="alerts-dial-banner">
                <AlertLevelDial
                  level={4}
                  maxLevel={5}
                  label="CRITICAL"
                  color="#ef4444"
                  size={48}
                />
                <div className="dial-banner-info">
                  <span className="dial-banner-title">P2P EMERGENCY BROADCAST NETWORK</span>
                  <span className="dial-banner-sub">
                    {currentAlerts.filter((a) => a.priority === 'CRITICAL').length} Critical • LoRa Mesh Active
                  </span>
                </div>
              </div>

              {/* Scrollable Alert Items List */}
              <div className="alerts-scroll-container">
                {currentAlerts.slice(0, 4).map((alert, idx) => {
                  const isAck = acknowledgedAlerts.includes(alert.id);
                  const isUrgent = idx === 0 || alert.priority === 'CRITICAL';

                  return (
                    <div
                      key={alert.id}
                      className={`dash-alert-card ${isUrgent ? 'is-urgent' : ''} ${isAck ? 'is-acked' : ''}`}
                    >
                      <div className="alert-card-top">
                        <span className={`alert-priority-badge ${alert.priority === 'CRITICAL' ? 'crit' : 'warn'}`}>
                          {alert.priority}
                        </span>
                        <span className="alert-time-badge">{alert.timestamp}</span>
                        <button
                          className={`alert-ack-btn ${isAck ? 'acked' : ''}`}
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <CheckIcon className="w-3 h-3" />
                          <span>{isAck ? 'Ack' : 'Acknowledge'}</span>
                        </button>
                      </div>

                      <h5 className="alert-card-heading">{alert.title}</h5>

                      <div className="alert-card-location">
                        <MapPinIcon className="w-3 h-3 text-cyan" />
                        <span>{alert.location}</span>
                      </div>

                      <p className="alert-card-snippet">{alert.summary}</p>

                      <div className="alert-card-action">
                        <span className="action-tag">ACTION:</span>
                        <span className="action-desc">{alert.actionRequired}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 3 (RIGHT, ~30% width): AI Evac Route, Mini Stats, AI Copilot
            ========================================================================= */}
        <div className="dash-col dash-col-right">
          {/* Card 3.1: AI Evacuation Corridor Route */}
          <div className="card-glass dash-card evac-route-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon cyan-icon">
                  <RouteIcon className="w-4 h-4 text-cyan" />
                </div>
                <span className="card-hdr-title">AI EVACUATION CORRIDOR</span>
              </div>
              <div className="badge badge-success">
                <CheckIcon className="w-3 h-3" /> CLEAR
              </div>
            </div>

            <div className="evac-route-body">
              {/* Route Dropdown Selector */}
              <div className="route-select-wrapper">
                <label className="route-select-lbl">CORRIDOR SELECTION:</label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="route-dropdown-select"
                >
                  {safeRoutes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.safetyScore}% Safe)
                    </option>
                  ))}
                </select>
              </div>

              {/* Route Preview Map / HUD & Safety Score Progress Bar */}
              {selectedRoute && (
                <div className="route-preview-hud">
                  <div className="hud-header">
                    <div className="hud-dest">
                      <span>Destination:</span>
                      <strong>{selectedRoute.destination}</strong>
                    </div>
                    <div className="hud-score-badge" style={{ color: getScoreColor(selectedRoute.safetyScore) }}>
                      {selectedRoute.safetyScore}% Safety Score
                    </div>
                  </div>

                  {/* Safety Score Progress Bar */}
                  <div className="safety-bar-track">
                    <div
                      className="safety-bar-fill"
                      style={{
                        width: `${selectedRoute.safetyScore}%`,
                        backgroundColor: getScoreColor(selectedRoute.safetyScore)
                      }}
                    ></div>
                  </div>

                  {/* Distance / Time Stats Grid */}
                  <div className="route-hud-stats-grid">
                    <div className="hud-stat-box">
                      <span className="h-lbl">Distance</span>
                      <span className="h-val">{selectedRoute.distance}</span>
                    </div>
                    <div className="hud-stat-box">
                      <span className="h-lbl">Est. Time</span>
                      <span className="h-val text-cyan">{selectedRoute.estimatedTime}</span>
                    </div>
                    <div className="hud-stat-box">
                      <span className="h-lbl">Elevation</span>
                      <span className="h-val text-emerald">{selectedRoute.elevationProfile}</span>
                    </div>
                  </div>

                  {/* Hazards Avoided Snippet */}
                  <div className="route-hazard-avoided-strip">
                    <ShieldIcon className="w-3 h-3 text-emerald-400" />
                    <span>Bypassed: <strong>Victoria Bridge Submerged</strong> (Elevation &gt;35m)</span>
                  </div>

                  <button className="btn-launch-corridor" onClick={() => setActiveTab('routes')}>
                    <NavigationIcon className="w-3.5 h-3.5" />
                    <span>LAUNCH CORRIDOR HUD MAP</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 3.2: Mini Stat Pair: Traffic Flow & Risks */}
          <div className="mini-stats-pair-row">
            <div className="card-glass mini-stat-card traffic-mini-card">
              <div className="mini-stat-hdr">
                <span className="mini-stat-title">TRAFFIC FLOW</span>
                <TrendingUpIcon className="w-3.5 h-3.5 text-cyan" />
              </div>
              <div className="mini-stat-body">
                <span className="mini-stat-val text-cyan">42 km/h</span>
                <span className="mini-stat-sub">Moderate • Clear Ridge</span>
              </div>
            </div>

            <div className="card-glass mini-stat-card risks-mini-card">
              <div className="mini-stat-hdr">
                <span className="mini-stat-title">HAZARDS FILTERED</span>
                <ShieldIcon className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="mini-stat-body">
                <span className="mini-stat-val text-emerald">4 Avoided</span>
                <span className="mini-stat-sub">100% Safe Route HUD</span>
              </div>
            </div>
          </div>

          {/* Card 3.3: AI Disaster Copilot Chat Widget */}
          <div className="card-glass dash-card ai-copilot-card">
            <div className="dash-card-header">
              <div className="header-title-group">
                <div className="card-hdr-icon purple-icon">
                  <BotIcon className="w-4 h-4 text-purple" />
                </div>
                <span className="card-hdr-title">AI DISASTER COPILOT</span>
              </div>
              <div className="badge badge-purple">
                <SparklesIcon className="w-3 h-3" /> LORA READY
              </div>
            </div>

            <div className="copilot-card-body">
              {/* Chat History Box */}
              <div className="copilot-chat-history">
                {aiMessages.slice(-4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`copilot-bubble-row ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                  >
                    <div className="copilot-bubble-content">
                      <span className="copilot-sender">
                        {msg.sender === 'user' ? 'You' : 'ResQ Copilot'}
                      </span>
                      <p className="copilot-text">
                        {msg.text.length > 180 ? `${msg.text.slice(0, 180)}...` : msg.text}
                      </p>
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

              {/* Quick Prompts Chips */}
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
                      ⚡ {short.length > 24 ? `${short.slice(0, 24)}...` : short}
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
                  <SendIcon className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-redesign-view {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          min-width: 0;
          overflow-x: hidden;
        }

        /* 3-Column Grid Layout: 40% (1.35fr) - 30% (1fr) - 30% (1fr) */
        .dashboard-3col-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: 1rem;
          width: 100%;
          min-width: 0;
          align-items: start;
        }

        .dash-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
          width: 100%;
        }

        /* Generic Dashboard Card Style */
        .dash-card {
          background: #0d1424;
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }

        .dash-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.02);
          gap: 0.5rem;
          min-width: 0;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
        }

        .card-hdr-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
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
          font-size: 0.78rem;
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
          gap: 0.2rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.7rem;
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
          gap: 0.35rem;
          font-size: 0.62rem;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          padding: 0.12rem 0.45rem;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .pulse-dot-cyan {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 6px var(--cyan);
          animation: blink 1.2s infinite;
        }

        /* -------------------------------------------------------------
           COLUMN 1: Risk Map & Doppler Radar Styles
           ------------------------------------------------------------- */
        .map-card-body {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          min-width: 0;
        }

        .map-layer-pills {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .layer-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: #94a3b8;
          font-family: var(--font-main);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
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
          height: 220px;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .radar-sweep-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
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
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid;
          opacity: 0.6;
          animation: pinPulse 2s infinite ease-out;
        }

        @keyframes pinPulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .pin-core {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
          border: 1.5px solid #ffffff;
        }

        .map-node-pin.selected .pin-core {
          transform: scale(1.25);
          box-shadow: 0 0 14px var(--cyan);
        }

        .map-selected-popover {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(9, 14, 26, 0.92);
          border: 1px solid var(--cyan);
          border-radius: 6px;
          padding: 0.35rem 0.55rem;
          z-index: 20;
          backdrop-filter: blur(6px);
          max-width: 200px;
        }

        .popover-type {
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--cyan);
          letter-spacing: 0.05em;
        }

        .popover-name {
          font-size: 0.7rem;
          font-weight: 700;
          color: #ffffff;
        }

        .popover-desc {
          font-size: 0.6rem;
          color: #cbd5e1;
        }

        /* Doppler Radar Overlay Panel */
        .doppler-radar-panel {
          background: #090e18;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .doppler-top-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .doppler-temp-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.25rem 0.55rem;
          min-width: 58px;
        }

        .d-temp-main {
          font-size: 1.15rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #ffffff;
          line-height: 1;
        }

        .d-temp-sub {
          font-size: 0.55rem;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .doppler-cond-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
          flex: 1;
        }

        .d-cond-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffffff;
        }

        .d-radar-status {
          font-size: 0.64rem;
          color: var(--cyan);
          line-height: 1.25;
        }

        .forecast-chips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
        }

        .forecast-chip {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.3rem 0.2rem;
          text-align: center;
          gap: 0.08rem;
        }

        .fc-day {
          font-size: 0.56rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .fc-icon {
          font-size: 0.85rem;
        }

        .fc-temp {
          font-size: 0.74rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #ffffff;
        }

        .fc-metric {
          font-size: 0.55rem;
          color: var(--cyan);
          font-family: var(--font-mono);
        }

        .wind-speed-bar-container {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.35rem 0.55rem;
        }

        .wind-bar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.64rem;
          color: #cbd5e1;
        }

        .wind-lbl {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .wind-gusts {
          font-size: 0.58rem;
          color: #fca5a5;
          font-family: var(--font-mono);
        }

        .wind-track {
          width: 100%;
          height: 5px;
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
          font-size: 0.58rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 0.35rem;
          padding-top: 0.2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .legend-dot.red { background: #ef4444; }
        .legend-dot.orange { background: #f59e0b; }
        .legend-dot.green { background: #10b981; }

        /* -------------------------------------------------------------
           Shelter Capacity Card Styles
           ------------------------------------------------------------- */
        .shelter-capacity-body {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .shelter-gauge-hero {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(16, 185, 129, 0.07);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.75rem;
        }

        .gauge-circle-wrap {
          flex-shrink: 0;
        }

        .gauge-hero-meta {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }

        .hero-meta-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #34d399;
          letter-spacing: 0.02em;
        }

        .hero-meta-sub {
          font-size: 0.68rem;
          color: #94a3b8;
        }

        .high-ground-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.58rem;
          font-weight: 800;
          color: #34d399;
          margin-top: 0.15rem;
        }

        .shelters-compact-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .shelter-compact-item {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.5rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .shelter-compact-item.is-closed {
          opacity: 0.6;
        }

        .s-compact-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.4rem;
        }

        .s-compact-name-wrap {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .s-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .s-meta {
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .s-beds-count {
          font-size: 0.68rem;
          font-weight: 800;
          font-family: var(--font-mono);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .s-progress-track {
          width: 100%;
          height: 4.5px;
          background: #050810;
          border-radius: 9999px;
          overflow: hidden;
        }

        .s-progress-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.6s ease;
        }

        .s-compact-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.62rem;
          color: var(--text-secondary);
        }

        .s-nav-mini-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-main);
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .s-nav-mini-btn:hover {
          background: #10b981;
          color: #050810;
        }

        /* -------------------------------------------------------------
           COLUMN 2: Disaster Threat & Alerts Feed Styles
           ------------------------------------------------------------- */
        .threat-card-body, .alerts-feed-body {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .threat-gauge-box {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem 0;
        }

        .threat-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem;
        }

        .t-stat-tile {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.35rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
        }

        .t-stat-key {
          font-size: 0.54rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.04em;
        }

        .t-stat-val {
          font-size: 0.74rem;
          font-weight: 700;
          color: #f1f5f9;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .threat-urgency-callout {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 6px;
          padding: 0.45rem 0.6rem;
        }

        .urgency-icon-wrap {
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .urgency-text-block {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .urgency-head {
          font-size: 0.72rem;
          font-weight: 800;
          color: #fca5a5;
        }

        .urgency-body {
          font-size: 0.65rem;
          color: #cbd5e1;
          line-height: 1.35;
          margin: 0;
        }

        .hazard-vectors-section {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .hazard-hdr {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #f87171;
        }

        .hazard-bars-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .hazard-bar-row {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .hazard-row-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          font-weight: 600;
        }

        .h-name {
          color: #e2e8f0;
        }

        .h-score {
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 0.66rem;
        }

        .h-track {
          width: 100%;
          height: 4px;
          background: #050810;
          border-radius: 9999px;
          overflow: hidden;
        }

        .h-fill {
          height: 100%;
          border-radius: 9999px;
        }

        /* Alerts Feed Card Styles */
        .alerts-dial-banner {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(239, 68, 68, 0.07);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 6px;
          padding: 0.45rem 0.65rem;
        }

        .dial-banner-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .dial-banner-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fca5a5;
          letter-spacing: 0.03em;
        }

        .dial-banner-sub {
          font-size: 0.62rem;
          color: var(--text-secondary);
        }

        .alerts-scroll-container {
          max-height: 290px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-right: 0.2rem;
        }

        .dash-alert-card {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-left: 3px solid #64748b;
          border-radius: 6px;
          padding: 0.55rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dash-alert-card.is-urgent {
          border-left-color: #ef4444;
          background: radial-gradient(circle at top right, rgba(239, 68, 68, 0.1) 0%, #080d19 70%);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .dash-alert-card.is-acked {
          opacity: 0.6;
          border-left-color: #334155;
        }

        .alert-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.35rem;
        }

        .alert-priority-badge {
          font-size: 0.56rem;
          font-weight: 800;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
        }
        .alert-priority-badge.crit { background: #ef4444; color: #ffffff; }
        .alert-priority-badge.warn { background: #f59e0b; color: #111827; }

        .alert-time-badge {
          font-size: 0.58rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .alert-ack-btn {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: #cbd5e1;
          font-family: var(--font-main);
          font-size: 0.58rem;
          font-weight: 700;
          padding: 0.12rem 0.4rem;
          border-radius: 3px;
          cursor: pointer;
        }
        .alert-ack-btn.acked {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border-color: #10b981;
        }

        .alert-card-heading {
          font-size: 0.74rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
          margin: 0;
        }

        .alert-card-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.62rem;
          color: var(--cyan);
        }

        .alert-card-snippet {
          font-size: 0.65rem;
          color: #cbd5e1;
          line-height: 1.35;
          margin: 0;
        }

        .alert-card-action {
          background: #050810;
          border-radius: 4px;
          padding: 0.25rem 0.45rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6rem;
        }

        .action-tag {
          color: #fbbf24;
          font-weight: 800;
        }

        .action-desc {
          color: #f1f5f9;
        }

        /* -------------------------------------------------------------
           COLUMN 3: AI Evacuation Corridor & Copilot Styles
           ------------------------------------------------------------- */
        .evac-route-body, .copilot-card-body {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .route-select-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .route-select-lbl {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #64748b;
        }

        .route-dropdown-select {
          width: 100%;
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.4rem 0.55rem;
          outline: none;
          cursor: pointer;
        }

        .route-dropdown-select option {
          background: #0d1424;
          color: #ffffff;
        }

        .route-preview-hud {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .hud-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.68rem;
        }

        .hud-dest {
          display: flex;
          flex-direction: column;
          color: #94a3b8;
        }
        .hud-dest strong {
          color: #ffffff;
          font-size: 0.74rem;
        }

        .hud-score-badge {
          font-size: 0.72rem;
          font-weight: 800;
          font-family: var(--font-mono);
        }

        .safety-bar-track {
          width: 100%;
          height: 6px;
          background: #050810;
          border-radius: 9999px;
          overflow: hidden;
        }

        .safety-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.6s ease;
        }

        .route-hud-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.35rem;
        }

        .hud-stat-box {
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.25rem 0.35rem;
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .h-lbl {
          font-size: 0.52rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .h-val {
          font-size: 0.72rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #ffffff;
        }

        .route-hazard-avoided-strip {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6rem;
          color: #cbd5e1;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 4px;
          padding: 0.3rem 0.45rem;
        }

        .btn-launch-corridor {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.45rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-launch-corridor:hover {
          background: var(--cyan);
          color: #050810;
        }

        /* Mini Stats Pair */
        .mini-stats-pair-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
        }

        .mini-stat-card {
          background: #0d1424;
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mini-stat-hdr {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mini-stat-title {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .mini-stat-body {
          display: flex;
          flex-direction: column;
        }

        .mini-stat-val {
          font-size: 1rem;
          font-weight: 800;
          font-family: var(--font-mono);
          line-height: 1.1;
        }

        .mini-stat-sub {
          font-size: 0.6rem;
          color: var(--text-muted);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* AI Copilot Card Styles */
        .copilot-chat-history {
          height: 160px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding-right: 0.25rem;
        }

        .copilot-bubble-row {
          display: flex;
          width: 100%;
        }

        .copilot-bubble-row.user-msg {
          justify-content: flex-end;
        }

        .copilot-bubble-content {
          max-width: 90%;
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 0.4rem 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .user-msg .copilot-bubble-content {
          background: rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.35);
        }

        .copilot-sender {
          font-size: 0.54rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .copilot-text {
          font-size: 0.68rem;
          color: #f1f5f9;
          line-height: 1.35;
          margin: 0;
          word-break: break-word;
        }

        .copilot-typing {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 0.35rem 0.55rem;
          background: #080d19;
          border-radius: 6px;
        }

        .copilot-typing span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--cyan);
          animation: blink 1.2s infinite ease-in-out;
        }

        .copilot-quick-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .copilot-chip-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.58rem;
          font-weight: 600;
          padding: 0.15rem 0.4rem;
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
          gap: 0.3rem;
          margin-top: 0.15rem;
        }

        .copilot-input {
          flex: 1;
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.35rem 0.55rem;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.72rem;
          outline: none;
        }

        .copilot-input:focus {
          border-color: var(--cyan);
        }

        .copilot-send-btn {
          background: var(--cyan);
          border: none;
          color: #050810;
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
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
          box-shadow: 0 0 10px var(--cyan);
        }

        /* -------------------------------------------------------------
           Responsive Media Queries for 1280px, 1440px, 1920px & Mobile
           ------------------------------------------------------------- */
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
export default DashboardPage;
