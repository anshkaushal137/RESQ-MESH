import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  XIcon,
  CheckIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  RadioIcon,
  ShieldIcon,
  ChevronRightIcon
} from './Icons';
import {
  approveDispatch,
  mockDispatchResources,
  mockRescueTeams
} from '../services/sosService';

export const SmartDispatchModal = ({
  isOpen,
  request,
  onClose,
  onDispatchSuccess
}) => {
  const [actionMode, setActionMode] = useState('DEFAULT'); // 'DEFAULT' | 'OVERRIDE' | 'REASSIGN' | 'SUCCESS'
  const [selectedResource, setSelectedResource] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [dispatchResult, setDispatchResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever a new request opens
  useEffect(() => {
    if (request) {
      setActionMode('DEFAULT');
      setSelectedResource(request.assignedUnit || mockDispatchResources[0].name);
      setSelectedTeam(mockRescueTeams[0].name);
      setDispatchResult(null);
      setIsSubmitting(false);
    }
  }, [request]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !request) return null;

  const getUrgencyBadgeStyle = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.6)', text: '#fca5a5' };
      case 'HIGH':
        return { bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.5)', text: '#fcd34d' };
      case 'MEDIUM':
        return { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)', text: '#67e8f9' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)', text: '#cbd5e1' };
    }
  };

  const badgeStyle = getUrgencyBadgeStyle(request.urgency);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const result = await approveDispatch(request.id, request.assignedUnit, {
        actionType: 'APPROVE',
        customEta: request.eta
      });
      setDispatchResult(result);
      setActionMode('SUCCESS');
      if (onDispatchSuccess) {
        onDispatchSuccess(result);
      }
    } catch (err) {
      console.error('Failed to approve dispatch:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmOverride = async () => {
    setIsSubmitting(true);
    try {
      const matchedRes = mockDispatchResources.find((r) => r.name === selectedResource);
      const result = await approveDispatch(request.id, selectedResource, {
        actionType: 'OVERRIDE',
        customEta: matchedRes?.eta || '10 mins'
      });
      setDispatchResult(result);
      setActionMode('SUCCESS');
      if (onDispatchSuccess) {
        onDispatchSuccess(result);
      }
    } catch (err) {
      console.error('Failed to override dispatch:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReassign = async () => {
    setIsSubmitting(true);
    try {
      const result = await approveDispatch(request.id, request.assignedUnit, {
        actionType: 'REASSIGN',
        team: selectedTeam
      });
      setDispatchResult(result);
      setActionMode('SUCCESS');
      if (onDispatchSuccess) {
        onDispatchSuccess(result);
      }
    } catch (err) {
      console.error('Failed to reassign team:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="smart-dispatch-overlay" onClick={onClose}>
      <div
        className="smart-dispatch-modal card-glass"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="dispatch-header">
          <div className="dispatch-header-left">
            <div className="dispatch-icon-badge">
              <SparklesIcon className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <div className="dispatch-title-row">
                <h3 className="dispatch-title">SMART DISPATCH CONTROLLER</h3>
                <span
                  className="dispatch-urgency-badge"
                  style={{
                    backgroundColor: badgeStyle.bg,
                    borderColor: badgeStyle.border,
                    color: badgeStyle.text
                  }}
                >
                  <span className="pulse-dot-sm"></span>
                  {request.urgency}
                </span>
                <span className="dispatch-req-id">#{request.id}</span>
              </div>
              <span className="dispatch-subtitle">
                AI Automated Triage & Live LoRa Mesh Relay Routing
              </span>
            </div>
          </div>

          <button
            className="dispatch-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            title="Dismiss modal (Esc)"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="dispatch-body">
          {actionMode === 'SUCCESS' ? (
            /* Success State Confirmation */
            <div className="dispatch-success-state">
              <div className="success-icon-circle">
                <CheckIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="success-headline">DISPATCH COMMAND TRANSMITTED</h4>
              <p className="success-desc">
                {dispatchResult?.actionType === 'REASSIGN' ? (
                  <>
                    Request <strong>#{request.id}</strong> reassigned to <strong>{dispatchResult?.assignedTeam}</strong>.
                  </>
                ) : (
                  <>
                    Unit <strong>{dispatchResult?.assignedUnit}</strong> has been authorized for immediate deployment to <strong>{request.location}</strong>.
                  </>
                )}
              </p>

              <div className="success-telemetry-strip">
                <div className="telemetry-item">
                  <span className="tel-label">Assigned Resource:</span>
                  <span className="tel-val">{dispatchResult?.assignedUnit}</span>
                </div>
                <div className="telemetry-item">
                  <span className="tel-label">Target Sector:</span>
                  <span className="tel-val">{request.location}</span>
                </div>
                <div className="telemetry-item">
                  <span className="tel-label">Mesh Status:</span>
                  <span className="tel-val cyan">48 Relay Nodes Synced</span>
                </div>
                <div className="telemetry-item">
                  <span className="tel-label">Timestamp:</span>
                  <span className="tel-val">{dispatchResult?.formattedTime}</span>
                </div>
              </div>

              <div className="success-action-row">
                <button className="btn-success-done" onClick={onClose}>
                  <span>Done & Return to Dashboard</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Request Details Section */}
              <div className="dispatch-section request-details-card">
                <div className="section-hdr">
                  <ShieldIcon className="w-4 h-4 text-cyan" />
                  <span>DISTRESS INCIDENT DETAILS</span>
                </div>

                <div className="details-grid">
                  <div className="detail-field">
                    <span className="detail-label">INCIDENT TYPE</span>
                    <strong className="detail-val-primary">{request.type}</strong>
                  </div>

                  <div className="detail-field">
                    <span className="detail-label">LOCATION</span>
                    <div className="detail-val-icon">
                      <MapPinIcon className="w-4 h-4 text-cyan shrink-0" />
                      <span>{request.location}</span>
                    </div>
                  </div>

                  <div className="detail-field">
                    <span className="detail-label">PEOPLE AFFECTED</span>
                    <div className="detail-val-icon">
                      <UsersIcon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        {request.peopleCount} {request.peopleCount > 1 ? 'Individuals' : 'Individual'}
                      </span>
                    </div>
                  </div>

                  <div className="detail-field">
                    <span className="detail-label">TIME REPORTED</span>
                    <div className="detail-val-icon">
                      <ClockIcon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{request.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. AI Recommendation Box */}
              <div className="dispatch-section ai-recommendation-card">
                <div className="ai-rec-header">
                  <div className="ai-rec-tag">
                    <SparklesIcon className="w-3.5 h-3.5 text-cyan" />
                    <span>AI DISPATCH RECOMMENDATION</span>
                  </div>
                  <span className="ai-mesh-tag">
                    <RadioIcon className="w-3 h-3 text-emerald-400" />
                    LoRa GIS Triangulated
                  </span>
                </div>

                <div className="ai-rec-main">
                  <div className="ai-rec-headline">
                    Recommended: <strong className="highlight-unit">{request.assignedUnit}</strong>
                    <span className="eta-badge">ETA {request.eta}</span>
                  </div>
                  <p className="ai-rec-reason">
                    Optimal proximity match calculated via Corridor Alpha. Unit is equipped with specialized extraction gear for {request.peopleCount} passengers and trained emergency responders.
                  </p>
                </div>
              </div>

              {/* 3. Action Mode Form / Interactive Selection */}
              {actionMode === 'OVERRIDE' ? (
                <div className="dispatch-section selection-mode-card">
                  <div className="section-hdr">
                    <RadioIcon className="w-4 h-4 text-amber-400" />
                    <span>MANUAL RESOURCE OVERRIDE</span>
                  </div>
                  <label className="select-label">SELECT ALTERNATIVE RESCUE RESOURCE:</label>
                  <select
                    className="dispatch-select"
                    value={selectedResource}
                    onChange={(e) => setSelectedResource(e.target.value)}
                  >
                    {mockDispatchResources.map((res) => (
                      <option key={res.id} value={res.name}>
                        {res.name} ({res.type}) — ETA {res.eta} [{res.capacity}]
                      </option>
                    ))}
                  </select>

                  <div className="mode-action-row">
                    <button
                      className="btn-confirm-action override"
                      onClick={handleConfirmOverride}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Confirming Override...' : 'Confirm Override & Dispatch'}
                    </button>
                    <button
                      className="btn-cancel-action"
                      onClick={() => setActionMode('DEFAULT')}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : actionMode === 'REASSIGN' ? (
                <div className="dispatch-section selection-mode-card">
                  <div className="section-hdr">
                    <UsersIcon className="w-4 h-4 text-purple-400" />
                    <span>REASSIGN RESCUE TEAM / SECTOR</span>
                  </div>
                  <label className="select-label">SELECT SPECIALIZED RESCUE TEAM:</label>
                  <select
                    className="dispatch-select"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    {mockRescueTeams.map((team) => (
                      <option key={team.id} value={team.name}>
                        {team.name} — Sector: {team.sector} [{team.channel}]
                      </option>
                    ))}
                  </select>

                  <div className="mode-action-row">
                    <button
                      className="btn-confirm-action reassign"
                      onClick={handleConfirmReassign}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Reassigning...' : 'Confirm Team Reassignment'}
                    </button>
                    <button
                      className="btn-cancel-action"
                      onClick={() => setActionMode('DEFAULT')}
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                /* Default 3 Action Buttons */
                <div className="dispatch-actions-grid">
                  <button
                    className="btn-action-primary approve"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>{isSubmitting ? 'Approving...' : 'Approve'}</span>
                  </button>

                  <button
                    className="btn-action-secondary override"
                    onClick={() => setActionMode('OVERRIDE')}
                    disabled={isSubmitting}
                  >
                    <RadioIcon className="w-4 h-4 text-cyan" />
                    <span>Override</span>
                  </button>

                  <button
                    className="btn-action-secondary reassign"
                    onClick={() => setActionMode('REASSIGN')}
                    disabled={isSubmitting}
                  >
                    <UsersIcon className="w-4 h-4 text-amber-400" />
                    <span>Reassign</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {actionMode !== 'SUCCESS' && (
          <div className="dispatch-footer">
            <div className="dispatch-footer-left">
              <RadioIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Status: <strong>{request.status}</strong></span>
            </div>
            <button className="btn-dismiss-modal" onClick={onClose}>
              Dismiss
            </button>
          </div>
        )}
      </div>

      <style>{`
        .smart-dispatch-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 15, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.25rem;
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .smart-dispatch-modal {
          width: 100%;
          max-width: 620px;
          background: #0d1424;
          border: 1px solid rgba(6, 182, 212, 0.35);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 36px -4px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: modal-slide 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modal-slide {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Header */
        .dispatch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.45rem;
          background: #090e1a;
          border-bottom: 1px solid var(--border-subtle);
          gap: 1rem;
        }

        .dispatch-header-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          min-width: 0;
        }

        .dispatch-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: rgba(6, 182, 212, 0.15);
          border: 1px solid rgba(6, 182, 212, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dispatch-title-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .dispatch-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .dispatch-urgency-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 0.12rem 0.50rem;
          border-radius: 4px;
          border: 1px solid;
          white-space: nowrap;
        }

        .pulse-dot-sm {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 6px currentColor;
        }

        .dispatch-req-id {
          font-size: 0.78rem;
          font-weight: 800;
          font-family: var(--font-mono);
          color: #94a3b8;
        }

        .dispatch-subtitle {
          font-size: 0.74rem;
          color: var(--text-secondary);
          display: block;
          margin-top: 2px;
        }

        .dispatch-close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .dispatch-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* Body */
        .dispatch-body {
          padding: 1.25rem 1.45rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .dispatch-section {
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-hdr {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        /* 1. Request Details Grid */
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }

        .detail-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #64748b;
        }

        .detail-val-primary {
          font-size: 0.94rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
        }

        .detail-val-icon {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #e2e8f0;
        }

        /* 2. AI Recommendation Card */
        .ai-recommendation-card {
          border: 1px solid rgba(6, 182, 212, 0.4);
          background: radial-gradient(circle at 95% 0%, rgba(6, 182, 212, 0.12) 0%, rgba(8, 13, 26, 0.98) 70%), #080d1a;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
        }

        .ai-rec-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ai-rec-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.70rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: var(--cyan);
        }

        .ai-mesh-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: #34d399;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.12rem 0.45rem;
          border-radius: 4px;
        }

        .ai-rec-main {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .ai-rec-headline {
          font-size: 1.05rem;
          font-weight: 700;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .highlight-unit {
          color: #ffffff;
          font-weight: 900;
          text-decoration: underline;
          text-decoration-color: var(--cyan);
          text-underline-offset: 3px;
        }

        .eta-badge {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 800;
          background: rgba(245, 158, 11, 0.18);
          border: 1px solid rgba(245, 158, 11, 0.45);
          color: #fcd34d;
          padding: 0.15rem 0.55rem;
          border-radius: 4px;
        }

        .ai-rec-reason {
          font-size: 0.78rem;
          color: #94a3b8;
          line-height: 1.45;
          margin: 0;
        }

        /* 3. Actions Grid */
        .dispatch-actions-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 0.75rem;
        }

        .btn-action-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.88rem;
          font-weight: 800;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
        }

        .btn-action-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
          transform: translateY(-1px);
        }

        .btn-action-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-action-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .btn-action-primary:disabled,
        .btn-action-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Selection Mode (Override / Reassign) */
        .selection-mode-card {
          border-color: rgba(6, 182, 212, 0.3);
        }

        .select-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .dispatch-select {
          background: #050810;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.55rem 0.85rem;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .dispatch-select:focus {
          border-color: var(--cyan);
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
        }

        .mode-action-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-top: 0.25rem;
        }

        .btn-confirm-action {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-main);
          font-size: 0.84rem;
          font-weight: 800;
          padding: 0.65rem 1rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-confirm-action.override {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0.5) 100%);
          box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
        }

        .btn-confirm-action.reassign {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.85) 0%, rgba(139, 92, 246, 0.5) 100%);
          box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);
        }

        .btn-confirm-action:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-cancel-action {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: #94a3b8;
          font-family: var(--font-main);
          font-size: 0.80rem;
          font-weight: 700;
          padding: 0.65rem 1rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-cancel-action:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        /* Success State */
        .dispatch-success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 1rem;
          gap: 0.85rem;
        }

        .success-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          border: 2px solid #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.35);
          animation: scale-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes scale-up {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-headline {
          font-size: 1.15rem;
          font-weight: 900;
          color: #34d399;
          letter-spacing: 0.04em;
        }

        .success-desc {
          font-size: 0.84rem;
          color: #cbd5e1;
          max-width: 480px;
          line-height: 1.45;
          margin: 0;
        }

        .success-desc strong {
          color: #ffffff;
        }

        .success-telemetry-strip {
          width: 100%;
          background: #080d1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1.15rem;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
          text-align: left;
          margin-top: 0.5rem;
        }

        .telemetry-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .tel-label {
          font-size: 0.64rem;
          font-weight: 800;
          color: #64748b;
        }

        .tel-val {
          font-size: 0.80rem;
          font-weight: 700;
          color: #e2e8f0;
          font-family: var(--font-mono);
        }

        .tel-val.cyan {
          color: var(--cyan);
        }

        .success-action-row {
          width: 100%;
          margin-top: 0.75rem;
        }

        .btn-success-done {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.12) 100%);
          border: 1px solid var(--cyan);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.88rem;
          font-weight: 800;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-success-done:hover {
          background: var(--cyan);
          color: #050810;
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.4);
        }

        /* Footer */
        .dispatch-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.45rem;
          background: #080c16;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .dispatch-footer-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .dispatch-footer-left strong {
          color: #e2e8f0;
        }

        .btn-dismiss-modal {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-family: var(--font-main);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .btn-dismiss-modal:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        @media (max-width: 580px) {
          .dispatch-actions-grid {
            grid-template-columns: 1fr;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .success-telemetry-strip {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartDispatchModal;
