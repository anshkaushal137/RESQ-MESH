import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  LayoutDashboardIcon,
  MapIcon,
  BellIcon,
  ShelterIcon,
  RouteIcon,
  AlertTriangleIcon,
  RadioIcon,
  SearchIcon,
  XIcon
} from './Icons';

export const Sidebar = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentAlerts, acknowledgedAlerts, setSosModalOpen, sosActive } = useDisaster();
  const [navSearch, setNavSearch] = useState('');

  const unreadAlerts = currentAlerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, badge: null },
    { id: 'map', label: 'Risk Map', icon: MapIcon, badge: 'LIVE' },
    { id: 'alerts', label: 'Alerts', icon: BellIcon, badge: unreadAlerts > 0 ? `${unreadAlerts}` : null, badgeColor: 'danger' },
    { id: 'shelters', label: 'Shelters', icon: ShelterIcon, badge: 'Open' },
    { id: 'routes', label: 'Safe Routes', icon: RouteIcon, badge: 'AI Safe' },
    { id: 'sos', label: 'Emergency SOS', icon: AlertTriangleIcon, badge: sosActive ? 'ACTIVE' : null, isSos: true }
  ];

  const filteredNavItems = navSearch.trim()
    ? navItems.filter((i) => i.label.toLowerCase().includes(navSearch.toLowerCase()))
    : navItems;

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Header */}
        <div className="sidebar-header-mobile">
          <span className="sidebar-title">NAVIGATION</span>
          <button className="close-btn" onClick={onClose} aria-label="Close sidebar">
            <XIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Quick Nav Search Input */}
        <div className="sidebar-search-box">
          <SearchIcon className="w-3 h-3 text-slate-400" />
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search tabs..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
          />
          {navSearch && (
            <button className="search-clear-btn" onClick={() => setNavSearch('')}>
              ×
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="nav-section-label">COMMAND NAV</div>

        <nav className="nav-list">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''} ${item.isSos ? 'nav-link-sos' : ''}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <div className="nav-link-left">
                  <div className={`nav-icon-wrap ${isActive ? 'active' : ''} ${item.isSos ? 'sos' : ''}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="nav-link-text">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`nav-badge ${
                      item.badgeColor === 'danger' || item.isSos ? 'badge-danger-fill' : 'badge-subtle'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Telemetry Summary Pill */}
        <div className="telemetry-widget">
          <div className="telemetry-header">
            <RadioIcon className="w-3 h-3 text-cyan" />
            <span>868.4 MHz MESH</span>
          </div>
          <div className="telemetry-row">
            <span>Mesh Relays</span>
            <strong className="text-cyan">48 Active</strong>
          </div>
          <div className="telemetry-row">
            <span>P2P Sync</span>
            <strong className="text-emerald">99.8%</strong>
          </div>
        </div>

        {/* Instant Emergency SOS Distress Broadcast Button */}
        <div className="sidebar-footer">
          <button
            className={`sidebar-sos-trigger ${sosActive ? 'is-active' : ''}`}
            onClick={() => setSosModalOpen(true)}
            title="Trigger emergency SOS distress beacon"
          >
            <div className="sos-btn-icon-wrap">
              <AlertTriangleIcon className="w-4 h-4" />
            </div>
            <div className="sos-btn-text-block">
              <span className="sos-btn-headline">
                {sosActive ? 'SOS ACTIVE' : 'SEND DISTRESS SOS'}
              </span>
              <span className="sos-btn-sub">Direct Mesh Dispatch</span>
            </div>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar-container {
          width: 220px;
          min-width: 220px;
          background: #090e18;
          border-right: 1px solid var(--border-subtle);
          display: flex !important;
          flex-direction: column;
          padding: 0.75rem 0.65rem;
          height: calc(100vh - var(--header-height, 54px) - var(--ticker-height, 34px));
          position: sticky;
          top: calc(var(--header-height, 54px) + var(--ticker-height, 34px));
          z-index: 35;
          flex-shrink: 0;
          transition: transform 0.3s ease;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-header-mobile {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0.35rem 0.45rem 0.65rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 0.45rem;
        }

        .sidebar-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .sidebar-search-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.3rem 0.5rem;
          margin-bottom: 0.55rem;
        }

        .sidebar-search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.72rem;
          outline: none;
          min-width: 0;
        }

        .sidebar-search-input::placeholder {
          color: #475569;
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 0.8rem;
          line-height: 1;
        }

        .nav-section-label {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #475569;
          padding: 0.15rem 0.5rem 0.3rem;
          text-transform: uppercase;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
        }

        .nav-link {
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.45rem 0.55rem;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: #94a3b8;
          font-family: var(--font-main);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }

        .nav-link-left {
          display: flex !important;
          align-items: center;
          gap: 0.55rem;
          min-width: 0;
        }

        .nav-icon-wrap {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          color: #94a3b8;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .nav-icon-wrap.active {
          background: rgba(6, 182, 212, 0.2);
          color: var(--cyan);
        }

        .nav-icon-wrap.sos {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.15);
        }

        .nav-link-text {
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
          color: inherit;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
        }

        .nav-link:hover .nav-icon-wrap {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .nav-link.active {
          background: rgba(6, 182, 212, 0.14);
          border-color: rgba(6, 182, 212, 0.4);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
        }

        .nav-link-sos {
          margin-top: 0.35rem;
          background: rgba(239, 68, 68, 0.07);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .nav-link-sos:hover {
          background: rgba(239, 68, 68, 0.16);
          color: #ffffff;
        }

        .nav-link-sos.active {
          background: rgba(239, 68, 68, 0.22);
          border-color: var(--danger);
          color: #ffffff;
        }

        .nav-badge {
          font-size: 0.58rem;
          font-weight: 800;
          padding: 0.1rem 0.4rem;
          border-radius: 9999px;
          letter-spacing: 0.02em;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .badge-subtle {
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
        }

        .badge-danger-fill {
          background: var(--danger);
          color: #ffffff;
        }

        .telemetry-widget {
          margin-top: auto;
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.65rem;
          margin-bottom: 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .telemetry-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: var(--cyan);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.25rem;
          margin-bottom: 0.15rem;
        }

        .telemetry-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.62rem;
          color: #64748b;
        }

        .telemetry-row strong {
          font-family: var(--font-mono);
        }

        .text-cyan { color: var(--cyan); }
        .text-emerald { color: #34d399; }

        .sidebar-footer {
          padding-top: 0.35rem;
          border-top: 1px solid var(--border-subtle);
        }

        .sidebar-sos-trigger {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          width: 100%;
          padding: 0.45rem 0.55rem;
          background: rgba(239, 68, 68, 0.12);
          border: 1px dashed rgba(239, 68, 68, 0.45);
          color: #fca5a5;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .sidebar-sos-trigger:hover {
          background: rgba(239, 68, 68, 0.22);
          color: #ffffff;
          border-color: var(--danger);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.35);
        }

        .sidebar-sos-trigger.is-active {
          background: rgba(239, 68, 68, 0.3);
          border-color: var(--danger);
        }

        .sos-btn-icon-wrap {
          width: 22px;
          height: 22px;
          border-radius: 5px;
          background: rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--danger);
        }

        .sos-btn-text-block {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
          min-width: 0;
        }

        .sos-btn-headline {
          font-family: var(--font-main);
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          color: #ffffff;
          line-height: 1.1;
          white-space: nowrap;
        }

        .sos-btn-sub {
          font-size: 0.54rem;
          color: #fca5a5;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .sidebar-backdrop {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 58;
          }

          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 60;
            transform: translateX(-100%);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
          }

          .sidebar-container.mobile-open {
            transform: translateX(0);
          }

          .sidebar-header-mobile {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};
export default Sidebar;
