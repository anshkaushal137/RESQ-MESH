import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { ShelterIcon, MapPinIcon, NavigationIcon, PhoneCallIcon, ChevronRightIcon, CheckIcon, ShieldIcon } from './Icons';
import { CircularGauge } from './Gauges';

export const SheltersSection = ({ limit = null, showViewAll = true, compact = false }) => {
  const { shelters, setActiveTab } = useDisaster();
  const [navigatingShelter, setNavigatingShelter] = useState(null);

  const displayedShelters = limit ? shelters.slice(0, limit) : shelters;
  const isCompact = compact || limit !== null;

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacityTotal, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.capacityOccupied, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const totalOpenBeds = shelters.reduce((acc, s) => acc + s.bedsAvailable, 0);

  const handleStartNav = (shelter) => {
    setNavigatingShelter(shelter.id);
    setTimeout(() => {
      setActiveTab('routes');
    }, 400);
  };

  return (
    <div className={`card-glass accent-success shelters-section ${isCompact ? 'is-compact' : ''}`}>
      <div className="card-header">
        <div className="card-header-title">
          <div className="header-icon-badge success">
            <ShelterIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <span>OPERATIONAL EMERGENCY SHELTERS</span>
        </div>
        {showViewAll && (
          <button className="view-all-btn" onClick={() => setActiveTab('shelters')}>
            <span>Directory ({shelters.length})</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="card-body">
        {/* Network Shelter System Capacity Summary */}
        <div className="shelter-system-bar">
          <div className="system-gauge-left">
            <CircularGauge
              value={overallOccupancy}
              size={isCompact ? 30 : 44}
              strokeWidth={isCompact ? 3.2 : 4.5}
              color={overallOccupancy > 85 ? 'var(--warning)' : '#10b981'}
              label={`${overallOccupancy}%`}
            />
            <div className="system-meta-text">
              <span className="system-title">SYSTEMWIDE SHELTER LOAD</span>
              <span className="system-sub">
                <strong>{totalOpenBeds}</strong> beds open • {shelters.filter((s) => !s.status.includes('CLOSED')).length} active facilities
              </span>
            </div>
          </div>
          <div className="system-badge-pill">
            <ShieldIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>HIGH-GROUND CLEAR</span>
          </div>
        </div>

        {/* Shelters Grid */}
        <div className="shelters-grid">
          {displayedShelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.capacityOccupied / shelter.capacityTotal) * 100);
            const isClosed = shelter.status.includes('CLOSED');
            return (
              <div key={shelter.id} className={`shelter-card ${isClosed ? 'is-closed' : ''}`}>
                <div className="shelter-top">
                  <div className="shelter-title-block">
                    <span className="shelter-type">{shelter.type}</span>
                    <h4 className="shelter-name">{shelter.name}</h4>
                  </div>
                  <span
                    className="shelter-status-badge"
                    style={{
                      color: shelter.statusColor,
                      backgroundColor: `${shelter.statusColor}18`,
                      borderColor: `${shelter.statusColor}40`
                    }}
                  >
                    {shelter.status}
                  </span>
                </div>

                {/* Location row */}
                <div className="shelter-loc-row">
                  <div className="loc-badge-icon" title="Verified Safe Shelter Location">
                    <MapPinIcon className="w-3.5 h-3.5 text-cyan" />
                  </div>
                  <div className="shelter-loc-details">
                    <div className="loc-pill">
                      <span className="loc-dist">{shelter.distance}</span>
                      <span className="loc-sep">•</span>
                      <span className="loc-elev">Elev: {shelter.elevation}</span>
                    </div>
                    <div className="shelter-address" title={shelter.address}>{shelter.address}</div>
                  </div>
                </div>

                {/* Capacity Circular Progress Meter */}
                {!isClosed ? (
                  <div className="shelter-gauge-container">
                    <CircularGauge
                      value={occupancyPct}
                      size={isCompact ? 32 : 42}
                      strokeWidth={3.5}
                      color={occupancyPct > 85 ? 'var(--warning)' : '#10b981'}
                      label={`${occupancyPct}%`}
                    />

                    <div className="shelter-gauge-info">
                      <div className="gauge-status-line">
                        <span className="gauge-title">BED OCCUPANCY</span>
                        <span
                          className="gauge-tag"
                          style={{ color: occupancyPct > 85 ? 'var(--warning)' : '#34d399' }}
                        >
                          {occupancyPct > 85 ? 'NEAR CAPACITY' : 'ACCEPTING EVACUEES'}
                        </span>
                      </div>
                      <div className="gauge-sub-line">
                        <span className="cap-beds-highlight"><strong>{shelter.bedsAvailable}</strong> beds open</span>
                        <span className="gauge-sep">•</span>
                        <span className="cap-total-text">{shelter.capacityOccupied}/{shelter.capacityTotal} occupied</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="closed-warning">
                    ⚠️ ZONE FLOODED — REROUTED TO CIVIC CENTER
                  </div>
                )}

                {/* Amenities Badges only when not compact */}
                {!isCompact && (
                  <div className="amenities-wrap">
                    {shelter.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-pill">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions Bar */}
                <div className="shelter-actions">
                  {!isClosed ? (
                    <button
                      className="btn-navigate"
                      onClick={() => handleStartNav(shelter)}
                    >
                      <NavigationIcon className="w-3.5 h-3.5" />
                      <span>Navigate via Safe Corridor</span>
                    </button>
                  ) : (
                    <div className="closed-strip">DO NOT APPROACH</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .shelters-section {
          min-width: 0;
          width: 100%;
        }

        .shelters-section.is-compact .card-header {
          padding: 0.75rem 1.15rem;
        }

        .shelters-section.is-compact .card-body {
          padding: 0.75rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .shelters-section.is-compact .shelter-system-bar {
          padding: 0.45rem 0.75rem;
          margin-bottom: 0.35rem;
        }

        .shelters-section.is-compact .shelters-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.55rem;
        }

        .shelters-section.is-compact .shelter-card {
          padding: 0.65rem 0.85rem;
          gap: 0.45rem;
        }

        .shelters-section.is-compact .shelter-name {
          font-size: 0.78rem;
          font-weight: 800;
        }

        .shelters-section.is-compact .shelter-status-badge {
          font-size: 0.60rem;
          font-weight: 800;
          padding: 0.12rem 0.4rem;
        }

        .shelters-section.is-compact .shelter-gauge-container {
          padding: 0.35rem 0.55rem;
          gap: 0.55rem;
        }

        .shelters-section.is-compact .btn-navigate {
          padding: 0.45rem 0.85rem;
          font-size: 0.72rem;
          font-weight: 800;
        }


        .shelter-system-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.22);
          border-radius: var(--radius-md);
          padding: 0.55rem 0.85rem;
          margin-bottom: 0.85rem;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .system-gauge-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .system-meta-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          min-width: 0;
        }

        .system-title {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #34d399;
          text-transform: uppercase;
        }

        .system-sub {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .system-sub strong {
          color: #ffffff;
        }

        .system-badge-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.62rem;
          font-weight: 800;
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .view-all-btn:hover {
          text-decoration: underline;
        }

        .shelters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 0.85rem;
          min-width: 0;
          width: 100%;
        }

        .shelter-card {
          background: #080d19;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          min-width: 0;
          width: 100%;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .shelter-card:hover {
          border-color: rgba(16, 185, 129, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px -2px rgba(16, 185, 129, 0.12);
        }

        .shelter-card.is-closed {
          opacity: 0.65;
          border-color: rgba(239, 68, 68, 0.25);
        }

        .shelter-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.4rem;
          min-width: 0;
        }

        .shelter-title-block {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .shelter-type {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--cyan);
          display: block;
        }

        .shelter-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 0.12rem;
          line-height: 1.25;
          overflow-wrap: break-word;
        }

        .shelter-status-badge {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid;
          line-height: 1.2;
          max-width: 100%;
          text-align: center;
          flex-shrink: 0;
        }

        .shelter-loc-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: #050812;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.42rem 0.65rem;
          min-width: 0;
        }

        .loc-badge-icon {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .shelter-loc-details {
          display: flex;
          flex-direction: column;
          gap: 0.12rem;
          min-width: 0;
          flex: 1;
        }

        .loc-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          font-weight: 600;
          color: #94a3b8;
          min-width: 0;
          flex-wrap: wrap;
        }

        .loc-dist {
          color: #f1f5f9;
          font-weight: 700;
        }

        .loc-sep {
          color: var(--text-dim);
        }

        .loc-elev {
          color: #38bdf8;
          font-family: var(--font-mono);
          font-size: 0.64rem;
        }

        .shelter-address {
          font-size: 0.67rem;
          color: var(--text-muted);
          overflow-wrap: break-word;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .shelter-gauge-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #050812;
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          min-width: 0;
        }

        .shelter-gauge-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
          flex: 1;
        }

        .gauge-status-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .gauge-title {
          color: #64748b;
        }

        .gauge-tag {
          font-family: var(--font-mono);
        }

        .gauge-sub-line {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.66rem;
          color: var(--text-secondary);
        }

        .cap-beds-highlight strong {
          color: var(--success);
          font-family: var(--font-mono);
        }

        .gauge-sep {
          color: var(--text-dim);
        }

        .cap-total-text {
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.62rem;
        }

        .amenities-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.28rem;
          min-width: 0;
        }

        .amenity-pill {
          font-size: 0.6rem;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.12rem 0.4rem;
          border-radius: 4px;
          line-height: 1.25;
        }

        .shelter-actions {
          margin-top: auto;
          padding-top: 0.2rem;
          min-width: 0;
        }

        .btn-navigate {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.45rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-navigate:hover {
          background: #10b981;
          color: #080c16;
          box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);
        }

        .closed-warning {
          text-align: center;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--danger);
          padding: 0.4rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 4px;
        }

        .closed-strip {
          text-align: center;
          font-size: 0.62rem;
          font-weight: 800;
          color: #f87171;
          padding: 0.35rem;
          background: rgba(239, 68, 68, 0.08);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
export default SheltersSection;
