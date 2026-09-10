import { useState, useEffect } from 'react';
import {
  XIcon,
  ShieldIcon,
  RadioIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  AmbulanceIcon,
  BoatIcon,
  PackageIcon,
  HeartPulseIcon,
  ChevronRightIcon,
  CheckIcon,
  LayersIcon,
  SparklesIcon
} from './Icons';

export const ResourceDetailModal = ({
  isOpen,
  resource,
  allResources = [],
  mode = 'SINGLE', // 'SINGLE' | 'FLEET'
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('ALL');

  // Sync active tab when modal opens or resource changes
  useEffect(() => {
    if (mode === 'SINGLE' && resource) {
      setActiveTab(resource.id);
    } else {
      setActiveTab('ALL');
    }
  }, [isOpen, resource, mode]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getResourceIcon = (iconName, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'AmbulanceIcon':
        return <AmbulanceIcon className={`${className} text-rose-400`} />;
      case 'BoatIcon':
        return <BoatIcon className={`${className} text-cyan`} />;
      case 'UsersIcon':
        return <UsersIcon className={`${className} text-emerald-400`} />;
      case 'PackageIcon':
        return <PackageIcon className={`${className} text-amber-400`} />;
      default:
        return <HeartPulseIcon className={`${className} text-cyan`} />;
    }
  };

  const getUnitStatusStyle = (statusType) => {
    switch (statusType) {
      case 'deployed':
        return {
          bg: 'rgba(239, 68, 68, 0.16)',
          border: 'rgba(239, 68, 68, 0.45)',
          text: '#fca5a5',
          dot: '#ef4444'
        };
      case 'enroute':
        return {
          bg: 'rgba(245, 158, 11, 0.18)',
          border: 'rgba(245, 158, 11, 0.5)',
          text: '#fcd34d',
          dot: '#f59e0b'
        };
      case 'available':
        return {
          bg: 'rgba(16, 185, 129, 0.16)',
          border: 'rgba(16, 185, 129, 0.45)',
          text: '#34d399',
          dot: '#10b981'
        };
      default:
        return {
          bg: 'rgba(6, 182, 212, 0.15)',
          border: 'rgba(6, 182, 212, 0.4)',
          text: '#67e8f9',
          dot: '#06b6d4'
        };
    }
  };

  // Determine which resources to display
  const isFleetMode = mode === 'FLEET';
  const currentResource = isFleetMode
    ? (activeTab === 'ALL' ? null : allResources.find((r) => r.id === activeTab))
    : (resource || allResources[0]);

  // Aggregated units for fleet view or single resource
  const displayedUnits = isFleetMode
    ? (activeTab === 'ALL'
        ? allResources.flatMap((r) => (r.units || []).map((u) => ({ ...u, resourceType: r.type, resourceIcon: r.icon })))
        : (currentResource?.units || []).map((u) => ({ ...u, resourceType: currentResource.type, resourceIcon: currentResource.icon })))
    : (currentResource?.units || []);

  const totalFleetUnits = allResources.reduce((acc, r) => acc + r.total, 0);
  const deployedFleetUnits = allResources.reduce((acc, r) => acc + r.deployed, 0);
  const availableFleetUnits = allResources.reduce((acc, r) => acc + r.available, 0);
  const overallMobilizedPct = totalFleetUnits > 0 ? Math.round((deployedFleetUnits / totalFleetUnits) * 100) : 76;

  return (
    <div className="res-modal-overlay" onClick={onClose}>
      <div
        className="res-modal card-glass"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="res-modal-header">
          <div className="res-modal-header-left">
            <div className={`res-modal-icon-badge ${currentResource?.color || 'cyan'}`}>
              {isFleetMode
                ? <LayersIcon className="w-5 h-5 text-cyan" />
                : getResourceIcon(currentResource?.icon, 'w-5 h-5')}
            </div>
            <div>
              <div className="res-modal-title-row">
                <h3 className="res-modal-title">
                  {isFleetMode ? 'FLEET & RESOURCE INSPECTION' : `${currentResource?.type.toUpperCase()} TELEMETRY`}
                </h3>
                {isFleetMode ? (
                  <span className="res-mesh-pill">
                    <span className="pulse-dot-green"></span>
                    MESH SYNCED (48 NODES)
                  </span>
                ) : (
                  <span className={`res-status-tag ${currentResource?.color || 'cyan'}`}>
                    {currentResource?.status || 'Active'}
                  </span>
                )}
              </div>
              <span className="res-modal-subtitle">
                {isFleetMode
                  ? 'Real-time telemetry, readiness scoring, and squad deployments across all active sectors'
                  : currentResource?.description || 'Real-time asset telemetry and sector assignment breakdown'}
              </span>
            </div>
          </div>

          <button
            className="res-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            title="Dismiss modal (Esc)"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="res-modal-body">
          {/* Top Summary Bar */}
          {isFleetMode ? (
            <div className="fleet-summary-strip">
              <div className="fleet-stat-box highlight">
                <span className="fleet-stat-label">FLEET READINESS</span>
                <div className="fleet-stat-val">
                  <span className="num-huge cyan">{overallMobilizedPct}%</span>
                  <span className="sub-tag">Mobilized</span>
                </div>
              </div>
              <div className="fleet-stat-box">
                <span className="fleet-stat-label">DEPLOYED / ACTIVE</span>
                <div className="fleet-stat-val">
                  <span className="num-huge danger">{deployedFleetUnits}</span>
                  <span className="sub-tag">In Field</span>
                </div>
              </div>
              <div className="fleet-stat-box">
                <span className="fleet-stat-label">STANDBY / READY</span>
                <div className="fleet-stat-val">
                  <span className="num-huge success">{availableFleetUnits}</span>
                  <span className="sub-tag">Available</span>
                </div>
              </div>
              <div className="fleet-stat-box">
                <span className="fleet-stat-label">TOTAL ASSETS</span>
                <div className="fleet-stat-val">
                  <span className="num-huge">{totalFleetUnits}</span>
                  <span className="sub-tag">4 Classes</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="single-resource-stats-grid">
              <div className="single-stat-card">
                <span className="stat-label">ACTIVE / DEPLOYED</span>
                <div className="stat-val-group">
                  <span className="stat-num text-danger">{currentResource?.deployed}</span>
                  <span className="stat-denom">/ {currentResource?.total} {currentResource?.unit}</span>
                </div>
                <span className="stat-sub">
                  {Math.round(((currentResource?.deployed || 0) / (currentResource?.total || 1)) * 100)}% Mobilized
                </span>
              </div>

              <div className="single-stat-card">
                <span className="stat-label">AVAILABLE STANDBY</span>
                <div className="stat-val-group">
                  <span className="stat-num text-success">{currentResource?.available}</span>
                  <span className="stat-denom">{currentResource?.unit} ready</span>
                </div>
                <span className="stat-sub">Instant Dispatch Ready</span>
              </div>

              <div className="single-stat-card">
                <span className="stat-label">PRIMARY SECTORS</span>
                <div className="stat-val-group">
                  <span className="stat-text-loc">{currentResource?.sectors}</span>
                </div>
                <span className="stat-sub">LoRa GIS Mesh Active</span>
              </div>
            </div>
          )}

          {/* Category Filter Tabs (Fleet Mode) */}
          {isFleetMode && (
            <div className="fleet-tabs-bar">
              <button
                className={`fleet-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveTab('ALL')}
              >
                All Resources ({totalFleetUnits})
              </button>
              {allResources.map((res) => (
                <button
                  key={res.id}
                  className={`fleet-tab-btn ${activeTab === res.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(res.id)}
                >
                  {res.type} ({res.deployed}/{res.total})
                </button>
              ))}
            </div>
          )}

          {/* Unit Breakdown Section Header */}
          <div className="units-section-header">
            <div className="units-hdr-left">
              <ShieldIcon className="w-4 h-4 text-cyan" />
              <span>INDIVIDUAL UNIT DEPLOYMENT BREAKDOWN ({displayedUnits.length} UNITS TRACKED)</span>
            </div>
            <div className="units-hdr-right">
              <RadioIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-time GPS / Telemetry Lock</span>
            </div>
          </div>

          {/* Units List */}
          <div className="units-list-scroll">
            {displayedUnits.length === 0 ? (
              <div className="units-empty">No units currently assigned to this category.</div>
            ) : (
              displayedUnits.map((unit) => {
                const badge = getUnitStatusStyle(unit.statusType);
                return (
                  <div key={unit.id} className="unit-card">
                    <div className="unit-card-line1">
                      <div className="unit-title-group">
                        <span
                          className="unit-status-badge"
                          style={{
                            backgroundColor: badge.bg,
                            borderColor: badge.border,
                            color: badge.text
                          }}
                        >
                          <span
                            className="unit-pulse-dot"
                            style={{ backgroundColor: badge.dot }}
                          ></span>
                          {unit.status}
                        </span>
                        <span className="unit-id-tag">#{unit.id}</span>
                        <strong className="unit-name">{unit.name}</strong>
                      </div>

                      <div className="unit-eta-group">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="unit-eta-text">{unit.eta}</span>
                      </div>
                    </div>

                    <div className="unit-card-line2">
                      <div className="unit-location-item">
                        <MapPinIcon className="w-3.5 h-3.5 text-cyan shrink-0" />
                        <span><strong>Location:</strong> {unit.location}</span>
                      </div>

                      <div className="unit-mission-item">
                        <span><strong>Mission:</strong> {unit.mission}</span>
                      </div>
                    </div>

                    <div className="unit-card-line3">
                      <div className="unit-crew-tag">
                        <UsersIcon className="w-3 h-3 text-slate-400" />
                        <span>{unit.crew}</span>
                      </div>
                      <div className="unit-channel-tag">
                        <RadioIcon className="w-3 h-3 text-cyan" />
                        <span>{unit.channel}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="res-modal-footer">
          <div className="res-footer-left">
            <RadioIcon className="w-4 h-4 text-cyan" />
            <span>LoRa Mesh Relays: <strong>48 Active Nodes</strong> • Latency: <strong>&lt;180ms</strong></span>
          </div>

          <div className="res-footer-actions">
            <button className="btn-res-done" onClick={onClose}>
              <CheckIcon className="w-4 h-4" />
              <span>Done / Close</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .res-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 15, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.25rem;
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .res-modal {
          width: 100%;
          max-width: 680px;
          max-height: 88vh;
          background: #0d1424;
          border: 1px solid rgba(6, 182, 212, 0.35);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 36px -4px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: modal-slide 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modal-slide {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Header */
        .res-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.45rem;
          background: #090e1a;
          border-bottom: 1px solid var(--border-subtle);
          gap: 1rem;
          flex-shrink: 0;
        }

        .res-modal-header-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          min-width: 0;
        }

        .res-modal-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .res-modal-icon-badge.danger { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); }
        .res-modal-icon-badge.cyan { background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.35); }
        .res-modal-icon-badge.success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); }
        .res-modal-icon-badge.warning { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); }

        .res-modal-title-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .res-modal-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.03em;
          white-space: nowrap;
          margin: 0;
        }

        .res-mesh-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          padding: 0.12rem 0.50rem;
          border-radius: 4px;
        }

        .res-status-tag {
          display: inline-flex;
          align-items: center;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 0.12rem 0.50rem;
          border-radius: 4px;
          border: 1px solid;
        }

        .res-status-tag.danger { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.4); color: #fca5a5; }
        .res-status-tag.cyan { background: rgba(6, 182, 212, 0.15); border-color: rgba(6, 182, 212, 0.4); color: #67e8f9; }
        .res-status-tag.success { background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.4); color: #34d399; }
        .res-status-tag.warning { background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.4); color: #fcd34d; }

        .pulse-dot-green {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }

        .res-modal-subtitle {
          font-size: 0.74rem;
          color: var(--text-secondary);
          display: block;
          margin-top: 2px;
          line-height: 1.35;
        }

        .res-modal-close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .res-modal-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* Body */
        .res-modal-body {
          padding: 1.25rem 1.45rem;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          overflow-y: auto;
          flex: 1;
        }

        /* Fleet Top Strip */
        .fleet-summary-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.65rem;
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
        }

        .fleet-stat-box {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .fleet-stat-box.highlight {
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding-right: 0.5rem;
        }

        .fleet-stat-label {
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #64748b;
        }

        .fleet-stat-val {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .num-huge {
          font-size: 1.40rem;
          font-weight: 900;
          font-family: var(--font-mono);
          color: #ffffff;
          line-height: 1.1;
        }

        .num-huge.cyan { color: var(--cyan); }
        .num-huge.danger { color: #f87171; }
        .num-huge.success { color: #34d399; }

        .sub-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: #94a3b8;
        }

        /* Single Resource Top Grid */
        .single-resource-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .single-stat-card {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.80rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #64748b;
        }

        .stat-val-group {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
        }

        .stat-num {
          font-size: 1.45rem;
          font-weight: 900;
          font-family: var(--font-mono);
          line-height: 1.1;
        }

        .stat-denom {
          font-size: 0.78rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .stat-text-loc {
          font-size: 0.84rem;
          font-weight: 800;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-sub {
          font-size: 0.70rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Fleet Tabs Bar */
        .fleet-tabs-bar {
          display: flex;
          gap: 0.40rem;
          background: #060913;
          padding: 4px;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .fleet-tab-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.74rem;
          font-weight: 800;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .fleet-tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .fleet-tab-btn.active {
          background: rgba(6, 182, 212, 0.22);
          color: var(--cyan);
          border: 1px solid rgba(6, 182, 212, 0.4);
        }

        /* Units Section Header */
        .units-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #94a3b8;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.45rem;
        }

        .units-hdr-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .units-hdr-right {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #34d399;
          font-family: var(--font-mono);
          font-size: 0.68rem;
        }

        /* Units Scrollable List */
        .units-list-scroll {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          max-height: 380px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .units-empty {
          text-align: center;
          padding: 1.5rem;
          color: var(--text-muted);
          font-size: 0.82rem;
        }

        .unit-card {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.40rem;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .unit-card:hover {
          border-color: rgba(6, 182, 212, 0.4);
          background: #0a1122;
        }

        .unit-card-line1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .unit-title-group {
          display: flex;
          align-items: center;
          gap: 0.50rem;
          min-width: 0;
        }

        .unit-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.30rem;
          font-size: 0.64rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 0.12rem 0.45rem;
          border-radius: 3px;
          border: 1px solid;
          flex-shrink: 0;
        }

        .unit-pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .unit-id-tag {
          font-size: 0.74rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .unit-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unit-eta-group {
          display: flex;
          align-items: center;
          gap: 0.30rem;
          font-size: 0.74rem;
          color: #fcd34d;
          font-weight: 700;
          font-family: var(--font-mono);
          flex-shrink: 0;
        }

        .unit-card-line2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #cbd5e1;
          gap: 0.75rem;
        }

        .unit-location-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unit-location-item strong,
        .unit-mission-item strong {
          color: #94a3b8;
        }

        .unit-mission-item {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 0;
          max-width: 45%;
        }

        .unit-card-line3 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #94a3b8;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 0.35rem;
          margin-top: 0.15rem;
        }

        .unit-crew-tag,
        .unit-channel-tag {
          display: flex;
          align-items: center;
          gap: 0.30rem;
        }

        .unit-channel-tag {
          font-family: var(--font-mono);
          color: var(--cyan);
        }

        /* Footer */
        .res-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.45rem;
          background: #080c16;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.76rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .res-footer-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .res-footer-left strong {
          color: #e2e8f0;
        }

        .btn-res-done {
          display: inline-flex;
          align-items: center;
          gap: 0.40rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.12) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.45rem 0.95rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-res-done:hover {
          background: var(--cyan);
          color: #050810;
          box-shadow: 0 0 14px rgba(6, 182, 212, 0.4);
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .fleet-summary-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .single-resource-stats-grid {
            grid-template-columns: 1fr;
          }
          .unit-card-line2 {
            flex-direction: column;
            align-items: flex-start;
          }
          .unit-mission-item {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ResourceDetailModal;
