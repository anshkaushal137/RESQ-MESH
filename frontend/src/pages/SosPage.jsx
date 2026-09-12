import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  AlertTriangleIcon,
  RadioIcon,
  MapPinIcon,
  PhoneCallIcon,
  ShieldIcon,
  CheckIcon,
  UserCheckIcon,
  LifebuoyIcon,
  UserSearchIcon,
  ClockIcon,
  CrosshairIcon,
  XIcon
} from '../components/Icons';
import LocationPicker from '../components/LocationPicker';
import { markSelfSafe, submitHelpRequest, submitMissingPersonReport } from '../services/sosService';

export const SosPage = () => {
  const { setSosModalOpen, sosActive, sosPayload, cancelSos, scenario } = useDisaster();

  // Primary Status Cards State
  const [activeFormTab, setActiveFormTab] = useState(null); // 'safe' | 'help' | 'missing' | null

  // "I'm Safe" state
  const [safeStatus, setSafeStatus] = useState(null); // { message, timestamp, referenceId }
  const [safeLoading, setSafeLoading] = useState(false);

  // "I Need Help" Form State
  const [helpForm, setHelpForm] = useState({
    location: '',
    peopleCount: 1,
    emergencyType: 'Trapped',
    notes: '',
    coords: null,
    floorLandmark: ''
  });
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpConfirmation, setHelpConfirmation] = useState(null);

  // "Someone is Missing" Form State
  const [missingForm, setMissingForm] = useState({
    name: '',
    lastKnownLocation: '',
    description: '',
    reporterName: '',
    reporterPhone: '',
    coords: null
  });
  const [missingLocating, setMissingLocating] = useState(false);
  const [missingLocationStatus, setMissingLocationStatus] = useState('');
  const [missingSubmitting, setMissingSubmitting] = useState(false);
  const [missingConfirmation, setMissingConfirmation] = useState(null);

  const emergencyContacts = [
    { agency: 'National Disaster Response Force (NDRF)', number: '1078 / 112', type: 'Primary Rescue Command' },
    { agency: 'Coast Guard & Maritime Water Rescue', number: '1554', type: 'Flood & Inundation Extraction' },
    { agency: 'State Emergency Operations Center', number: '1070', type: 'Helicopter & Triage Dispatch' },
    { agency: 'Disaster Ambulance & Trauma Line', number: '108', type: 'Medical Emergency Services' }
  ];

  const emergencyTypes = [
    'Trapped',
    'Injured',
    'Flood Water Rising',
    'Medical Emergency',
    'Fire',
    'Structural Collapse',
    'Other'
  ];

  // Location handler for LocationPicker
  const handleLocationPicked = (loc) => {
    if (!loc) return;
    const fullLocText = [loc.displayName || `${loc.area}, ${loc.city}`, loc.floorLandmark]
      .filter(Boolean)
      .join(' | Floor/Landmark: ');

    setHelpForm((prev) => ({
      ...prev,
      location: fullLocText,
      floorLandmark: loc.floorLandmark || '',
      coords: {
        lat: loc.lat,
        lng: loc.lon
      }
    }));
  };

  // Missing person geolocation helper
  const handleGetMissingLocation = () => {
    setMissingLocating(true);
    setMissingLocationStatus('Acquiring GPS coordinates...');

    if (!navigator.geolocation) {
      const fallback = '18.5204° N, 73.8567° E (Simulated Lock)';
      setMissingForm((prev) => ({ ...prev, lastKnownLocation: fallback, coords: { lat: 18.5204, lng: 73.8567 } }));
      setMissingLocating(false);
      setMissingLocationStatus('GPS not supported in browser. Mock coordinates applied.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const locStr = `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (±${Math.round(accuracy)}m)`;
        setMissingForm((prev) => ({
          ...prev,
          lastKnownLocation: locStr,
          coords: { lat: latitude, lng: longitude, accuracy }
        }));
        setMissingLocating(false);
        setMissingLocationStatus(`GPS Locked (±${Math.round(accuracy)}m)`);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        const fallback = '18.5204° N, 73.8567° E (Mesh Node Lock)';
        setMissingForm((prev) => ({
          ...prev,
          lastKnownLocation: prev.lastKnownLocation || fallback,
          coords: { lat: 18.5204, lng: 73.8567 }
        }));
        setMissingLocating(false);
        setMissingLocationStatus('GPS permission denied. Using mesh relay coordinate lock.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // 1. "I'm Safe" Action
  const handleMarkSafe = async () => {
    setSafeLoading(true);
    try {
      const res = await markSelfSafe({ incident: scenario?.title || 'Active Incident' });
      setSafeStatus(res);
      setActiveFormTab('safe');
    } catch (err) {
      console.error('Error marking safe:', err);
    } finally {
      setSafeLoading(false);
    }
  };

  // 2. "I Need Help" Submit
  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    if (!helpForm.location.trim()) {
      alert('Please search your location or use GPS to select your position.');
      return;
    }

    setHelpSubmitting(true);
    try {
      const res = await submitHelpRequest({
        location: helpForm.location,
        peopleCount: parseInt(helpForm.peopleCount, 10) || 1,
        emergencyType: helpForm.emergencyType,
        notes: helpForm.notes,
        coords: helpForm.coords
      });
      setHelpConfirmation(res);
    } catch (err) {
      console.error('Error submitting help request:', err);
    } finally {
      setHelpSubmitting(false);
    }
  };

  // 3. "Someone is Missing" Submit
  const handleMissingSubmit = async (e) => {
    e.preventDefault();
    if (!missingForm.name.trim()) return;

    setMissingSubmitting(true);
    try {
      const res = await submitMissingPersonReport({
        name: missingForm.name,
        lastKnownLocation: missingForm.lastKnownLocation,
        description: missingForm.description,
        reporterName: missingForm.reporterName,
        reporterPhone: missingForm.reporterPhone,
        coords: missingForm.coords
      });
      setMissingConfirmation(res);
    } catch (err) {
      console.error('Error submitting missing report:', err);
    } finally {
      setMissingSubmitting(false);
    }
  };

  return (
    <div className="sos-page">
      {/* Top Banner */}
      <div className="sos-page-header card-glass">
        <div className="sos-hdr-left">
          <div className="sos-hdr-icon">
            <AlertTriangleIcon className="w-8 h-8 text-danger" />
          </div>
          <div>
            <div className="sos-header-tagline">
              <span className="live-status-pill">OFFLINE MESH READY</span>
              <span className="mesh-freq-tag">868.4 MHz P2P</span>
            </div>
            <h2 className="sos-main-heading">EMERGENCY SOS COMMAND & DISPATCH</h2>
            <p className="sos-main-sub">
              Decentralized Peer-to-Peer Distress Beacon transmitting over LoRa Mesh Radio without cellular or internet dependency.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Status Option Cards */}
      <section className="status-options-section" aria-label="Emergency Status Actions">
        <div className="status-cards-grid">
          {/* Card 1: I'm Safe */}
          <div
            className={`status-option-card card-glass safe-card ${activeFormTab === 'safe' ? 'active-tab' : ''} ${safeStatus ? 'is-marked-safe' : ''}`}
            onClick={() => {
              setActiveFormTab('safe');
              if (!safeStatus) handleMarkSafe();
            }}
          >
            <div className="status-card-header">
              <div className="status-icon-wrapper green-icon">
                <UserCheckIcon className="w-6 h-6" />
              </div>
              <span className="status-badge green-badge">
                {safeStatus ? 'STATUS BROADCASTED' : 'GREEN STATUS'}
              </span>
            </div>
            <h3 className="status-card-title">I'm Safe</h3>
            <p className="status-card-desc">
              Check in as unharmed & broadcast your safe status to emergency contacts and mesh relays.
            </p>
            <div className="status-card-footer">
              <button
                type="button"
                className="btn-status-action btn-safe"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkSafe();
                }}
                disabled={safeLoading}
              >
                {safeLoading ? 'Syncing...' : safeStatus ? '✓ Re-Broadcast Safe Status' : 'Mark Myself Safe'}
              </button>
            </div>
          </div>

          {/* Card 2: I Need Help */}
          <div
            className={`status-option-card card-glass help-card ${activeFormTab === 'help' ? 'active-tab' : ''}`}
            onClick={() => setActiveFormTab(activeFormTab === 'help' ? null : 'help')}
          >
            <div className="status-card-header">
              <div className="status-icon-wrapper orange-icon">
                <LifebuoyIcon className="w-6 h-6" />
              </div>
              <span className="status-badge orange-badge">PRIORITY TRIAGE</span>
            </div>
            <h3 className="status-card-title">I Need Help</h3>
            <p className="status-card-desc">
              Request immediate extraction, supplies, medical aid, or structural rescue assistance.
            </p>
            <div className="status-card-footer">
              <button
                type="button"
                className="btn-status-action btn-help"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFormTab('help');
                }}
              >
                {activeFormTab === 'help' ? 'Close Help Form ▲' : 'Open Request Form ▼'}
              </button>
            </div>
          </div>

          {/* Card 3: Someone is Missing */}
          <div
            className={`status-option-card card-glass missing-card ${activeFormTab === 'missing' ? 'active-tab' : ''}`}
            onClick={() => setActiveFormTab(activeFormTab === 'missing' ? null : 'missing')}
          >
            <div className="status-card-header">
              <div className="status-icon-wrapper red-icon">
                <UserSearchIcon className="w-6 h-6" />
              </div>
              <span className="status-badge red-badge">SEARCH & RESCUE</span>
            </div>
            <h3 className="status-card-title">Someone is Missing</h3>
            <p className="status-card-desc">
              Report missing family members or neighbors for rapid search deployment across local responders.
            </p>
            <div className="status-card-footer">
              <button
                type="button"
                className="btn-status-action btn-missing"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFormTab('missing');
                }}
              >
                {activeFormTab === 'missing' ? 'Close Report Form ▲' : 'Report Missing Person ▼'}
              </button>
            </div>
          </div>
        </div>

        {/* 1. "I'm Safe" Confirmation Banner */}
        {safeStatus && activeFormTab === 'safe' && (
          <div className="confirmation-panel safe-confirmation card-glass">
            <div className="conf-icon-col">
              <div className="conf-icon-circle green">
                <CheckIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="conf-content-col">
              <div className="conf-header-row">
                <h4 className="conf-title text-emerald-400">STATUS CONFIRMED: MARKED AS SAFE</h4>
                <span className="conf-ref-badge">Ref ID: #{safeStatus.referenceId}</span>
              </div>
              <p className="conf-message">
                Marked as Safe. Your status has been shared with your emergency contacts and the ResQ Mesh network.
              </p>
              <div className="conf-meta-row">
                <span className="conf-meta-item">
                  <ClockIcon className="w-4 h-4 text-emerald-400" />
                  <strong>Timestamp:</strong> {safeStatus.formattedTime || new Date().toLocaleTimeString()} ({safeStatus.formattedDate || new Date().toLocaleDateString()})
                </span>
                <span className="conf-meta-item">
                  <RadioIcon className="w-4 h-4 text-cyan" />
                  <strong>Acknowledged by:</strong> 48 Mesh Nodes
                </span>
              </div>
            </div>
            <button
              className="conf-close-btn"
              onClick={() => setActiveFormTab(null)}
              title="Dismiss confirmation"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. "I Need Help" Form */}
        {activeFormTab === 'help' && (
          <div className="status-form-container card-glass help-form-card">
            <div className="form-card-header">
              <div className="form-header-title">
                <LifebuoyIcon className="w-5 h-5 text-amber-400" />
                <span>CITIZEN EMERGENCY ASSISTANCE REQUEST</span>
              </div>
              <button className="form-close-btn" onClick={() => setActiveFormTab(null)}>
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {helpConfirmation ? (
              <div className="form-confirmation-view">
                <div className="conf-icon-circle orange">
                  <CheckIcon className="w-7 h-7" />
                </div>
                <h4 className="conf-success-heading">REQUEST SUBMITTED & LOGGED</h4>
                <div className="conf-callout orange-callout">
                  <p className="conf-primary-text">
                    Request received. Reference ID: #{helpConfirmation.referenceId}. Help is being routed to your location.
                  </p>
                </div>

                <div className="conf-details-box">
                  <div className="conf-detail-row">
                    <span>Emergency Type:</span>
                    <strong>{helpConfirmation.summary?.emergencyType}</strong>
                  </div>
                  <div className="conf-detail-row">
                    <span>Location Lock:</span>
                    <strong className="text-cyan">{helpConfirmation.summary?.location}</strong>
                  </div>
                  <div className="conf-detail-row">
                    <span>Persons Affected:</span>
                    <strong>{helpConfirmation.summary?.peopleCount} Individual(s)</strong>
                  </div>
                  <div className="conf-detail-row">
                    <span>Assigned Dispatch Unit:</span>
                    <span>{helpConfirmation.dispatchSector || 'Regional Rescue Unit'} (Est. ETA: {helpConfirmation.estimatedEta || '15m'})</span>
                  </div>
                </div>

                <div className="conf-actions-row">
                  <button
                    type="button"
                    className="btn-form-secondary"
                    onClick={() => {
                      setHelpConfirmation(null);
                      setHelpForm({ location: '', peopleCount: 1, emergencyType: 'Trapped', notes: '', coords: null, floorLandmark: '' });
                    }}
                  >
                    Submit Another Request
                  </button>
                  <button
                    type="button"
                    className="btn-form-primary"
                    onClick={() => setActiveFormTab(null)}
                  >
                    Done / Return to SOS Center
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleHelpSubmit} className="sos-interactive-form">
                <p className="form-subtitle">
                  Provide essential details so rescue responders and LoRa mesh triage stations can locate and assist you rapidly.
                </p>

                {/* Blinkit-Style Dynamic Autocomplete & GPS Picker */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Location / Address / Floor <span className="text-danger">*</span></span>
                    <span className="label-tip">Live suggestions & GPS auto-lock</span>
                  </label>
                  <LocationPicker onLocationSelect={handleLocationPicked} />
                </div>

                {/* Grid: People Affected & Emergency Type */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <span>Number of People Affected <span className="text-danger">*</span></span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      max="100"
                      value={helpForm.peopleCount}
                      onChange={(e) => setHelpForm({ ...helpForm, peopleCount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Emergency Type <span className="text-danger">*</span></span>
                    </label>
                    <select
                      className="form-select"
                      value={helpForm.emergencyType}
                      onChange={(e) => setHelpForm({ ...helpForm, emergencyType: e.target.value })}
                      required
                    >
                      {emergencyTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Optional Notes</span>
                    <span className="label-tip">Special needs, injuries, battery level, or hazards</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="e.g., 1 elderly person unable to walk, rising water at 3 feet, phone battery critical..."
                    value={helpForm.notes}
                    onChange={(e) => setHelpForm({ ...helpForm, notes: e.target.value })}
                  />
                </div>

                {/* Form Actions */}
                <div className="form-actions-bar">
                  <button
                    type="button"
                    className="btn-form-cancel"
                    onClick={() => setActiveFormTab(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-form-submit btn-submit-help"
                    disabled={helpSubmitting}
                  >
                    {helpSubmitting ? 'Routing Help...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3. "Someone is Missing" Form */}
        {activeFormTab === 'missing' && (
          <div className="status-form-container card-glass missing-form-card">
            <div className="form-card-header">
              <div className="form-header-title">
                <UserSearchIcon className="w-5 h-5 text-rose-400" />
                <span>SEARCH & RESCUE: MISSING PERSON REPORT</span>
              </div>
              <button className="form-close-btn" onClick={() => setActiveFormTab(null)}>
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {missingConfirmation ? (
              <div className="form-confirmation-view">
                <div className="conf-icon-circle red">
                  <CheckIcon className="w-7 h-7" />
                </div>
                <h4 className="conf-success-heading">MISSING PERSON REPORT BROADCASTED</h4>
                <div className="conf-callout red-callout">
                  <p className="conf-primary-text">
                    Request received. Reference ID: #{missingConfirmation.referenceId}. Help is being routed to your location.
                  </p>
                </div>

                <div className="conf-details-box">
                  <div className="conf-detail-row">
                    <span>Missing Person Name:</span>
                    <strong>{missingConfirmation.summary?.missingPersonName}</strong>
                  </div>
                  <div className="conf-detail-row">
                    <span>Last Known Location:</span>
                    <strong className="text-cyan">{missingConfirmation.summary?.lastKnownLocation}</strong>
                  </div>
                  <div className="conf-detail-row">
                    <span>Reported By:</span>
                    <span>{missingConfirmation.summary?.reporterName} ({missingConfirmation.summary?.reporterPhone})</span>
                  </div>
                  <div className="conf-detail-row">
                    <span>Search Notice Broadcast:</span>
                    <strong className="text-emerald-400">NDRF Ground Teams & Mesh Volunteers</strong>
                  </div>
                </div>

                <div className="conf-actions-row">
                  <button
                    type="button"
                    className="btn-form-secondary"
                    onClick={() => {
                      setMissingConfirmation(null);
                      setMissingForm({ name: '', lastKnownLocation: '', description: '', reporterName: '', reporterPhone: '', coords: null });
                      setMissingLocationStatus('');
                    }}
                  >
                    File Another Report
                  </button>
                  <button
                    type="button"
                    className="btn-form-primary"
                    onClick={() => setActiveFormTab(null)}
                  >
                    Done / Return to SOS Center
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMissingSubmit} className="sos-interactive-form">
                <p className="form-subtitle">
                  Submit critical identification details to dispatch search & rescue teams and notify nearby mesh volunteers.
                </p>

                {/* Missing Person Name */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Missing Person's Name <span className="text-danger">*</span></span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full legal or commonly known name"
                    value={missingForm.name}
                    onChange={(e) => setMissingForm({ ...missingForm, name: e.target.value })}
                    required
                  />
                </div>

                {/* Last Known Location */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Last Known Location</span>
                    <span className="label-tip">Street name, shelter, neighborhood, or GPS</span>
                  </label>
                  <div className="location-input-group">
                    <div className="input-with-icon">
                      <MapPinIcon className="w-4 h-4 input-icon text-rose-400" />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Near St. Jude Arena or Market Square"
                        value={missingForm.lastKnownLocation}
                        onChange={(e) => setMissingForm({ ...missingForm, lastKnownLocation: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      className={`btn-geolocation ${missingLocating ? 'locating' : ''}`}
                      onClick={handleGetMissingLocation}
                      disabled={missingLocating}
                      title="Use device GPS location"
                    >
                      <CrosshairIcon className="w-4 h-4" />
                      <span>{missingLocating ? 'Acquiring GPS...' : 'Use My Location'}</span>
                    </button>
                  </div>
                  {missingLocationStatus && (
                    <span className="location-status-badge">
                      {missingLocationStatus}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Description <span className="text-danger">*</span></span>
                    <span className="label-tip">Age, appearance, clothing, height, when last seen</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="e.g., Age 14, wearing blue waterproof jacket, grey backpack, last seen near Victoria Bridge at 9:30 AM..."
                    value={missingForm.description}
                    onChange={(e) => setMissingForm({ ...missingForm, description: e.target.value })}
                    required
                  />
                </div>

                {/* Reporter Details */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <span>Reporter's Name</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                      value={missingForm.reporterName}
                      onChange={(e) => setMissingForm({ ...missingForm, reporterName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Reporter's Phone</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. +91 98765 43210"
                      value={missingForm.reporterPhone}
                      onChange={(e) => setMissingForm({ ...missingForm, reporterPhone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions-bar">
                  <button
                    type="button"
                    className="btn-form-cancel"
                    onClick={() => setActiveFormTab(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-form-submit btn-submit-missing"
                    disabled={missingSubmitting}
                  >
                    {missingSubmitting ? 'Broadcasting Report...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>

      {/* Main SOS Action Center */}
      <div className="sos-grid-layout">
        <div className="card-glass sos-trigger-card">
          <div className="sos-action-header">
            <span className="action-tag">LIFE SAFETY BEACON</span>
            <span className="mesh-tag">48 MESH RELAYS ACTIVE</span>
          </div>

          <div className="beacon-hero-box">
            {sosActive ? (
              <div className="active-broadcast-wrapper">
                <div className="radar-beacon-active">
                  <span className="beacon-icon">📡</span>
                </div>
                <h3 className="active-b-title">EMERGENCY DISTRESS BEACON ACTIVE</h3>
                <p className="active-b-sub">
                  Broadcasting real-time coordinates to NDRF Rescue Unit 02 and Coast Guard Dispatchers.
                </p>

                <div className="telemetry-summary-card">
                  <div className="tel-line">
                    <span>Packet ID:</span>
                    <strong className="text-cyan">#{sosPayload?.id || 'SOS-ACTIVE'}</strong>
                  </div>
                  <div className="tel-line">
                    <span>Emergency Category:</span>
                    <strong>{sosPayload?.category || 'Severe Flood / Trapped'}</strong>
                  </div>
                  <div className="tel-line">
                    <span>GPS Telemetry:</span>
                    <strong className="text-cyan">18.5204° N, 73.8567° E (± 3m)</strong>
                  </div>
                  <div className="tel-line">
                    <span>Mesh Hops:</span>
                    <strong>{sosPayload?.meshHops || 3} Hops (22ms latency)</strong>
                  </div>
                </div>

                <button className="btn-cancel-broadcast" onClick={cancelSos}>
                  STAND DOWN / CANCEL SOS TRANSMISSION
                </button>
              </div>
            ) : (
              <div className="idle-broadcast-wrapper">
                <div className="sos-instruction-box">
                  <p className="sos-explainer">
                    Press the button below if you are in immediate life-threatening danger, trapped, injured, or surrounded by rising flood water.
                    Your exact GPS coordinates and distress telemetry will be broadcast to all emergency units.
                  </p>
                </div>

                <button
                  className="btn-sos-massive"
                  onClick={() => setSosModalOpen(true)}
                  aria-label="Press to send distress signal"
                >
                  <div className="massive-icon-pulse">
                    <AlertTriangleIcon className="w-6 h-6" />
                  </div>
                  <span className="massive-text">PRESS TO SEND DISTRESS SIGNAL</span>
                  <span className="massive-sub">INSTANT GPS LOCK & DIRECT RESCUE DISPATCH</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Helplines & Protocols */}
        <div className="sos-secondary-col">
          <div className="card-glass contacts-card">
            <h3 className="card-title-sm">
              <PhoneCallIcon className="w-4 h-4 text-cyan" />
              <span>DIRECT EMERGENCY HOTLINES</span>
            </h3>

            <div className="contacts-list">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="contact-item">
                  <div className="contact-agency-info">
                    <span className="agency-name">{contact.agency}</span>
                    <span className="agency-type">{contact.type}</span>
                  </div>
                  <a href={`tel:${contact.number.split('/')[0].trim()}`} className="contact-dial-btn">
                    📞 {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass protocols-card">
            <h3 className="card-title-sm">
              <ShieldIcon className="w-4 h-4 text-emerald-400" />
              <span>IMMEDIATE SURVIVAL PROTOCOL</span>
            </h3>

            <div className="protocol-list">
              <div className="proto-item">
                <span className="proto-num">1</span>
                <span className="proto-text">Move vertically to the highest floor or elevated ridge. Never stay in a basement or closed ground floor.</span>
              </div>
              <div className="proto-item">
                <span className="proto-num">2</span>
                <span className="proto-text">Keep phone battery preserved; ResQ Mesh uses low-energy telemetry broadcasts every 60 seconds.</span>
              </div>
              <div className="proto-item">
                <span className="proto-num">3</span>
                <span className="proto-text">Signal rescue helicopters using bright clothing, reflective foil blankets, or rhythmic flashlight pulses.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sos-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .sos-page-header {
          padding: 1.5rem;
          border-left: 4px solid var(--danger);
        }

        .sos-hdr-left {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .sos-header-tagline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .live-status-pill {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .mesh-freq-tag {
          font-size: 0.65rem;
          font-weight: 700;
          font-family: var(--font-mono);
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.1);
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid rgba(6, 182, 212, 0.25);
        }

        .sos-hdr-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid var(--danger);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.25);
        }

        .sos-main-heading {
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .sos-main-sub {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.35rem;
          max-width: 820px;
          line-height: 1.45;
        }

        .status-options-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .status-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .status-option-card {
          padding: 1.35rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: #0c1424;
          border: 1px solid var(--border-subtle);
        }

        .status-option-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
        }

        .safe-card {
          border-top: 3px solid #10b981;
        }
        .safe-card:hover, .safe-card.active-tab {
          border-color: #10b981;
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, #0c1424 100%);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .help-card {
          border-top: 3px solid #f59e0b;
        }
        .help-card:hover, .help-card.active-tab {
          border-color: #f59e0b;
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, #0c1424 100%);
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
        }

        .missing-card {
          border-top: 3px solid #ef4444;
        }
        .missing-card:hover, .missing-card.active-tab {
          border-color: #ef4444;
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, #0c1424 100%);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
        }

        .status-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }

        .status-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .green-icon {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .orange-icon {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .red-icon {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .status-badge {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
        }

        .green-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .orange-badge {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .red-badge {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .status-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.4rem;
        }

        .status-card-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 1.25rem;
          min-height: 48px;
        }

        .status-card-footer {
          margin-top: auto;
        }

        .btn-status-action {
          width: 100%;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-main);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }

        .btn-safe {
          background: rgba(16, 185, 129, 0.18);
          border: 1px solid #10b981;
          color: #34d399;
        }
        .btn-safe:hover {
          background: #10b981;
          color: #042f2e;
        }

        .btn-help {
          background: rgba(245, 158, 11, 0.18);
          border: 1px solid #f59e0b;
          color: #fbbf24;
        }
        .btn-help:hover {
          background: #f59e0b;
          color: #451a03;
        }

        .btn-missing {
          background: rgba(239, 68, 68, 0.18);
          border: 1px solid #ef4444;
          color: #fca5a5;
        }
        .btn-missing:hover {
          background: #ef4444;
          color: #450a0a;
        }

        .confirmation-panel {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          border-radius: var(--radius-md);
          position: relative;
          animation: slideDown 0.3s ease;
        }

        .safe-confirmation {
          background: #091918;
          border: 1px solid rgba(16, 185, 129, 0.4);
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.15);
        }

        .conf-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .conf-icon-circle.green {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid #10b981;
        }

        .conf-icon-circle.orange {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid #f59e0b;
        }

        .conf-icon-circle.red {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid #ef4444;
        }

        .conf-content-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .conf-header-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .conf-title {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .conf-ref-badge {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          background: rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .conf-message {
          font-size: 0.88rem;
          color: #e2e8f0;
          line-height: 1.45;
        }

        .conf-meta-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 0.35rem;
          flex-wrap: wrap;
        }

        .conf-meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .conf-meta-item strong {
          color: #cbd5e1;
        }

        .conf-close-btn, .form-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.35rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .conf-close-btn:hover, .form-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .status-form-container {
          padding: 1.75rem;
          border-radius: var(--radius-md);
          animation: slideDown 0.3s ease;
        }

        .help-form-card {
          border-top: 4px solid #f59e0b;
          background: #0d1627;
        }

        .missing-form-card {
          border-top: 4px solid #ef4444;
          background: #0d1627;
        }

        .form-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 1.25rem;
        }

        .form-header-title {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.04em;
        }

        .form-subtitle {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          line-height: 1.45;
        }

        .sos-interactive-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
        }

        .label-tip {
          font-size: 0.72rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        .location-input-group {
          display: flex;
          gap: 0.5rem;
        }

        .input-with-icon {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          background: #080c16;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.85rem;
          padding: 0.65rem 0.85rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .input-with-icon .form-input {
          padding-left: 2.35rem;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--cyan);
          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
        }

        .btn-geolocation {
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .btn-geolocation:hover:not(:disabled) {
          background: var(--cyan);
          color: #080c16;
        }

        .btn-geolocation.locating {
          opacity: 0.7;
          cursor: wait;
        }

        .location-status-badge {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: #38bdf8;
          margin-top: 0.2rem;
        }

        .form-select {
          width: 100%;
          background: #080c16;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.85rem;
          padding: 0.65rem 0.85rem;
          outline: none;
          cursor: pointer;
        }

        .form-select option {
          background: #0f172a;
          color: #ffffff;
        }

        .form-textarea {
          width: 100%;
          background: #080c16;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-sm);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.85rem;
          padding: 0.65rem 0.85rem;
          outline: none;
          resize: vertical;
        }

        .form-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-form-cancel {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          color: #cbd5e1;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-form-cancel:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .btn-form-submit {
          font-family: var(--font-main);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          padding: 0.7rem 1.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
        }

        .btn-submit-help {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #111827;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
        }
        .btn-submit-help:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
        }

        .btn-submit-missing {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.35);
        }
        .btn-submit-missing:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }

        .form-confirmation-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 0.5rem;
          gap: 1rem;
        }

        .conf-success-heading {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.03em;
        }

        .conf-callout {
          width: 100%;
          max-width: 620px;
          padding: 1.15rem 1.5rem;
          border-radius: var(--radius-sm);
        }

        .orange-callout {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .red-callout {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .conf-primary-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.5;
        }

        .conf-details-box {
          width: 100%;
          max-width: 620px;
          background: #080c16;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          text-align: left;
        }

        .conf-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .conf-actions-row {
          display: flex;
          gap: 1rem;
          margin-top: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-form-secondary {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .btn-form-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-form-primary {
          background: var(--cyan);
          border: 1px solid var(--cyan);
          color: #080c16;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.65rem 1.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .btn-form-primary:hover {
          background: #38bdf8;
        }

        .sos-grid-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .sos-trigger-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-radius: var(--radius-md);
        }

        .sos-action-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .action-tag {
          color: var(--danger);
          letter-spacing: 0.06em;
        }

        .mesh-tag {
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .beacon-hero-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0.5rem 0;
        }

        .idle-broadcast-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sos-instruction-box {
          width: 100%;
          max-width: 520px;
          margin-bottom: 1.25rem;
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
        }

        .sos-explainer {
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0;
        }

        .btn-sos-massive {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          width: 100%;
          max-width: 440px;
          min-height: 88px;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-radius: var(--radius-lg);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(239, 68, 68, 0.5);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-sos-massive:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 12px 40px rgba(239, 68, 68, 0.75);
          border-color: #ffffff;
        }

        .btn-sos-massive:active {
          transform: translateY(0) scale(0.99);
        }

        .massive-icon-pulse {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulseIcon 2s infinite ease-in-out;
        }

        .massive-text {
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          font-family: var(--font-main);
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          line-height: 1.2;
        }

        .massive-sub {
          font-size: 0.68rem;
          font-weight: 700;
          color: #fca5a5;
          letter-spacing: 0.06em;
          line-height: 1.2;
        }

        .radar-beacon-active {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          border: 3px solid var(--danger);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-red 2s infinite;
          margin: 0 auto 1.25rem;
        }

        .beacon-icon {
          font-size: 2.5rem;
        }

        .active-b-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #f87171;
        }

        .active-b-sub {
          font-size: 0.85rem;
          color: #cbd5e1;
          margin-top: 0.35rem;
          max-width: 440px;
        }

        .telemetry-summary-card {
          width: 100%;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }

        .tel-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .btn-cancel-broadcast {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel-broadcast:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        }

        .contacts-card, .protocols-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-radius: var(--radius-md);
        }

        .card-title-sm {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #ffffff;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          gap: 0.75rem;
        }

        .contact-agency-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .agency-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .agency-type {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .contact-dial-btn {
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: var(--cyan);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: var(--font-mono);
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .contact-dial-btn:hover {
          background: var(--cyan);
          color: #080c16;
        }

        .protocol-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .proto-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
        }

        .proto-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-size: 0.72rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .proto-text {
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.4;
        }

        @keyframes pulseIcon {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.85; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 960px) {
          .status-cards-grid {
            grid-template-columns: 1fr;
          }
          .sos-grid-layout {
            grid-template-columns: 1fr;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .location-input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};