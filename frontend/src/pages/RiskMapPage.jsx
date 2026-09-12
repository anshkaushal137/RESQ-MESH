import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, ZoomControl, Polyline } from "react-leaflet";
import L from "leaflet";

// Safe standalone marker icon without asset path breakage
const redBeaconIcon = new L.DivIcon({
  className: "custom-pulse-marker",
  html: "<div style=\"background: #ef4444; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 12px #ef4444; border: 2px solid white;\"></div>",
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const defaultMarkerIcon = new L.DivIcon({
  className: "custom-base-marker",
  html: "<div style=\"background: #0284c7; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px #0284c7; border: 2px solid white;\"></div>",
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const RiskMapPage = ({ incidents = [], mapPins = [] }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTacticalDispatch = (actionType, targetName) => {
    alert(`[TACTICAL DISPATCH AUTHORIZED]\nOperation: ${actionType}\nTarget: ${targetName}\nRelayed via 868.4 MHz LoRa Gateway.`);
  };

  return (
    <div style={{ padding: "16px", color: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Top Banner */}
      <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "8px", padding: "14px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#ef4444", fontWeight: "bold", fontSize: "12px", letterSpacing: "1px" }}>ACTIVE INCIDENT</div>
          <div style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", marginTop: "2px" }}>Super Cyclone "Amphan-X" & Storm Surge — Severe Category 4</div>
          <div style={{ color: "#94a3b8", fontSize: "12px" }}>Immediate Mandatory Evacuation (Coastal Sector 4 & Lower Delta Basin)</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#10b981", fontWeight: "bold", fontSize: "12px" }}>868.4 MHz MESH: 48/48 NODES SYNCED</div>
          <div style={{ color: "#38bdf8", fontSize: "16px", fontFamily: "monospace", marginTop: "2px" }}>LIVE {currentTime || "SYNCING..."}</div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 290px", gap: "16px", alignItems: "start" }}>
        
        {/* Left Column: Telemetry */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Hydrologic Sensor Waveform */}
          <div style={{ background: "#081120", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8" }}> HYDROLOGIC ACOUSTIC SENSOR</span>
              <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "bold" }}>CREST: +4.32m</span>
            </div>
            <svg width="100%" height="40" style={{ overflow: "visible" }}>
              <path d="M0,20 Q25,5 50,20 T100,20 T150,20 T200,20 T250,20 T300,20" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>
              <span>Breach: 2.4 m/s</span>
              <span style={{ color: "#f59e0b" }}>Peak in 18 mins</span>
            </div>
          </div>

          {/* LoRa Mesh Graph */}
          <div style={{ background: "#081120", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8" }}> P2P MESH TOPOLOGY</span>
              <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "bold" }}>48 NODES</span>
            </div>
            <svg width="100%" height="60" style={{ background: "#050a14", borderRadius: "6px" }}>
              <line x1="20" y1="30" x2="70" y2="15" stroke="#1e3a5f" strokeWidth="1.5" />
              <line x1="70" y1="15" x2="130" y2="40" stroke="#1e3a5f" strokeWidth="1.5" />
              <line x1="130" y1="40" x2="190" y2="15" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1="130" y1="40" x2="190" y2="48" stroke="#10b981" strokeWidth="2" />
              <line x1="190" y1="48" x2="250" y2="30" stroke="#10b981" strokeWidth="2" />
              <circle cx="20" cy="30" r="6" fill="#10b981" />
              <circle cx="70" cy="15" r="6" fill="#10b981" />
              <circle cx="130" cy="40" r="6" fill="#10b981" />
              <circle cx="190" cy="15" r="6" fill="#ef4444" />
              <circle cx="190" cy="48" r="6" fill="#10b981" />
              <circle cx="250" cy="30" r="6" fill="#0284c7" />
            </svg>
            <div style={{ fontSize: "9.5px", color: "#f59e0b", marginTop: "6px" }}> Node 12 Rerouted via Node 14</div>
          </div>

          {/* Threat Risk Index */}
          <div style={{ background: "#081120", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", marginBottom: "8px" }}> DISASTER RISK INDEX</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#ef4444" }}>92/100</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "10px" }}>Severe Category 4 Threat</div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
              <span>Surge Breach Risk</span>
              <span style={{ color: "#ef4444", fontWeight: "bold" }}>95%</span>
            </div>
            <div style={{ width: "100%", height: "4px", background: "#1e293b", borderRadius: "2px" }}>
              <div style={{ width: "95%", height: "100%", background: "#ef4444" }}></div>
            </div>
          </div>

        </div>

        {/* Center: Real Leaflet Map */}
        <div style={{ background: "#081120", border: "1px solid rgba(6, 182, 212, 0.4)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", background: "#0a1324", borderBottom: "1px solid #1e3a5f", fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}>
             GIS TACTICAL RADAR & GOOGLE 4K SATELLITE HUD
          </div>
          <div style={{ width: "100%", height: "720px" }}>
            <MapContainer center={[26.4499, 80.3319]} zoom={13} maxZoom={20} scrollWheelZoom={true} zoomControl={false} style={{ height: "100%", width: "100%", background: "#0b132b" }}>
              <ZoomControl position="bottomright" />
              
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name=" Google Satellite 4K">
                  <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" maxZoom={20} subdomains={["mt0", "mt1", "mt2", "mt3"]} />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name=" Google Streets">
                  <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" maxZoom={20} subdomains={["mt0", "mt1", "mt2", "mt3"]} />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name=" Dark Tactical">
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" maxZoom={19} />
                </LayersControl.BaseLayer>
              </LayersControl>

              {/* Corridors */}
              <Polyline positions={[[26.435, 80.315], [26.445, 80.328], [26.458, 80.338], [26.465, 80.345]]} pathOptions={{ color: "#10b981", weight: 4, opacity: 0.9 }} />
              <Polyline positions={[[26.428, 80.310], [26.435, 80.320], [26.442, 80.330]]} pathOptions={{ color: "#ef4444", weight: 3, dashArray: "6, 8", opacity: 0.8 }} />

              {/* Circles */}
              <Circle center={[26.465, 80.345]} radius={1600} pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.2, weight: 2 }} />
              <Circle center={[26.435, 80.32]} radius={2000} pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.25, weight: 2, dashArray: "6, 6" }} />

              {/* Base Markers */}
              <Marker position={[26.465, 80.345]} icon={defaultMarkerIcon}>
                <Popup><div style={{ color: "#000", fontWeight: "bold" }}> North Civic Shelter (780 Beds Occupied)</div></Popup>
              </Marker>
              <Marker position={[26.435, 80.32]} icon={redBeaconIcon}>
                <Popup><div style={{ color: "#b91c1c", fontWeight: "bold" }}> Victoria Bridge Submerged (+3.8m)</div></Popup>
              </Marker>

              {/* Dynamic Distress Beacons */}
              {Array.isArray(mapPins) && mapPins.filter(p => p && p.id && p.id.toString().startsWith("LIVE")).map((pin, i) => (
                <Marker key={pin.id || i} position={[26.4499 + ((i + 1) * 0.008), 80.3319 + ((i + 1) * -0.006)]} icon={redBeaconIcon}>
                  <Popup><div style={{ color: "#b91c1c", fontWeight: "bold" }}> {pin.name || "EMERGENCY BEACON"}<br/>{pin.label || ""}</div></Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right Column: Tactical Dispatch & Copilot */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ background: "#081120", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", marginBottom: "10px" }}> TACTICAL COMMAND DISPATCH</div>
            <div style={{ display: "grid", gap: "8px" }}>
              <button type="button" onClick={() => handleTacticalDispatch("BOAT EXTRACTION FLEET", "Sector 4 Delta Basin")} style={{ background: "linear-gradient(135deg, #0284c7, #0369a1)", color: "#fff", border: "none", borderRadius: "6px", padding: "9px 10px", fontSize: "10.5px", fontWeight: "bold", cursor: "pointer", textAlign: "left" }}> AUTHORIZE RESCUE BOAT 02</button>
              <button type="button" onClick={() => handleTacticalDispatch("LORA CITIZEN BROADCAST", "Coastal Nodes 01-24")} style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)", color: "#fff", border: "none", borderRadius: "6px", padding: "9px 10px", fontSize: "10.5px", fontWeight: "bold", cursor: "pointer", textAlign: "left" }}> BROADCAST EVAC (868 MHz)</button>
              <button type="button" onClick={() => handleTacticalDispatch("AIRDROP MEDICAL KIT", "Block 14 Dialysis Unit")} style={{ background: "linear-gradient(135deg, #10b981, #047857)", color: "#fff", border: "none", borderRadius: "6px", padding: "9px 10px", fontSize: "10.5px", fontWeight: "bold", cursor: "pointer", textAlign: "left" }}> LAUNCH UAV MEDICAL DROP</button>
            </div>
          </div>

          <div style={{ background: "#081120", border: "1px solid #1e3a5f", borderRadius: "8px", padding: "14px", display: "flex", flexDirection: "column", height: "350px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", color: "#38bdf8", marginBottom: "8px" }}> RESQ AI COPILOT</div>
            <div style={{ flex: 1, background: "rgba(15, 23, 42, 0.4)", borderRadius: "6px", padding: "10px", fontSize: "11px", color: "#cbd5e1", overflowY: "auto", marginBottom: "10px" }}>
              <div style={{ color: "#10b981", fontWeight: "bold", marginBottom: "4px" }}>ResQ AI (Mesh Online)</div>
              <div> 5 victims trapped in Sector 4.<br/> Corridor Alpha high-ground clear.<br/> Victoria bridge impassable.</div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type prompt..." style={{ flex: 1, background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: "4px", padding: "6px 8px", color: "#fff", fontSize: "11px" }} />
              <button type="button" style={{ background: "#0284c7", color: "#fff", border: "none", borderRadius: "4px", padding: "0 10px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>Send</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export { RiskMapPage };
export default RiskMapPage;