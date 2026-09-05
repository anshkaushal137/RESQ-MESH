import React from 'react';

/**
 * Circular Progress Gauge
 * @param {number} value - percentage 0 to 100
 * @param {number} size - diameter in pixels (default 44)
 * @param {number} strokeWidth - stroke width in pixels (default 4)
 * @param {string} color - stroke color (hex or var)
 * @param {string} trackColor - background track color
 * @param {string} label - center label override (default `${value}%`)
 * @param {string} sublabel - optional text below gauge
 */
export const CircularGauge = ({
  value = 0,
  size = 46,
  strokeWidth = 4,
  color = 'var(--cyan)',
  trackColor = 'rgba(255, 255, 255, 0.08)',
  label = null,
  sublabel = null,
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`circular-gauge-container ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="circular-gauge-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="circular-gauge-content">
        <span className="circular-gauge-text">{label !== null ? label : `${clamped}%`}</span>
        {sublabel && <span className="circular-gauge-sub">{sublabel}</span>}
      </div>

      <style>{`
        .circular-gauge-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .circular-gauge-svg {
          transform: rotate(-90deg);
          overflow: visible;
        }

        .circular-gauge-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          line-height: 1;
        }

        .circular-gauge-text {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 800;
          color: #ffffff;
        }

        .circular-gauge-sub {
          font-size: 0.5rem;
          color: var(--text-muted);
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
};

/**
 * Semi-Circular Speedometer / Arc Gauge
 * @param {number} value - 0 to 100
 * @param {string} severity - 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'
 * @param {number} width - width in pixels (default 140)
 * @param {number} height - height in pixels (default 76)
 * @param {string} color - arc color
 */
export const SemiCircularGauge = ({
  value = 0,
  max = 100,
  severity = 'CRITICAL',
  width = 130,
  height = 72,
  color = 'var(--danger)',
  trackColor = 'rgba(255, 255, 255, 0.08)'
}) => {
  const clamped = Math.min(max, Math.max(0, value));
  const pct = clamped / max;
  
  // Arc parameters
  const strokeWidth = 8;
  const radius = (width - strokeWidth * 2) / 2;
  const cx = width / 2;
  const cy = height - 6;

  // Arc path: 180 degrees from (cx - radius, cy) to (cx + radius, cy)
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength * (1 - pct);

  return (
    <div className="semi-gauge-wrap" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="semi-gauge-svg">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Animated fill arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>

      {/* Center Digital Readout */}
      <div className="semi-gauge-center" style={{ top: cy - 32 }}>
        <div className="semi-gauge-val" style={{ color: color }}>
          {clamped}<span className="semi-gauge-max">/{max}</span>
        </div>
        <div className="semi-gauge-sev" style={{ color: color }}>
          {severity}
        </div>
      </div>

      <style>{`
        .semi-gauge-wrap {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          flex-shrink: 0;
        }

        .semi-gauge-svg {
          overflow: visible;
        }

        .semi-gauge-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          text-align: center;
        }

        .semi-gauge-val {
          font-family: var(--font-mono);
          font-size: 1.28rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .semi-gauge-max {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .semi-gauge-sev {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

/**
 * Compact Dial / Level Gauge for Alerts & Threat Levels
 */
export const AlertLevelDial = ({
  level = 4,
  maxLevel = 5,
  label = 'CRITICAL',
  color = '#ef4444',
  size = 54
}) => {
  const percentage = (level / maxLevel) * 100;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="alert-level-dial" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="alert-dial-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="alert-dial-center">
        <span className="dial-lvl-num" style={{ color }}>L{level}</span>
        <span className="dial-lvl-lbl">{label}</span>
      </div>

      <style>{`
        .alert-level-dial {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alert-dial-svg {
          transform: rotate(-90deg);
          overflow: visible;
        }

        .alert-dial-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          line-height: 1;
        }

        .dial-lvl-num {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 800;
        }

        .dial-lvl-lbl {
          font-size: 0.44rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          margin-top: 1px;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};

