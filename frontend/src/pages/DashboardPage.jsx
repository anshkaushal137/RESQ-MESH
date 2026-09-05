import React, { useState, useEffect } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { StatCard } from '../components/StatCard';
import { SheltersSection } from '../components/SheltersSection';
import { SafeRouteSection } from '../components/SafeRouteSection';
import {
  AlertTriangleIcon,
  ShelterIcon,
  RouteIcon,
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

  // Filter triage queue
  const filteredTriage = (triageFilter === 'ALL'
    ? triageQueue
    : triageQueue.filter((item) => item.urgency === triageFilter)
  ).slice(0, 3);

  const getUrgencyBadgeStyle = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.22)', border: 'rgba(239, 68, 68, 0.6)', text: '#fca5a5' };
      case 'HIGH':
        return { bg: 'rgba(245, 158, 11, 0.22)', border: 'rgba(245, 158, 11, 0.6)', text: '#fcd34d' };
      case 'MEDIUM':
        return { bg: 'rgba(6, 182, 212, 0.22)', border: 'rgba(6, 182, 212, 0.6)', text: '#67e8f9' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.22)', border: 'rgba(148, 163, 184, 0.4)', text: '#cbd5e1' };
    }
  };

  const getResourceIcon = (iconName) => {
    switch (iconName) {
      case 'AmbulanceIcon':
        return <AmbulanceIcon className="w-3.5 h-3.5 text-rose-400" />;
      case 'BoatIcon':
        return <BoatIcon className="w-3.5 h-3.5 text-cyan" />;
      case 'UsersIcon':
        return <UsersIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'PackageIcon':
        return <PackageIcon className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <HeartPulseIcon className="w-3.5 h-3.5 text-cyan" />;
    }
  };

  return (
    <div className="dashboard-compact-overview">
      {/* Top 4 Operations Stat Counters with Gauges & Ambient Badges */}
      <div className="grid-stats">
        <StatCard
          title="Incident Threat Index"
          value={`${scenario.riskScore}/100`}
          subtext={scenario.threatLevel}
          icon={AlertTriangleIcon}
          trend="LIVE DIAL"
          color="danger"
          gaugeValue={scenario.riskScore}
        />
        <StatCard
          title="Active Alerts"
          value={`${currentAlerts.length} Broadcasts`}
          subtext={`${criticalAlertsCount} Critical Evacuations`}
          icon={ActivityIcon}
          trend="+2 Broadcast"
          color="warning"
        />
        <StatCard
          title="Operational Shelters"
          value={`${openSheltersCount} Open`}
          subtext={`${totalOpenBeds} Beds Available`}
          icon={ShelterIcon}
          trend="Safe Ridge"
          color="success"
          gaugeValue={openBedsPct}
        />
        <StatCard
          title="Response Units Online"
          value={`${scenario.activeResponseUnits} Units`}
          subtext="Boat, Heli & Ambulances"
          icon={UsersIcon}
          trend="48 Mesh Nodes"
          color="cyan"
        />
      </div>

      {/* Unified Incident Command Strip: Prominent Risk Gauge + Quick Map Launcher */}
      <div className="card-glass command-threat-strip">
        <div className="threat-strip-left">
          <div className="threat-score-box">
            <span className="threat-score-num">{scenario.riskScore}</span>
            <span className="threat-score-denom">/100</span>
          </div>
          <div className="threat-severity-tag">
            <span className="threat-pulse-dot"></span>
            <strong>{scenario.severity}</strong>
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
            <span><strong>Target:</strong> {scenario.impactZone}</span>
            <span className="threat-sub-dot">•</span>
            <span><strong>Population at Risk:</strong> {scenario.populationAtRisk}</span>
            <span className="threat-sub-dot">•</span>
            <span><strong>Key Hazard:</strong> {scenario.keyHazard}</span>
          </div>
        </div>

        <div className="threat-strip-right">
          <button className="btn-open-gis-map" onClick={() => setActiveTab('map')}>
            <MapIcon className="w-3.5 h-3.5" />
            <span>OPEN RISK MAP & GIS RADAR</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* High-Density 2-Column Command Grid */}
      <div className="grid-dashboard">
        {/* =========================================================================
            Column 1: AI Triage Queue (Top 3) & Safe Corridors Preview
            ========================================================================= */}
        <div className="dashboard-col">
          {/* AI Triage Queue Card */}
          <div className="card-glass triage-card">
            <div className="triage-card-header">
              <div className="triage-hdr-left">
                <div className="triage-icon-badge">
                  <SparklesIcon className="w-3.5 h-3.5 text-cyan" />
                </div>
                <div>
                  <h3 className="triage-hdr-title">AI TRIAGE QUEUE</h3>
                  <span className="triage-hdr-subtitle">Prioritized Distress Signals</span>
                </div>
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
                            <ClockIcon className="w-2.5 h-2.5" />
                            {req.timestamp}
                          </span>
                        </div>

                        <div className="triage-item-line2">
                          <div className="triage-loc-block">
                            <MapPinIcon className="w-3 h-3 text-cyan shrink-0" />
                            <span>{req.location}</span>
                            <span className="triage-people-pill">{req.peopleCount} {req.peopleCount > 1 ? 'people' : 'person'}</span>
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
                <RadioIcon className="w-3 h-3 text-cyan" />
                <span>LoRa Triangulated • {triageQueue.length} Active Distress Beacons</span>
              </div>
              <button className="btn-manage-sos" onClick={() => setActiveTab('sos')}>
                <span>SOS Center ({triageQueue.length})</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Safe Evacuation Corridors Quick Preview */}
          <SafeRouteSection compact={true} />
        </div>

        {/* =========================================================================
            Column 2: Resource Allocation & Shelter Capacity Preview
            ========================================================================= */}
        <div className="dashboard-col">
          {/* Resource Allocation Card */}
          <div className="card-glass resources-card">
            <div className="resources-card-header">
              <div className="resources-hdr-left">
                <div className="resources-icon-badge">
                  <LayersIcon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="resources-hdr-title">RESOURCE ALLOCATION & FLEET</h3>
                  <span className="resources-hdr-subtitle">Real-Time Deployment & Reserves</span>
                </div>
              </div>
              <div className="fleet-status-pill">
                <span className="pulse-fleet-dot"></span>
                <span>MESH SYNCED</span>
              </div>
            </div>

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

                    {/* Mini Progress Bar */}
                    <div className="res-progress-track">
                      <div
                        className={`res-progress-fill ${res.color}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <div className="res-tile-footer">
                      <span className="res-avail-tag">
                        <strong>{res.available}</strong> Avail
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
                <ShieldIcon className="w-3.5 h-3.5 text-cyan" />
                <span>Mobilization: <strong>76% Active</strong> • 0 Deficits Detected</span>
              </div>
              <button className="fleet-action-link" onClick={() => setActiveTab('map')}>
                <span>Inspect Fleet</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Operational Shelters Compact Preview */}
          <SheltersSection limit={2} compact={true} showViewAll={true} />
        </div>
      </div>

      <style>{`
        .dashboard-compact-overview {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }

        .grid-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.45rem;
          margin-bottom: 0;
          width: 100%;
        }

        @media (max-width: 1100px) {
          .grid-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* Unified Threat Strip */
        .command-threat-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.45rem 0.85rem;
          background: #090e1a;
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-left: 3px solid var(--danger);
          border-radius: var(--radius-sm);
          gap: 0.75rem;
          flex-wrap: nowrap;
        }

        .threat-strip-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-shrink: 0;
        }

        .threat-score-box {
          display: flex;
          align-items: baseline;
          background: rgba(239, 68, 68, 0.16);
          border: 1px solid rgba(239, 68, 68, 0.45);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .threat-score-num {
          font-size: 1.25rem;
          font-weight: 900;
          color: #ef4444;
          font-family: var(--font-mono);
          line-height: 1;
        }

        .threat-score-denom {
          font-size: 0.58rem;
          font-weight: 700;
          color: #94a3b8;
          margin-left: 1px;
        }

        .threat-severity-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.58rem;
          font-weight: 900;
          background: rgba(239, 68, 68, 0.25);
          border: 1px solid var(--danger);
          color: #ffffff;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          letter-spacing: 0.04em;
        }

        .threat-pulse-dot {
          width: 4.5px;
          height: 4.5px;
          border-radius: 50%;
          background: var(--danger);
          box-shadow: 0 0 6px var(--danger);
          animation: blink 1.2s infinite;
        }

        .threat-strip-center {
          display: flex;
          flex-direction: column;
          gap: 0.08rem;
          flex: 1;
          min-width: 0;
        }

        .threat-headline-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: nowrap;
          overflow: hidden;
        }

        .threat-level-highlight {
          font-size: 0.76rem;
          font-weight: 900;
          color: #ffffff;
          white-space: nowrap;
        }

        .threat-status-highlight {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.08rem 0.35rem;
          border-radius: 3px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .threat-urgency-highlight {
          font-size: 0.65rem;
          font-weight: 700;
          color: #cbd5e1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .threat-divider {
          color: #475569;
          font-size: 0.62rem;
        }

        .threat-subline-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.60rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .threat-subline-row strong {
          color: #e2e8f0;
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
          gap: 0.35rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.28) 0%, rgba(6, 182, 212, 0.12) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.35rem 0.75rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-open-gis-map:hover {
          background: var(--cyan);
          color: #050810;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }

        .grid-dashboard {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 0.5rem;
          align-items: start;
          width: 100%;
        }

        @media (max-width: 960px) {
          .grid-dashboard {
            grid-template-columns: 1fr;
          }
          .command-threat-strip {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .dashboard-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 0;
        }

        /* AI Triage Queue Card */
        .triage-card {
          display: flex;
          flex-direction: column;
          padding: 0.55rem 0.75rem;
          gap: 0.45rem;
          border-radius: var(--radius-sm);
        }

        .triage-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.35rem;
        }

        .triage-hdr-left {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .triage-icon-badge {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .triage-hdr-title {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
          line-height: 1.1;
        }

        .triage-hdr-subtitle {
          font-size: 0.56rem;
          color: var(--text-muted);
        }

        .triage-filter-tabs {
          display: flex;
          gap: 0.2rem;
          background: #060913;
          padding: 1px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .triage-filter-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.54rem;
          font-weight: 800;
          padding: 0.15rem 0.35rem;
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
          gap: 0.35rem;
        }

        .triage-empty {
          font-size: 0.64rem;
          color: var(--text-muted);
          padding: 0.6rem;
          text-align: center;
        }

        .triage-item {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.35rem 0.55rem;
          transition: border-color 0.2s ease;
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
        }

        .triage-item-main {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .triage-item-line1 {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          min-width: 0;
        }

        .triage-badge {
          font-size: 0.52rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 0.06rem 0.28rem;
          border-radius: 2px;
          border: 1px solid;
          flex-shrink: 0;
        }

        .triage-req-id {
          font-size: 0.58rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .triage-type-label {
          font-size: 0.68rem;
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
          gap: 0.2rem;
          font-size: 0.54rem;
          color: var(--text-muted);
          flex-shrink: 0;
          margin-left: auto;
        }

        .triage-item-line2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.58rem;
          color: #94a3b8;
          gap: 0.35rem;
        }

        .triage-loc-block {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .triage-people-pill {
          font-size: 0.52rem;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.05rem 0.25rem;
          border-radius: 2px;
          color: #cbd5e1;
          flex-shrink: 0;
        }

        .triage-dispatch-info {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--cyan);
          font-weight: 700;
          flex-shrink: 0;
        }

        .eta-tag {
          color: #fcd34d;
        }

        .triage-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.3rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.58rem;
        }

        .triage-footer-note {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-muted);
        }

        .btn-manage-sos {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-size: 0.62rem;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-manage-sos:hover {
          text-decoration: underline;
        }

        /* Resource Allocation Card */
        .resources-card {
          display: flex;
          flex-direction: column;
          padding: 0.55rem 0.75rem;
          gap: 0.45rem;
          border-radius: var(--radius-sm);
        }

        .resources-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.35rem;
        }

        .resources-hdr-left {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .resources-icon-badge {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .resources-hdr-title {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #ffffff;
          line-height: 1.1;
        }

        .resources-hdr-subtitle {
          font-size: 0.56rem;
          color: var(--text-muted);
        }

        .fleet-status-pill {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-size: 0.52rem;
          font-weight: 800;
          padding: 0.12rem 0.4rem;
          border-radius: 9999px;
        }

        .pulse-fleet-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 4px #10b981;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.35rem;
        }

        .resource-tile {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.4rem 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .res-tile-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .res-tile-type-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          min-width: 0;
        }

        .res-tile-icon-wrap {
          width: 18px;
          height: 18px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .res-type-name {
          font-size: 0.64rem;
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
          font-size: 0.95rem;
          font-weight: 900;
          color: #ffffff;
        }

        .res-total-num {
          font-size: 0.58rem;
          font-weight: 700;
          color: #64748b;
        }

        .res-progress-track {
          width: 100%;
          height: 3.5px;
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
          font-size: 0.54rem;
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
          padding: 0.3rem 0.55rem;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: 4px;
          font-size: 0.58rem;
          color: #cbd5e1;
        }

        .fleet-banner-left {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .fleet-banner-left strong {
          color: var(--cyan);
        }

        .fleet-action-link {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-size: 0.58rem;
          font-weight: 800;
          cursor: pointer;
        }

        .fleet-action-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;


