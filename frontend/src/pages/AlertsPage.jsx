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
    <div className="alerts-page">
      {/* Header Bar */}
      <div className="alerts-header-card card-glass">
        <div className="header-info">
          <div className="title-row">
            <BellIcon className="w-6 h-6 text-danger" />
            <h2 className="page-heading">EMERGENCY BROADCAST ALERTS FEED</h2>
          </div>
          <p className="page-sub">
            Real-time critical bulletins transmitted via government emergency management & ResQ Mesh mesh relays.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn-ack-all" onClick={handleAcknowledgeAll}>
            <CheckIcon className="w-4 h-4" />
            <span>Acknowledge Filtered ({filteredAlerts.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar card-glass">
        <div className="search-box">
          <SearchIcon className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="search-input"
            placeholder="Search alerts by location, keyword, or advisory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        {/* Priority Filter Row with Dynamic Count Badges */}
        <div className="filter-pills">
          <span className="filter-lbl">PRIORITY:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY'].map((p) => {
            const count = getPriorityCount(p);
            return (
              <button
                key={p}
                className={`pill-btn ${selectedPriority === p ? 'active' : ''} ${
                  p === 'CRITICAL' ? 'pill-crit' : ''
                }`}
                onClick={() => setSelectedPriority(p)}
              >
                <span>{p}</span>
                <span className="pill-count-badge">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Type Filter Row with Dynamic Count Badges */}
        <div className="filter-pills">
          <span className="filter-lbl">TYPE:</span>
          {categories.map((cat) => {
            const count = getTypeCount(cat);
            return (
              <button
                key={cat}
                className={`pill-btn ${selectedType === cat ? 'active' : ''}`}
                onClick={() => setSelectedType(cat)}
              >
                <span>{cat}</span>
                <span className="pill-count-badge">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-alerts card-glass">
            <div className="empty-icon-wrap">
              <SearchIcon className="w-8 h-8 text-cyan" />
            </div>
            <h4 className="empty-title">No alerts match your filters</h4>
            <p className="empty-sub">
              Try adjusting your search query, selecting "ALL" priorities, or clearing category filters.
            </p>
            <button className="btn-reset-filters" onClick={handleResetFilters}>
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
                className={`full-alert-card card-glass ${
                  isCritical ? 'card-critical' : isWarning ? 'card-warning' : 'card-advisory'
                } ${isAck ? 'is-read-card' : ''}`}
              >
                <div className="alert-card-top">
                  <div className="top-meta">
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
                    <span className="type-badge">{alert.type}</span>
                    
                    {/* Timestamp with Clock Icon */}
                    <span className="time-badge">
                      <ClockIcon className="w-3 h-3 text-slate-400" />
                      <span>{alert.timestamp}</span>
                    </span>

                    {/* Source with Radio Icon */}
                    <span className="source-badge">
                      <RadioIcon className="w-3 h-3 text-slate-500" />
                      <span>{alert.source}</span>
                    </span>

                    {/* Visual "Read / Acknowledged" pill */}
                    {isAck && (
                      <span className="read-status-badge">
                        <CheckIcon className="w-3 h-3" />
                        <span>READ</span>
                      </span>
                    )}
                  </div>

                  {/* Mark as Read / Acknowledged Button */}
                  <button
                    className={`ack-btn-lg ${isAck ? 'acked' : ''}`}
                    onClick={() => acknowledgeAlert(alert.id)}
                    title={isAck ? 'Already acknowledged' : 'Mark alert as read'}
                  >
                    <CheckIcon className="w-3.5 h-3.5" />
                    <span>{isAck ? 'Acknowledged' : 'Mark as Read'}</span>
                  </button>
                </div>

                <h3 className="alert-card-title">{alert.title}</h3>

                {/* Target Area with MapPin Icon */}
                <div className="alert-card-loc">
                  <MapPinIcon className="w-4 h-4 text-cyan shrink-0" />
                  <span>
                    Target Area: <strong>{alert.location}</strong>
                  </span>
                </div>

                <p className="alert-card-summary">{alert.summary}</p>

                <div className="action-instruction-card">
                  <div className="action-tag">
                    <ShieldIcon className="w-3 h-3 text-cyan inline shrink-0" />
                    <span>MANDATORY PROTOCOL</span>
                  </div>
                  <div className="action-message">{alert.actionRequired}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .alerts-page {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          min-width: 0;
          width: 100%;
        }

        .alerts-header-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .page-heading {
          font-size: 1.2rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .page-sub {
          font-size: 0.80rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .btn-ack-all {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-family: var(--font-main);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.55rem 0.95rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-ack-all:hover {
          background: rgba(16, 185, 129, 0.25);
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
        }

        .filter-bar {
          padding: 0.95rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.85rem;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.82rem;
          outline: none;
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0 0.25rem;
        }

        .search-clear-btn:hover {
          color: #ffffff;
        }

        .filter-pills {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .filter-lbl {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          margin-right: 0.2rem;
        }

        .pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.70rem;
          font-weight: 700;
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .pill-btn.active {
          background: rgba(6, 182, 212, 0.2);
          border-color: var(--cyan);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.25);
        }

        .pill-btn.pill-crit.active {
          background: rgba(239, 68, 68, 0.22);
          border-color: var(--danger);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.25);
        }

        .pill-count-badge {
          font-size: 0.62rem;
          font-weight: 800;
          font-family: var(--font-mono);
          opacity: 0.85;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        /* 1. Visually Prominent Alert Cards */
        .full-alert-card {
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border-radius: var(--radius-md);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* CRITICAL: High Visual Dominance */
        .card-critical {
          border: 1px solid rgba(239, 68, 68, 0.45);
          border-left: 5px solid #ef4444;
          background: radial-gradient(circle at 95% 0%, rgba(239, 68, 68, 0.15) 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424;
          box-shadow: 0 4px 24px -2px rgba(239, 68, 68, 0.15), 0 4px 16px rgba(0, 0, 0, 0.5);
        }

        .card-critical:hover {
          border-color: rgba(239, 68, 68, 0.65);
          box-shadow: 0 6px 28px -2px rgba(239, 68, 68, 0.25), 0 6px 20px rgba(0, 0, 0, 0.6);
        }

        /* WARNING */
        .card-warning {
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-left: 4px solid var(--warning);
          background: radial-gradient(circle at 95% 0%, rgba(245, 158, 11, 0.08) 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424;
        }

        /* ADVISORY */
        .card-advisory {
          border: 1px solid var(--border-subtle);
          border-left: 3.5px solid var(--cyan);
          background: #0d1424;
        }

        /* 2. Read / Acknowledged State */
        .full-alert-card.is-read-card {
          opacity: 0.62;
          filter: grayscale(0.2);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .full-alert-card.is-read-card:hover {
          opacity: 0.9;
          filter: grayscale(0);
        }

        .read-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.60rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #34d399;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }

        .alert-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .top-meta {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .type-badge {
          font-size: 0.65rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .time-badge, .source-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.64rem;
          color: var(--text-muted);
        }

        .ack-btn-lg {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-family: var(--font-main);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.28rem 0.65rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ack-btn-lg:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .ack-btn-lg.acked {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #34d399;
        }

        .alert-card-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
        }

        .alert-card-loc {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.74rem;
          color: var(--text-secondary);
        }

        .alert-card-loc strong {
          color: #ffffff;
        }

        .alert-card-summary {
          font-size: 0.76rem;
          color: #cbd5e1;
          line-height: 1.45;
        }

        .action-instruction-card {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.55rem 0.85rem;
        }

        .action-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.60rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--cyan);
          margin-bottom: 0.15rem;
        }

        .action-message {
          font-size: 0.76rem;
          font-weight: 600;
          color: #f8fafc;
        }

        /* 4. Empty State */
        .empty-alerts {
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.65rem;
        }

        .empty-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.35rem;
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 800;
          color: #ffffff;
        }

        .empty-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
          max-width: 440px;
          margin: 0;
        }

        .btn-reset-filters {
          margin-top: 0.5rem;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.4rem 0.85rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-reset-filters:hover {
          background: var(--cyan);
          color: #050810;
        }
      `}</style>
    </div>
  );
};

export default AlertsPage;
