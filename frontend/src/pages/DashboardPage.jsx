import React, { useState, useEffect } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { StatCard } from '../components/StatCard';
import {
  AlertTriangleIcon,
  ShelterIcon,
  RouteIcon,
  BellIcon,
  ActivityIcon,
  RadioIcon,
  MapIcon,
  MapPinIcon,
  ChevronRightIcon,
  ShieldIcon,
  UsersIcon,
  AmbulanceIcon,
  BoatIcon,
  PackageIcon,
  HeartPulseIcon,
  ClockIcon,
  SparklesIcon,
  LayersIcon
} from '../components/Icons';
import { getTriageQueue } from '../services/sosService';
import { getResourceAllocation } from '../services/statsService';

export const DashboardPage = () => {
  const { scenario, currentAlerts, shelters, setActiveTab } = useDisaster();

  // State for AI Triage Queue & Resource Allocation
  const [triageQueue, setTriageQueue] = useState([]);
  const [triageFilter, setTriageFilter] = useState('ALL');
  const [resources, setResources] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getTriageQueue(), getResourceAllocation()]).then(([triageData, resourceData]) => {
      if (isMounted) {
        setTriageQueue(triageData);
        setResources(resourceData);
        setLoadingData(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [scenario]);

  const openSheltersCount = shelters.filter((s) => !s.status.includes('CLOSED')).length;
  const criticalAlertsCount = currentAlerts.filter((a) => a.priority === 'CRITICAL').length;
  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacityTotal, 0);
  const totalOpenBeds = shelters.reduce((acc, s) => acc + s.bedsAvailable, 0);
  const openBedsPct = totalCapacity > 0 ? Math.round((totalOpenBeds / totalCapacity) * 100) : 30;

  // Filter triage queue: strictly top 2 items by default for clean breathing room & at-a-glance scanning
  const filteredTriage = (triageFilter === 'ALL'
    ? triageQueue
    : triageQueue.filter((item) => item.urgency === triageFilter)
  ).slice(0, 2);

  const getUrgencyBadgeStyle = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.6)', text: '#fca5a5' };
      case 'HIGH':
        return { bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.5)', text: '#fcd34d' };
      case 'MEDIUM':
        return { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)', text: '#67e8f9' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)', text: '#cbd5e1' };
    }
  };

  const getResourceIcon = (iconName) => {
    switch (iconName) {
      case 'AmbulanceIcon':
        return <AmbulanceIcon className="w-4 h-4 text-rose-400" />;
      case 'BoatIcon':
        return <BoatIcon className="w-4 h-4 text-cyan" />;
      case 'UsersIcon':
        return <UsersIcon className="w-4 h-4 text-emerald-400" />;
      case 'PackageIcon':
        return <PackageIcon className="w-4 h-4 text-amber-400" />;
      default:
        return <HeartPulseIcon className="w-4 h-4 text-cyan" />;
    }
  };

  return (
    <div className="dashboard-clean-view">
      {/* 1. Top 4 Operations Stat Counters */}
      <div className="grid-stats">
        <StatCard
          title="Incident Threat Index"
          value={`${scenario.riskScore}/100`}
          subtext={scenario.threatLevel}
          icon={AlertTriangleIcon}
          trend="LIVE DIAL"
          color="danger"
          gaugeValue={scenario.riskScore}
          onClick={() => setActiveTab('map')}
        />
        <StatCard
          title="Active Alerts"
          value={`${currentAlerts.length} Broadcasts`}
          subtext={`${criticalAlertsCount} Critical Evacuations`}
          icon={ActivityIcon}
          trend="+2 Broadcast"
          color="warning"
          onClick={() => setActiveTab('alerts')}
        />
        <StatCard
          title="Operational Shelters"
          value={`${openSheltersCount} Open`}
          subtext={`${totalOpenBeds} Beds Available`}
          icon={ShelterIcon}
          trend="Safe Ridge"
          color="success"
          gaugeValue={openBedsPct}
          onClick={() => setActiveTab('shelters')}
        />
        <StatCard
          title="Response Units Online"
          value={`${scenario.activeResponseUnits} Units`}
          subtext="Boat, Heli & Ambulances"
          icon={UsersIcon}
          trend="48 Mesh Nodes"
          color="cyan"
          onClick={() => setActiveTab('routes')}
        />
      </div>

      {/* 2. Unified Executive Incident Command Strip (One-Line Risk Summary) */}
      <div className="card-glass command-threat-strip">
        <div className="threat-strip-left">
          <div className="threat-score-box">
            <span className="threat-score-num">{scenario.riskScore}</span>
            <span className="threat-score-denom">/100</span>
          </div>
          <div className="threat-severity-tag">
            <span className="threat-pulse-dot"></span>
            <span>{scenario.severity}</span>
          </div>
        </div>

        <div className="threat-strip-center">
          <div className="threat-headline-row">
            <span className="threat-level-highlight">{scenario.threatLevel}</span>
            <span className="threat-divider">•</span>
            <span className="threat-status-highlight">{scenario.status}</span>
            <span className="threat-divider">•</span>
            <span className="threat-urgency-highlight">{scenario.evacuationUrgency}</span>
          </div>
          <div className="threat-subline-row">
            <span><strong>Target Sector:</strong> {scenario.impactZone}</span>
            <span className="threat-sub-dot">•</span>
            <span><strong>Population at Risk:</strong> {scenario.populationAtRisk}</span>
            <span className="threat-sub-dot">•</span>
            <span><strong>Primary Hazard:</strong> {scenario.keyHazard}</span>
          </div>
        </div>

        <div className="threat-strip-right">
          <button className="btn-open-gis-map" onClick={() => setActiveTab('map')}>
            <MapIcon className="w-4 h-4" />
            <span>OPEN RISK MAP & GIS RADAR</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Symmetrical 2-Column Command Grid: AI Triage Queue + Resource Allocation */}
      <div className="grid-dashboard">
        {/* Left Column: AI Triage Queue Card */}
        <div className="card-glass triage-card">
          <div className="card-header">
            <div className="card-header-title">
              <div className="header-icon-badge cyan">
                <SparklesIcon className="w-4 h-4 text-cyan" />
              </div>
              <span>AI TRIAGE QUEUE</span>
            </div>

            <div className="triage-filter-tabs">
              {['ALL', 'CRITICAL', 'HIGH'].map((tab) => (
                <button
                  key={tab}
                  className={`triage-filter-btn ${triageFilter === tab ? 'active' : ''}`}
                  onClick={() => setTriageFilter(tab)}
                >
                  {tab}
                  {tab === 'ALL' && ` (${triageQueue.length})`}
                  {tab === 'CRITICAL' && ` (${triageQueue.filter((i) => i.urgency === 'CRITICAL').length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body triage-card-body">
            <div className="triage-list">
              {loadingData ? (
                <div className="triage-empty">Loading prioritized distress queue...</div>
              ) : filteredTriage.length === 0 ? (
                <div className="triage-empty">No incoming requests in this category.</div>
              ) : (
                filteredTriage.map((req) => {
                  const badge = getUrgencyBadgeStyle(req.urgency);
                  return (
                    <div key={req.id} className={`triage-item urgency-${req.urgency.toLowerCase()}`}>
                      <div className="triage-item-main">
                        <div className="triage-item-line1">
                          <span
                            className="triage-badge"
                            style={{
                              backgroundColor: badge.bg,
                              borderColor: badge.border,
                              color: badge.text
                            }}
                          >
                            {req.urgency}
                          </span>
                          <span className="triage-req-id">#{req.id}</span>
                          <strong className="triage-type-label">{req.type}</strong>
                          <span className="triage-time-tag">
                            <ClockIcon className="w-3 h-3" />
                            {req.timestamp}
                          </span>
                        </div>

                        <div className="triage-item-line2">
                          <div className="triage-loc-block">
                            <MapPinIcon className="w-3.5 h-3.5 text-cyan shrink-0" />
                            <span>{req.location}</span>
                            <span className="triage-people-pill">
                              {req.peopleCount} {req.peopleCount > 1 ? 'people' : 'person'}
                            </span>
                          </div>
                          <div className="triage-dispatch-info">
                            <span>{req.assignedUnit}</span>
                            <span className="eta-tag">ETA: {req.eta}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="triage-card-footer">
              <div className="triage-footer-note">
                <RadioIcon className="w-3.5 h-3.5 text-cyan" />
                <span>LoRa Mesh Triangulated ({triageQueue.length} Signals)</span>
              </div>
              <button className="btn-manage-sos" onClick={() => setActiveTab('sos')}>
                <span>View all in SOS Center ({triageQueue.length})</span>
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Resource Allocation & Fleet Readiness Card */}
        <div className="card-glass resources-card">
          <div className="card-header">
            <div className="card-header-title">
              <div className="header-icon-badge success">
                <LayersIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <span>RESOURCE ALLOCATION & FLEET</span>
            </div>
            <div className="fleet-status-pill">
              <span className="pulse-fleet-dot"></span>
              <span>MESH SYNCED</span>
            </div>
          </div>

          <div className="card-body resources-card-body">
            {/* Resource 4-Grid Cards */}
            <div className="resources-grid">
              {resources.map((res) => {
                const pct = Math.round((res.deployed / res.total) * 100);
                return (
                  <div key={res.id} className="resource-tile">
                    <div className="res-tile-top">
                      <div className="res-tile-type-row">
                        <div className="res-tile-icon-wrap">
                          {getResourceIcon(res.icon)}
                        </div>
                        <span className="res-type-name">{res.type}</span>
                      </div>
                      <div className="res-tile-numbers">
                        <span className="res-deployed-num">{res.deployed}</span>
                        <span className="res-total-num">/{res.total}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="res-progress-track">
                      <div
                        className={`res-progress-fill ${res.color}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <div className="res-tile-footer">
                      <span className="res-avail-tag">
                        <strong>{res.available}</strong> Available
                      </span>
                      <span className="res-pct-text">{pct}% Active</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Resource Health Bar */}
            <div className="resource-fleet-banner">
              <div className="fleet-banner-left">
                <ShieldIcon className="w-4 h-4 text-cyan" />
                <span>Fleet Readiness: <strong>76% Mobilized</strong> • 0 Deficits</span>
              </div>
              <button className="fleet-action-link" onClick={() => setActiveTab('map')}>
                <span>Inspect Fleet</span>
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Module Previews & Navigation Bar */}
      <div className="dashboard-quick-links">
        <div className="quick-link-tile" onClick={() => setActiveTab('map')}>
          <div className="quick-tile-icon cyan">
            <MapIcon className="w-3.5 h-3.5" />
          </div>
          <div className="quick-tile-info">
            <span className="quick-tile-title">RISK MAP & RADAR</span>
            <span className="quick-tile-sub">Live Doppler & Threat GIS</span>
          </div>
          <ChevronRightIcon className="w-3 h-3 quick-tile-arrow" />
        </div>

        <div className="quick-link-tile" onClick={() => setActiveTab('routes')}>
          <div className="quick-tile-icon emerald">
            <RouteIcon className="w-3.5 h-3.5" />
          </div>
          <div className="quick-tile-info">
            <span className="quick-tile-title">SAFE ROUTES</span>
            <span className="quick-tile-sub">Corridor Alpha (96% Safe)</span>
          </div>
          <ChevronRightIcon className="w-3 h-3 quick-tile-arrow" />
        </div>

        <div className="quick-link-tile" onClick={() => setActiveTab('shelters')}>
          <div className="quick-tile-icon success">
            <ShelterIcon className="w-3.5 h-3.5" />
          </div>
          <div className="quick-tile-info">
            <span className="quick-tile-title">SHELTERS DIRECTORY</span>
            <span className="quick-tile-sub">{totalOpenBeds} Beds Available</span>
          </div>
          <ChevronRightIcon className="w-3 h-3 quick-tile-arrow" />
        </div>

        <div className="quick-link-tile" onClick={() => setActiveTab('alerts')}>
          <div className="quick-tile-icon warning">
            <BellIcon className="w-3.5 h-3.5" />
          </div>
          <div className="quick-tile-info">
            <span className="quick-tile-title">EMERGENCY ALERTS</span>
            <span className="quick-tile-sub">{criticalAlertsCount} Critical Broadcasts</span>
          </div>
          <ChevronRightIcon className="w-3 h-3 quick-tile-arrow" />
        </div>
      </div>

      <style>{`
        .dashboard-clean-view {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }

        /* Unified Threat Strip with High Visual Hierarchy */
        .command-threat-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1.15rem;
          background: #090e1a;
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-left: 4px solid var(--danger);
          border-radius: var(--radius-md);
          gap: 1rem;
          flex-wrap: nowrap;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.45);
        }

        .threat-strip-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }

        .threat-score-box {
          display: flex;
          align-items: baseline;
          background: rgba(239, 68, 68, 0.16);
          border: 1px solid rgba(239, 68, 68, 0.45);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
        }

        .threat-score-num {
          font-size: 1.55rem;
          font-weight: 900;
          color: #ef4444;
          font-family: var(--font-mono);
          line-height: 1;
        }

        .threat-score-denom {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94a3b8;
          margin-left: 2px;
        }

        .threat-severity-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          font-weight: 800;
          background: rgba(239, 68, 68, 0.25);
          border: 1px solid var(--danger);
          color: #ffffff;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .threat-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--danger);
          box-shadow: 0 0 8px var(--danger);
          animation: blink 1.2s infinite;
        }

        .threat-strip-center {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          flex: 1;
          min-width: 0;
        }

        .threat-headline-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: nowrap;
          overflow: hidden;
        }

        .threat-level-highlight {
          font-size: 0.85rem;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
        }

        .threat-status-highlight {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.08rem 0.45rem;
          border-radius: 4px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .threat-urgency-highlight {
          font-size: 0.72rem;
          font-weight: 700;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .threat-divider {
          color: #475569;
          font-size: 0.7rem;
        }

        .threat-subline-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.66rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .threat-subline-row strong {
          color: #cbd5e1;
        }

        .threat-sub-dot {
          color: #475569;
        }

        .threat-strip-right {
          flex-shrink: 0;
        }

        .btn-open-gis-map {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.12) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 800;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-open-gis-map:hover {
          background: var(--cyan);
          color: #050810;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.5);
          transform: translateY(-1px);
        }

        @media (max-width: 960px) {
          .command-threat-strip {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* 2-Column Command Grid */
        .triage-card,
        .resources-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .triage-card-body,
        .resources-card-body {
          padding: 0.65rem 0.95rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          gap: 0.55rem;
        }

        .triage-filter-tabs {
          display: flex;
          gap: 0.25rem;
          background: #060913;
          padding: 2px;
          border-radius: 5px;
          border: 1px solid var(--border-subtle);
        }

        .triage-filter-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.60rem;
          font-weight: 800;
          padding: 0.18rem 0.45rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .triage-filter-btn.active {
          background: rgba(6, 182, 212, 0.25);
          color: var(--cyan);
          border: 1px solid rgba(6, 182, 212, 0.4);
        }

        .triage-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .triage-empty {
          font-size: 0.72rem;
          color: var(--text-muted);
          padding: 0.85rem;
          text-align: center;
        }

        .triage-item {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .triage-item.urgency-critical {
          border-left: 3px solid var(--danger);
        }

        .triage-item.urgency-high {
          border-left: 3px solid var(--warning);
        }

        .triage-item.urgency-medium {
          border-left: 3px solid var(--cyan);
        }

        .triage-item:hover {
          border-color: rgba(6, 182, 212, 0.4);
          background: #0a1020;
        }

        .triage-item-main {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .triage-item-line1 {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
        }

        .triage-badge {
          font-size: 0.58rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
          border: 1px solid;
          flex-shrink: 0;
        }

        .triage-req-id {
          font-size: 0.65rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .triage-type-label {
          font-size: 0.74rem;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .triage-time-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.60rem;
          color: var(--text-muted);
          flex-shrink: 0;
          margin-left: auto;
        }

        .triage-item-line2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.65rem;
          color: #94a3b8;
          gap: 0.5rem;
        }

        .triage-loc-block {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .triage-people-pill {
          font-size: 0.58rem;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.08rem 0.35rem;
          border-radius: 3px;
          color: #cbd5e1;
          flex-shrink: 0;
        }

        .triage-dispatch-info {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--cyan);
          font-weight: 700;
          font-size: 0.64rem;
          flex-shrink: 0;
        }

        .eta-tag {
          color: #fcd34d;
        }

        .triage-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.45rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.65rem;
        }

        .triage-footer-note {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
        }

        .btn-manage-sos {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-size: 0.68rem;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-manage-sos:hover {
          text-decoration: underline;
        }

        /* Resource Allocation Card */
        .fleet-status-pill {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-size: 0.58rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
        }

        .pulse-fleet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .resource-tile {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          transition: border-color 0.2s ease;
        }

        .resource-tile:hover {
          border-color: rgba(6, 182, 212, 0.3);
        }

        .res-tile-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .res-tile-type-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          min-width: 0;
        }

        .res-tile-icon-wrap {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .res-type-name {
          font-size: 0.72rem;
          font-weight: 700;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .res-tile-numbers {
          display: flex;
          align-items: baseline;
          font-family: var(--font-mono);
          flex-shrink: 0;
        }

        .res-deployed-num {
          font-size: 1.15rem;
          font-weight: 900;
          color: #ffffff;
        }

        .res-total-num {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
        }

        .res-progress-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 9999px;
          overflow: hidden;
        }

        .res-progress-fill {
          height: 100%;
          border-radius: 9999px;
        }

        .res-progress-fill.danger {
          background: #ef4444;
        }

        .res-progress-fill.cyan {
          background: #06b6d4;
        }

        .res-progress-fill.success {
          background: #10b981;
        }

        .res-progress-fill.warning {
          background: #f59e0b;
        }

        .res-tile-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.60rem;
          color: var(--text-muted);
        }

        .res-avail-tag strong {
          color: #34d399;
        }

        .res-pct-text {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--text-secondary);
        }

        .resource-fleet-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.38rem 0.65rem;
          background: rgba(6, 182, 212, 0.06);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 5px;
          font-size: 0.65rem;
          color: #cbd5e1;
        }

        .fleet-banner-left {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .fleet-banner-left strong {
          color: var(--cyan);
        }

        .fleet-action-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-size: 0.64rem;
          font-weight: 800;
          cursor: pointer;
        }

        .fleet-action-link:hover {
          text-decoration: underline;
        }

        /* 4. Quick Module Previews & Navigation Bar */
        .dashboard-quick-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.65rem;
          width: 100%;
        }

        .quick-link-tile {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #0d1424;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .quick-link-tile:hover {
          transform: translateY(-2px);
          border-color: rgba(6, 182, 212, 0.4);
          background: #111a30;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }

        .quick-tile-icon {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-tile-icon.cyan { background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.35); color: var(--cyan); }
        .quick-tile-icon.emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399; }
        .quick-tile-icon.success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399; }
        .quick-tile-icon.warning { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: var(--warning); }

        .quick-tile-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .quick-tile-title {
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quick-tile-sub {
          font-size: 0.58rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quick-tile-arrow {
          color: #64748b;
          flex-shrink: 0;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .quick-link-tile:hover .quick-tile-arrow {
          color: var(--cyan);
          transform: translateX(2px);
        }

        @media (max-width: 960px) {
          .dashboard-quick-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .dashboard-quick-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
