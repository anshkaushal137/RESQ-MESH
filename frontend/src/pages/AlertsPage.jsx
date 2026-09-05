import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  BellIcon,
  SearchIcon,
  CheckIcon,
  MapPinIcon,
  AlertTriangleIcon,
  ClockIcon,
  RadioIcon,
  ShieldIcon
} from '../components/Icons';

export const AlertsPage = () => {
  const { currentAlerts, acknowledgedAlerts, acknowledgeAlert } = useDisaster();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const categories = ['ALL', 'Evacuation', 'Road Hazard', 'Infrastructure', 'Relief & Supplies'];

  const filteredAlerts = currentAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      selectedPriority === 'ALL' || alert.priority === selectedPriority;

    const matchesType = selectedType === 'ALL' || alert.type === selectedType;

    return matchesSearch && matchesPriority && matchesType;
  });

  const handleAcknowledgeAll = () => {
    filteredAlerts.forEach((a) => acknowledgeAlert(a.id));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedPriority('ALL');
    setSelectedType('ALL');
  };

  const getPriorityCount = (p) => {
    if (p === 'ALL') return currentAlerts.length;
    return currentAlerts.filter((a) => a.priority === p).length;
  };

  const getTypeCount = (cat) => {
    if (cat === 'ALL') return currentAlerts.length;
    return currentAlerts.filter((a) => a.type === cat).length;
  };

  return (
    <div className="alerts-compact-view">
      {/* 1. Slim Compact Header Bar */}
      <div className="alerts-compact-header card-glass">
        <div className="header-left">
          <div className="hdr-icon-wrap">
            <BellIcon className="w-4 h-4 text-danger" />
          </div>
          <div className="hdr-titles">
            <h2 className="hdr-main-title">EMERGENCY BROADCAST ALERTS FEED</h2>
            <span className="hdr-sub-tag">
              {currentAlerts.filter((a) => a.priority === 'CRITICAL').length} Critical • {currentAlerts.length} Total Bulletins
            </span>
          </div>
        </div>

        <div className="header-right">
          <button className="btn-ack-compact" onClick={handleAcknowledgeAll}>
            <CheckIcon className="w-3.5 h-3.5" />
            <span>Acknowledge All Filtered ({filteredAlerts.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Search & Filter Toolbar */}
      <div className="alerts-filter-toolbar card-glass">
        <div className="toolbar-top-row">
          <div className="search-box-compact">
            <SearchIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              className="search-input-compact"
              placeholder="Search by location, keyword, or advisory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear-compact" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          {/* Priority Pills with Dynamic Counts */}
          <div className="filter-group-inline">
            <span className="filter-label-sm">PRIORITY:</span>
            {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY'].map((p) => {
              const count = getPriorityCount(p);
              return (
                <button
                  key={p}
                  className={`filter-pill-sm ${selectedPriority === p ? 'active' : ''} ${
                    p === 'CRITICAL' ? 'crit' : ''
                  }`}
                  onClick={() => setSelectedPriority(p)}
                >
                  <span>{p}</span>
                  <span className="count-tag">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills with Dynamic Counts */}
        <div className="toolbar-bottom-row">
          <span className="filter-label-sm">CATEGORY:</span>
          <div className="category-pills-list">
            {categories.map((cat) => {
              const count = getTypeCount(cat);
              return (
                <button
                  key={cat}
                  className={`filter-pill-sm ${selectedType === cat ? 'active' : ''}`}
                  onClick={() => setSelectedType(cat)}
                >
                  <span>{cat}</span>
                  <span className="count-tag">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Symmetrical 2-Column Grid of Compact Alert Cards (Fits in One Screen) */}
      <div className="alerts-grid-view">
        {filteredAlerts.length === 0 ? (
          <div className="empty-alerts-compact card-glass">
            <div className="empty-icon-box">
              <SearchIcon className="w-6 h-6 text-cyan" />
            </div>
            <h4 className="empty-heading">No alerts match your filters</h4>
            <p className="empty-desc">
              Try adjusting your search query, selecting "ALL" priorities, or clearing category filters.
            </p>
            <button className="btn-reset-compact" onClick={handleResetFilters}>
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isAck = acknowledgedAlerts.includes(alert.id);
            const isCritical = alert.priority === 'CRITICAL';
            const isWarning = alert.priority === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`alert-compact-card card-glass ${
                  isCritical ? 'card-crit' : isWarning ? 'card-warn' : 'card-adv'
                } ${isAck ? 'is-read' : ''}`}
              >
                {/* Header Row: Priority + Metadata + Mark as Read Button */}
                <div className="card-top-row">
                  <div className="meta-left">
                    <span
                      className={`badge ${
                        isCritical
                          ? 'badge-critical'
                          : isWarning
                          ? 'badge-warning'
                          : 'badge-cyan'
                      }`}
                    >
                      {isCritical && <span className="blinking">●</span>}
                      {alert.priority}
                    </span>
                    <span className="compact-type-badge">{alert.type}</span>
                    <span className="compact-time-tag">
                      <ClockIcon className="w-3 h-3 text-slate-400" />
                      <span>{alert.timestamp}</span>
                    </span>
                    {isAck && (
                      <span className="read-status-pill">
                        <CheckIcon className="w-2.5 h-2.5" />
                        <span>READ</span>
                      </span>
                    )}
                  </div>

                  <button
                    className={`ack-btn-compact ${isAck ? 'acked' : ''}`}
                    onClick={() => acknowledgeAlert(alert.id)}
                    title={isAck ? 'Already acknowledged' : 'Mark alert as read'}
                  >
                    <CheckIcon className="w-3 h-3" />
                    <span>{isAck ? 'Acknowledged' : 'Mark as Read'}</span>
                  </button>
                </div>

                {/* Title */}
                <h4 className="card-title-text">{alert.title}</h4>

                {/* Target Area Location with MapPin Icon */}
                <div className="card-location-row">
                  <MapPinIcon className="w-3.5 h-3.5 text-cyan shrink-0" />
                  <span>Target Area: <strong>{alert.location}</strong></span>
                </div>

                {/* Summary */}
                <p className="card-summary-text">{alert.summary}</p>

                {/* Mandatory Protocol Callout */}
                <div className="card-protocol-box">
                  <div className="protocol-hdr">
                    <ShieldIcon className="w-3 h-3 text-cyan" />
                    <span>MANDATORY PROTOCOL:</span>
                  </div>
                  <span className="protocol-body">{alert.actionRequired}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .alerts-compact-view {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }

        /* 1. Header Bar */
        .alerts-compact-header {
          padding: 0.55rem 0.95rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          gap: 0.75rem;
          background: #090e1a;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          min-width: 0;
        }

        .hdr-icon-wrap {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hdr-titles {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .hdr-main-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .hdr-sub-tag {
          font-size: 0.66rem;
          font-weight: 700;
          color: #fca5a5;
          font-family: var(--font-mono);
          white-space: nowrap;
        }

        .btn-ack-compact {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-main);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.3rem 0.65rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-ack-compact:hover {
          background: rgba(16, 185, 129, 0.25);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }

        /* 2. Compact Search & Filter Toolbar */
        .alerts-filter-toolbar {
          padding: 0.55rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          border-radius: var(--radius-md);
          background: #090e1a;
        }

        .toolbar-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-box-compact {
          flex: 1;
          min-width: 220px;
          max-width: 380px;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 5px;
          padding: 0.25rem 0.6rem;
        }

        .search-input-compact {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.74rem;
          outline: none;
        }

        .search-clear-compact {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.68rem;
          cursor: pointer;
        }

        .filter-group-inline {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .toolbar-bottom-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .category-pills-list {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .filter-label-sm {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #64748b;
        }

        .filter-pill-sm {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.64rem;
          font-weight: 700;
          padding: 0.14rem 0.45rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-pill-sm:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .filter-pill-sm.active {
          background: rgba(6, 182, 212, 0.22);
          border-color: var(--cyan);
          color: #ffffff;
        }

        .filter-pill-sm.crit.active {
          background: rgba(239, 68, 68, 0.22);
          border-color: var(--danger);
          color: #ffffff;
        }

        .count-tag {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          opacity: 0.85;
        }

        /* 3. 2-Column Grid of Compact Alert Cards */
        .alerts-grid-view {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.65rem;
          width: 100%;
          align-items: stretch;
        }

        @media (max-width: 960px) {
          .alerts-grid-view {
            grid-template-columns: 1fr;
          }
        }

        .alert-compact-card {
          padding: 0.75rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          border-radius: var(--radius-md);
          background: #0d1424;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease, opacity 0.25s ease;
        }

        .alert-compact-card:hover {
          transform: translateY(-2px);
        }

        /* CRITICAL Alert Card: Highest Visual Dominance */
        .alert-compact-card.card-crit {
          border: 1px solid rgba(239, 68, 68, 0.45);
          border-left: 4.5px solid #ef4444;
          background: radial-gradient(circle at 95% 0%, rgba(239, 68, 68, 0.16) 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424;
          box-shadow: 0 4px 20px -2px rgba(239, 68, 68, 0.15), 0 4px 16px rgba(0, 0, 0, 0.5);
        }

        .alert-compact-card.card-crit:hover {
          border-color: rgba(239, 68, 68, 0.7);
          box-shadow: 0 6px 24px -2px rgba(239, 68, 68, 0.25), 0 6px 20px rgba(0, 0, 0, 0.6);
        }

        /* WARNING */
        .alert-compact-card.card-warn {
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-left: 4px solid var(--warning);
          background: radial-gradient(circle at 95% 0%, rgba(245, 158, 11, 0.08) 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424;
        }

        /* ADVISORY */
        .alert-compact-card.card-adv {
          border: 1px solid var(--border-subtle);
          border-left: 3.5px solid var(--cyan);
          background: #0d1424;
        }

        /* Read / Acknowledged State */
        .alert-compact-card.is-read {
          opacity: 0.62;
          filter: grayscale(0.2);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .alert-compact-card.is-read:hover {
          opacity: 0.92;
          filter: grayscale(0);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
        }

        .meta-left {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          min-width: 0;
          flex-wrap: wrap;
        }

        .compact-type-badge {
          font-size: 0.60rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          padding: 0.06rem 0.35rem;
          border-radius: 3px;
          color: var(--text-secondary);
        }

        .compact-time-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.58rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .read-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.55rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #34d399;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          padding: 0.05rem 0.3rem;
          border-radius: 3px;
        }

        .ack-btn-compact {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.18rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ack-btn-compact:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .ack-btn-compact.acked {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #34d399;
        }

        .card-title-text {
          font-size: 0.82rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin: 0;
        }

        .card-location-row {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-location-row strong {
          color: #e2e8f0;
        }

        .card-summary-text {
          font-size: 0.68rem;
          color: #cbd5e1;
          line-height: 1.35;
          margin: 0;
        }

        .card-protocol-box {
          background: #060913;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.35rem 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .protocol-hdr {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.56rem;
          font-weight: 800;
          color: var(--cyan);
          letter-spacing: 0.04em;
        }

        .protocol-body {
          font-size: 0.66rem;
          font-weight: 600;
          color: #f1f5f9;
          line-height: 1.3;
        }

        /* Empty State */
        .empty-alerts-compact {
          grid-column: span 2;
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
        }

        .empty-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-heading {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
        }

        .empty-desc {
          font-size: 0.72rem;
          color: var(--text-secondary);
          max-width: 400px;
          margin: 0;
        }

        .btn-reset-compact {
          margin-top: 0.35rem;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.70rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-reset-compact:hover {
          background: var(--cyan);
          color: #050810;
        }
      `}</style>
    </div>
  );
};

export default AlertsPage;
