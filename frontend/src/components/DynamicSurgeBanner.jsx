import { SparklesIcon, XIcon, ChevronRightIcon, RadioIcon, AlertTriangleIcon } from './Icons';

export const DynamicSurgeBanner = ({
  surgeState, // 'CALCULATING' | 'READY' | 'DISMISSED'
  surgeData,
  onViewDetails,
  onDismiss
}) => {
  if (!surgeState || surgeState === 'DISMISSED') return null;

  const isCalculating = surgeState === 'CALCULATING';

  return (
    <div className={`dynamic-surge-banner-wrap ${isCalculating ? 'is-calculating' : 'is-ready'}`}>
      <div className="surge-banner-inner card-glass">
        {/* Left Indicator & Icon */}
        <div className="surge-icon-box">
          {isCalculating ? (
            <div className="surge-calculating-radar">
              <span className="radar-ping"></span>
              <AlertTriangleIcon className="w-5 h-5 text-amber-400" />
            </div>
          ) : (
            <div className="surge-ready-icon">
              <SparklesIcon className="w-5 h-5 text-cyan" />
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="surge-content-block">
          {isCalculating ? (
            <div className="calc-content">
              <div className="calc-title-row">
                <span className="calc-badge">
                  <span className="pulse-danger-dot"></span>
                  CRITICAL SURGE DETECTED
                </span>
                <strong className="calc-headline">
                  Zone 2: 3 new critical distress requests reported
                </strong>
              </div>
              <div className="calc-sub-row">
                <div className="loading-dots-wrap">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </div>
                <span className="calc-subtext">
                  AI dynamically re-optimizing resource distribution & Corridor Alpha transit times...
                </span>
              </div>
            </div>
          ) : (
            <div className="ready-content">
              <div className="ready-title-row">
                <span className="ready-badge">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  DYNAMIC REALLOCATION PLAN READY
                </span>
                <span className="ready-time-tag">
                  <RadioIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Mesh Synced
                </span>
              </div>

              <div className="ready-body-text">
                <strong className="plan-strong">Rescue Boat Unit 02</strong> redirected from <em>Corridor Alpha</em> to <strong>Zone 2: Lower Estuary Blvd</strong> (new ETA <strong>9 mins</strong>). 2 additional field volunteers mobilized.
              </div>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="surge-actions-block">
          {!isCalculating && (
            <button
              className="btn-surge-view"
              onClick={() => onViewDetails(surgeData)}
              title="Open Smart Dispatch Controller for this surge"
            >
              <span>View Details</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            className="btn-surge-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            title="Dismiss banner"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        .dynamic-surge-banner-wrap {
          width: 100%;
          animation: surge-slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 0.25rem;
        }

        @keyframes surge-slide-down {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .surge-banner-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          gap: 1rem;
          border-radius: var(--radius-md);
          position: relative;
          overflow: hidden;
        }

        /* Calculating state: Amber/Red pulsing styling */
        .dynamic-surge-banner-wrap.is-calculating .surge-banner-inner {
          background: radial-gradient(circle at 95% 0%, rgba(245, 158, 11, 0.18) 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424;
          border: 1.5px solid rgba(245, 158, 11, 0.55);
          border-left: 5px solid #f59e0b;
          box-shadow: 0 4px 20px -2px rgba(245, 158, 11, 0.25), 0 0 15px rgba(245, 158, 11, 0.15);
        }

        /* Ready state: Cyan/Emerald glow styling */
        .dynamic-surge-banner-wrap.is-ready .surge-banner-inner {
          background: radial-gradient(circle at 95% 0%, rgba(6, 182, 212, 0.16) 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424;
          border: 1.5px solid rgba(6, 182, 212, 0.45);
          border-left: 5px solid var(--cyan);
          box-shadow: 0 4px 20px -2px rgba(6, 182, 212, 0.2), 0 0 15px rgba(6, 182, 212, 0.12);
        }

        /* Left Icon */
        .surge-icon-box {
          flex-shrink: 0;
        }

        .surge-calculating-radar {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .radar-ping {
          position: absolute;
          inset: -3px;
          border-radius: 10px;
          border: 2px solid #f59e0b;
          opacity: 0.7;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        .surge-ready-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Content block */
        .surge-content-block {
          flex: 1;
          min-width: 0;
        }

        .calc-content, .ready-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .calc-title-row, .ready-title-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .calc-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(239, 68, 68, 0.25);
          border: 1px solid var(--danger);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 0.12rem 0.50rem;
          border-radius: 4px;
        }

        .pulse-danger-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px #ef4444;
          animation: blink 1.2s infinite;
        }

        .calc-headline {
          font-size: 0.90rem;
          font-weight: 800;
          color: #ffffff;
        }

        .calc-sub-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: #fcd34d;
        }

        .loading-dots-wrap {
          display: inline-flex;
          gap: 3px;
        }

        .loading-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #f59e0b;
          animation: bounce-dot 1.2s infinite ease-in-out;
        }

        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }

        .calc-subtext {
          font-style: italic;
          opacity: 0.95;
        }

        .ready-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(6, 182, 212, 0.2);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 0.12rem 0.55rem;
          border-radius: 4px;
        }

        .ready-time-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: #34d399;
        }

        .ready-body-text {
          font-size: 0.82rem;
          color: #e2e8f0;
          line-height: 1.4;
        }

        .ready-body-text strong {
          color: #ffffff;
        }

        .ready-body-text em {
          color: var(--cyan);
          font-style: normal;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Actions */
        .surge-actions-block {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .btn-surge-view {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, rgba(6, 182, 212, 0.15) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.45rem 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-surge-view:hover {
          background: var(--cyan);
          color: #050810;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
          transform: translateY(-1px);
        }

        .btn-surge-dismiss {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .btn-surge-dismiss:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 768px) {
          .surge-banner-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .surge-actions-block {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicSurgeBanner;
