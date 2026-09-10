import React, { useState, useEffect } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { LogoShieldIcon, RadioIcon, MenuIcon, BellIcon } from './Icons';
import { DISASTER_SCENARIOS } from '../data/mockData';

export const Header = ({ onToggleSidebar }) => {
  const {
    scenarioKey,
    switchScenario,
    scenario,
    currentAlerts,
    acknowledgedAlerts,
    setActiveTab
  } = useDisaster();

  // Running Live Timer state (HH:MM:SS)
  const [elapsedSeconds, setElapsedSeconds] = useState(6142); // starts with active incident time

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const unreadAlertsCount = currentAlerts.filter((a) => !acknowledgedAlerts?.includes(a.id)).length;

  return (
    <header className="header-bar">
      <div className="header-inner">
        {/* Left: Brand Logo & Name */}
        <div className="header-left">
          <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">
            <MenuIcon className="w-5 h-5 text-slate-300" />
          </button>

          <div className="brand-badge" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo-glow">
              <LogoShieldIcon className="w-5 h-5" />
            </div>
            <div className="brand-text-block">
              <div className="brand-title">
                ResQ <span>Mesh</span>
              </div>
              <div className="brand-sub">AI Emergency Command</div>
            </div>
          </div>
        </div>

        {/* Center: Active Incident Status with Name & Scenario Switcher */}
        <div className="header-center">
          <div className="incident-status-card">
            <div className="incident-status-tag">
              <span className="incident-pulse-dot"></span>
              <span className="incident-tag-label">ACTIVE INCIDENT:</span>
            </div>
            <select
              value={scenarioKey}
              onChange={(e) => switchScenario(e.target.value)}
              className="incident-select"
              aria-label="Active emergency incident scenario"
            >
              {Object.entries(DISASTER_SCENARIOS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.title} — {item.threatLevel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Live Running Timer, Mesh Status, Notification Bell */}
        <div className="header-right">
          {/* Live Badge with Running Timer */}
          <div className="live-timer-badge" title="Live incident tracking runtime">
            <span className="live-dot-pulse"></span>
            <span className="live-label">LIVE</span>
            <span className="live-timer-digits">{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Mesh Status Pill */}
          <div className="mesh-status-indicator" title="Decentralized emergency mesh network active (48 Nodes Synced)">
            <RadioIcon className="w-3.5 h-3.5 text-cyan" />
            <span className="mesh-text">48 MESH</span>
          </div>

          {/* Notification Bell with Badge */}
          <button 
            className="notif-bell-btn" 
            onClick={() => setActiveTab('alerts')}
            title={`${unreadAlertsCount} unread emergency broadcasts`}
          >
            <BellIcon className="w-4 h-4 text-slate-300" />
            {unreadAlertsCount > 0 && (
              <span className="notif-badge">{unreadAlertsCount}</span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .header-bar {
          background: #090e18;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 40;
          height: var(--header-height, 54px);
          display: flex;
          align-items: center;
          padding: 0 1.25rem;
          width: 100%;
        }

        .header-inner {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          min-width: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .mobile-menu-btn {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          user-select: none;
        }

        .brand-logo-glow {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(13, 20, 36, 0.95) 100%);
          border: 1px solid rgba(6, 182, 212, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
          flex-shrink: 0;
        }

        .brand-text-block {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-family: 'Poppins', 'Montserrat', sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #ffffff;
          line-height: 1.1;
        }

        .brand-title span {
          color: var(--cyan);
          font-weight: 700;
        }

        .brand-sub {
          font-size: 0.56rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }

        .header-center {
          flex: 1;
          max-width: 480px;
          min-width: 0;
        }

        .incident-status-card {
          display: flex;
          align-items: center;
          background: #0d1424;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          padding: 0.22rem 0.65rem;
          gap: 0.45rem;
          min-width: 0;
        }

        .incident-status-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }

        .incident-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--danger);
          box-shadow: 0 0 8px var(--danger);
          animation: blink 1.2s infinite;
        }

        .incident-tag-label {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #fca5a5;
          white-space: nowrap;
        }

        .incident-select {
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.74rem;
          font-weight: 700;
          width: 100%;
          outline: none;
          cursor: pointer;
          min-width: 0;
          text-overflow: ellipsis;
        }

        .incident-select option {
          background: #0d1424;
          color: #ffffff;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .live-timer-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.65rem;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: 9999px;
          font-size: 0.68rem;
          white-space: nowrap;
        }

        .live-dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
          animation: blink 1s infinite;
        }

        .live-label {
          font-weight: 800;
          font-size: 0.6rem;
          color: #fca5a5;
          letter-spacing: 0.05em;
        }

        .live-timer-digits {
          font-family: var(--font-mono);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.04em;
        }

        .mesh-status-indicator {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: 9999px;
          font-size: 0.64rem;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--cyan);
          white-space: nowrap;
        }

        .notif-bell-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notif-bell-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .notif-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: var(--danger);
          color: #ffffff;
          font-size: 0.54rem;
          font-weight: 800;
          font-family: var(--font-mono);
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #090e18;
        }

        @media (max-width: 1024px) {
          .mesh-status-indicator {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
          .header-center {
            display: none;
          }
          .header-bar {
            padding: 0 0.85rem;
          }
          .brand-sub {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
export default Header;
