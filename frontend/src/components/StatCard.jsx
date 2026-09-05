import { CircularGauge } from './Gauges';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'cyan',
  gaugeValue = null,
  onClick
}) => {
  const colorMap = {
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.35)',
      text: 'var(--cyan)',
      glow: 'rgba(6, 182, 212, 0.25)'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.35)',
      text: 'var(--danger)',
      glow: 'rgba(239, 68, 68, 0.25)'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.35)',
      text: 'var(--warning)',
      glow: 'rgba(245, 158, 11, 0.25)'
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.35)',
      text: 'var(--success)',
      glow: 'rgba(16, 185, 129, 0.25)'
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.35)',
      text: 'var(--purple)',
      glow: 'rgba(139, 92, 246, 0.25)'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`stat-card ${onClick ? 'is-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      style={{
        borderTop: `2.5px solid ${scheme.text}`,
        background: `radial-gradient(circle at 85% 0%, ${scheme.bg} 0%, rgba(13, 20, 36, 0.98) 70%), #0d1424`,
        boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
      }}
    >
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div
            className="stat-icon-wrapper"
            style={{
              background: scheme.bg,
              borderColor: scheme.border,
              color: scheme.text
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="stat-middle">
        <span className="stat-value">{value}</span>
        {gaugeValue !== null && (
          <div className="stat-gauge-wrap">
            <CircularGauge
              value={gaugeValue}
              size={44}
              strokeWidth={4.5}
              color={scheme.text}
              label={`${gaugeValue}%`}
            />
          </div>
        )}
      </div>

      <div className="stat-bottom">
        {trend && (
          <span
            className="stat-trend"
            style={{
              color: scheme.text,
              backgroundColor: scheme.bg,
              border: `1px solid ${scheme.border}`
            }}
          >
            {trend}
          </span>
        )}
        <span className="stat-subtext">{subtext}</span>
      </div>

      <style>{`
        .stat-card {
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.95rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          min-width: 0;
          width: 100%;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card.is-clickable {
          cursor: pointer;
          user-select: none;
        }

        .stat-card.is-clickable:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.28);
          box-shadow: 0 6px 24px -2px rgba(0, 0, 0, 0.65), 0 0 14px ${scheme.glow};
        }

        .stat-card.is-clickable:active {
          transform: translateY(0);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.45rem;
        }

        .stat-title {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 7px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-wrapper svg {
          width: 16px;
          height: 16px;
        }

        .stat-middle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.45rem;
          min-width: 0;
          margin: 0.15rem 0;
        }

        .stat-value {
          font-size: 1.80rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.15;
        }

        .stat-gauge-wrap {
          flex-shrink: 0;
        }

        .stat-bottom {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0.5rem;
          font-size: 0.78rem;
          min-width: 0;
          overflow: hidden;
        }

        .stat-trend {
          font-weight: 800;
          font-family: var(--font-mono);
          font-size: 0.70rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          white-space: nowrap;
          letter-spacing: 0.02em;
          flex-shrink: 0;
        }

        .stat-subtext {
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.76rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
