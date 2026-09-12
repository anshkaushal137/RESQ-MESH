import React, { useState, useEffect } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { AlertTriangleIcon, XIcon, ShieldIcon, RadioIcon, MapPinIcon, CheckIcon } from './Icons';
import LocationPicker from './LocationPicker';

export const SosModal = () => {
  const { sosModalOpen, setSosModalOpen, triggerSos, sosActive, sosPayload, cancelSos } = useDisaster();

  const [category, setCategory] = useState('Rising Flood Water / Trapped');
  const [personsCount, setPersonsCount] = useState(2);
  const [medicalUrgent, setMedicalUrgent] = useState(false);
  const [notes, setNotes] = useState('');
  const [countdown, setCountdown] = useState(null);

  // Dynamic location state managed by LocationPicker
  const [rescueLocation, setRescueLocation] = useState(null);

  const categories = [
    { id: 'flood', label: 'Rising Flood Water / Trapped', icon: '🌊', color: '#06b6d4' },
    { id: 'medical', label: 'Severe Medical Injury / Trauma', icon: '🩺', color: '#ef4444' },
    { id: 'fire', label: 'Fire / Smoke Inhalation', icon: '🔥', color: '#f59e0b' },
    { id: 'collapse', label: 'Structural Collapse / Stranded', icon: '🏚️', color: '#8b5cf6' }
  ];

  // Countdown timer when activating SOS
  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      triggerSos({
        category,
        personsCount,
        medicalUrgent,
        location: rescueLocation || {
          displayName: 'Auto GPS Lock',
          lat: 18.5204,
          lon: 73.8567,
          area: 'Detected Sector'
        },
        notes: notes || 'Immediate extraction requested at coordinates.'
      });
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown, category, personsCount, medicalUrgent, notes, rescueLocation, triggerSos]);

  if (!sosModalOpen) return null;

  const handleStartCountdown = () => {
    setCountdown(3);
  };

  const handleAbortCountdown = () => {
    setCountdown(null);
  };

  return (
    <div className="sos-modal-overlay">
      <div className="sos-modal-card">
        {/* Header */}
        <div className="sos-modal-header">
          <div className="sos-header-left">
            <div className="sos-icon-glow">
              <AlertTriangleIcon className="w-6 h-6 text-danger" />
            </div>
            <div>
              <h3 className="sos-modal-title">EMERGENCY DISTRESS BEACON (SOS)</h3>
              <span className="sos-modal-sub">LoRa Mesh Direct-to-Rescue Dispatch</span>
            </div>
          </div>
          <button className="sos-close-btn" onClick={() => setSosModalOpen(false)}>
            <XIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="sos-modal-body">
          {sosActive ? (
            <div className="sos-active-view">
              <div className="beacon-pulse-large">
                <span className="beacon-core">📡</span>
              </div>
              <h4 className="beacon-title">DISTRESS BEACON BROADCASTING</h4>
              <p className="beacon-sub">
                Distress packet <strong>#{sosPayload?.id}</strong> is active across 48 local mesh nodes.
                Emergency rescue units are dispatched to your location lock.
              </p>

              <div className="beacon-details-box">
                <div className="b-row">
                  <span>GPS Telemetry</span>
                  <span className="b-highlight">
                    {sosPayload?.location?.lat
                      ? `${sosPayload.location.lat.toFixed(4)}° N, ${sosPayload.location.lon.toFixed(4)}° E`
                      : '18.5204° N, 73.8567° E (± 3m)'}
                  </span>
                </div>
                <div className="b-row">
                  <span>Location / Sector</span>
                  <span className="text-slate-200">
                    {sosPayload?.location?.area || sosPayload?.location?.displayName || 'Coastal Sector'}
                  </span>
                </div>
                {sosPayload?.location?.floorLandmark && (
                  <div className="b-row">
                    <span>Floor / Landmark</span>
                    <span className="text-amber-400 font-semibold">{sosPayload.location.floorLandmark}</span>
                  </div>
                )}
                <div className="b-row">
                  <span>Incident Category</span>
                  <span>{sosPayload?.category}</span>
                </div>
                <div className="b-row">
                  <span>Persons at Risk</span>
                  <span>{sosPayload?.personsCount} Individuals</span>
                </div>
                <div className="b-row">
                  <span>Medical Attention</span>
                  <span className={sosPayload?.medicalUrgent ? 'text-danger font-bold' : 'text-slate-300'}>
                    {sosPayload?.medicalUrgent ? 'URGENT MEDICAL TRIAGE' : 'Standard extraction'}
                  </span>
                </div>
              </div>

              <button className="btn-cancel-sos" onClick={cancelSos}>
                STAND DOWN / CANCEL SOS BEACON
              </button>
            </div>
          ) : countdown !== null ? (
            <div className="sos-countdown-view">
              <div className="countdown-ring">
                <span className="countdown-val">{countdown}</span>
              </div>
              <h4 className="countdown-title">BROADCASTING IN {countdown} SECONDS</h4>
              <p className="countdown-sub">Transmitting distress packet to all nearby first responders...</p>
              <button className="btn-abort" onClick={handleAbortCountdown}>
                ABORT TRANSMISSION
              </button>
            </div>
          ) : (
            <div className="sos-form-view">
              {/* Emergency Category */}
              <div className="form-group">
                <label className="form-label">SELECT EMERGENCY CATEGORY</label>
                <div className="category-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-btn ${category === cat.label ? 'active' : ''}`}
                      onClick={() => setCategory(cat.label)}
                    >
                      <span className="cat-icon">{cat.icon}</span>
                      <span className="cat-text">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blinkit-Style Dynamic Location Autocomplete */}
              <div className="form-group">
                <label className="form-label">LOCATION / ADDRESS / FLOOR *</label>
                <LocationPicker onLocationSelect={(loc) => setRescueLocation(loc)} />
              </div>

              {/* People Count & Medical Status */}
              <div className="form-row-split">
                <div className="form-group">
                  <label className="form-label">PEOPLE NEEDING RESCUE</label>
                  <div className="counter-controls">
                    <button
                      type="button"
                      className="count-btn"
                      onClick={() => setPersonsCount(Math.max(1, personsCount - 1))}
                    >
                      -
                    </button>
                    <span className="count-num">{personsCount}</span>
                    <button
                      type="button"
                      className="count-btn"
                      onClick={() => setPersonsCount(personsCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">MEDICAL STATUS</label>
                  <label className="checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={medicalUrgent}
                      onChange={(e) => setMedicalUrgent(e.target.checked)}
                    />
                    <span>Urgent Medical / Injuries</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">ADDITIONAL NOTES / HAZARDS (OPTIONAL)</label>
                <input
                  type="text"
                  className="sos-notes-input"
                  placeholder="e.g. Battery at 5%, elderly person unable to climb"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Telemetry Status Notice */}
              <div className="telemetry-notice">
                <MapPinIcon className="w-4 h-4 text-cyan" />
                <span>
                  Target Lock:{' '}
                  <strong>
                    {rescueLocation
                      ? `${rescueLocation.lat.toFixed(4)}° N, ${rescueLocation.lon.toFixed(4)}° E (${rescueLocation.area || rescueLocation.city || 'Locked'})`
                      : '18.5204° N, 73.8567° E (Default)'}
                  </strong>
                </span>
              </div>

              <button className="btn-confirm-sos" onClick={handleStartCountdown}>
                <AlertTriangleIcon className="w-5 h-5" />
                <span>CONFIRM & BROADCAST SOS DISTRESS SIGNAL</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sos-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 15, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99;
          padding: 1rem;
        }

        .sos-modal-card {
          width: 100%;
          max-width: 560px;
          background: #0d1424;
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: var(--radius-lg, 12px);
          box-shadow: 0 0 35px rgba(239, 68, 68, 0.25);
          overflow: hidden;
          animation: modal-enter 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .sos-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          background: rgba(239, 68, 68, 0.08);
          border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
        }

        .sos-header-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .sos-icon-glow {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid var(--danger, #ef4444);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sos-modal-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.03em;
        }

        .sos-modal-sub {
          font-size: 0.72rem;
          color: #f87171;
          font-weight: 600;
        }

        .sos-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .sos-modal-body {
          padding: 1.5rem;
          max-height: 85vh;
          overflow-y: auto;
        }

        .category-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
          margin-top: 0.35rem;
        }

        .cat-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
          border-radius: var(--radius-sm, 6px);
          padding: 0.65rem 0.85rem;
          color: var(--text-secondary, #94a3b8);
          font-family: var(--font-main, sans-serif);
          font-size: 0.78rem;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .cat-btn.active {
          background: rgba(239, 68, 68, 0.15);
          border-color: var(--danger, #ef4444);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
        }

        .cat-icon {
          font-size: 1.1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }

        .form-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-dim, #64748b);
        }

        .form-row-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .counter-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
          border-radius: var(--radius-sm, 6px);
          padding: 0.35rem 0.6rem;
          width: fit-content;
        }

        .count-btn {
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #ffffff;
          border-radius: 4px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
        }

        .count-num {
          font-size: 1.1rem;
          font-weight: 800;
          font-family: var(--font-mono, monospace);
          min-width: 24px;
          text-align: center;
          color: #ffffff;
        }

        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-top: 0.4rem;
          cursor: pointer;
        }

        .sos-notes-input {
          background: #090e1a;
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
          border-radius: var(--radius-sm, 6px);
          padding: 0.65rem 0.85rem;
          color: #ffffff;
          font-family: var(--font-main, sans-serif);
          font-size: 0.82rem;
          outline: none;
        }

        .sos-notes-input:focus {
          border-color: var(--danger, #ef4444);
        }

        .telemetry-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: var(--radius-sm, 6px);
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: #cbd5e1;
          margin-bottom: 1.25rem;
        }

        .telemetry-notice strong {
          color: var(--cyan, #06b6d4);
          font-family: var(--font-mono, monospace);
        }

        .btn-confirm-sos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          width: 100%;
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-family: var(--font-main, sans-serif);
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          padding: 0.85rem;
          border-radius: var(--radius-md, 8px);
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.5);
          transition: all 0.2s ease;
        }

        .btn-confirm-sos:hover {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          transform: translateY(-1px);
        }

        /* Active SOS view */
        .sos-active-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }

        .beacon-pulse-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid var(--danger, #ef4444);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-red 2s infinite;
        }

        .beacon-core {
          font-size: 2.2rem;
        }

        .beacon-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #f87171;
        }

        .beacon-sub {
          font-size: 0.84rem;
          color: #cbd5e1;
          max-width: 420px;
        }

        .beacon-details-box {
          width: 100%;
          background: #090e1a;
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
          border-radius: var(--radius-sm, 6px);
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: left;
        }

        .b-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted, #64748b);
        }

        .b-highlight {
          color: var(--cyan, #06b6d4);
          font-family: var(--font-mono, monospace);
          font-weight: 600;
        }

        .btn-cancel-sos {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
          color: #cbd5e1;
          font-family: var(--font-main, sans-serif);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-sm, 6px);
          cursor: pointer;
        }

        .btn-cancel-sos:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        /* Countdown View */
        .sos-countdown-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }

        .countdown-ring {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 4px solid var(--danger, #ef4444);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(239, 68, 68, 0.15);
        }

        .countdown-val {
          font-size: 2.75rem;
          font-weight: 900;
          font-family: var(--font-mono, monospace);
          color: #ffffff;
        }

        .countdown-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
        }

        .countdown-sub {
          font-size: 0.82rem;
          color: var(--text-muted, #64748b);
        }

        .btn-abort {
          background: #1e293b;
          border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
          color: #ffffff;
          font-family: var(--font-main, sans-serif);
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.65rem 1.5rem;
          border-radius: var(--radius-sm, 6px);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};