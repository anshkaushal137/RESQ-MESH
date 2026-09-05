import React, { useState } from 'react';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SosModal } from './components/SosModal';
import { DashboardPage } from './pages/DashboardPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { SheltersPage } from './pages/SheltersPage';
import { SafeRoutesPage } from './pages/SafeRoutesPage';
import { SosPage } from './pages/SosPage';
import { ShieldIcon, RadioIcon, ActivityIcon } from './components/Icons';

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeTab, scenario } = useDisaster();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'map':
        return <RiskMapPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'shelters':
        return <SheltersPage />;
      case 'routes':
        return <SafeRoutesPage />;
      case 'sos':
        return <SosPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      {/* Top Command Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Global Urgent Incident Bar */}
      <div className="global-status-ticker">
        <div className="ticker-inner">
          <div className="ticker-left">
            <span className="pulse-dot"></span>
            <span className="ticker-title">OPERATIONAL INCIDENT:</span>
            <span className="ticker-desc">
              {scenario.title} — <strong>{scenario.evacuationUrgency}</strong> ({scenario.impactZone})
            </span>
          </div>
          <div className="ticker-right">
            <RadioIcon className="w-3.5 h-3.5 text-cyan" />
            <span>P2P LoRa Mesh Relay: <strong>HEALTHY (48/48 Synced)</strong></span>
          </div>
        </div>
      </div>

      {/* Main Layout Area: Sticky Sidebar + Main Content */}
      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="main-content">
          {/* Dynamic Page Body */}
          <main className="content-body">{renderActivePage()}</main>

          {/* Command Footer */}
          <footer className="app-footer">
            <div className="footer-content">
              <div className="footer-brand">
                <ShieldIcon className="w-4 h-4 text-cyan" />
                <span>ResQ Mesh Command • AI-Powered Decentralized Disaster Response Platform</span>
              </div>
              <div className="footer-status">
                <span>Sensor Mesh: 868.4 MHz</span>
                <span>•</span>
                <span>All Telemetry Simulated (Hackathon MVP)</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Emergency SOS Modal */}
      <SosModal />

      <style>{`
        .global-status-ticker {
          background: rgba(239, 68, 68, 0.12);
          border-bottom: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0.35rem 1.75rem;
          font-size: 0.72rem;
          color: #ffffff;
          position: sticky;
          top: var(--header-height, 54px);
          z-index: 38;
          backdrop-filter: blur(8px);
          width: 100%;
        }

        .ticker-inner {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ticker-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          min-width: 0;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--danger);
          box-shadow: 0 0 8px var(--danger);
          animation: blink 1.2s infinite;
          flex-shrink: 0;
        }

        .ticker-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fca5a5;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .ticker-desc {
          color: #f1f5f9;
        }

        .ticker-desc strong {
          color: #fca5a5;
        }

        .ticker-right {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-secondary);
          font-size: 0.68rem;
          white-space: nowrap;
        }

        .ticker-right strong {
          color: var(--cyan);
          font-family: var(--font-mono);
        }

        .app-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-subtle);
          background: #080c16;
          padding: 0.75rem 1.75rem;
          width: 100%;
        }

        .footer-content {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .ticker-right, .footer-status {
            display: none;
          }
          .global-status-ticker {
            padding: 0.5rem 1rem;
          }
          .app-footer {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export function App() {
  return (
    <DisasterProvider>
      <AppContent />
    </DisasterProvider>
  );
}

export default App;
