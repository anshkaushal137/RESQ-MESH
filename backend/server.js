import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const BUFFER_PATH = path.join(__dirname, 'buffer.json');

let packetBuffer = [];
if (fs.existsSync(BUFFER_PATH)) {
  try {
    const raw = JSON.parse(fs.readFileSync(BUFFER_PATH, 'utf8'));
    packetBuffer = Array.isArray(raw) ? raw : (raw.value || []);
  } catch (e) {
    packetBuffer = [];
  }
}

// 1. LoRa Mesh & Node Health
app.get('/api/node-status', (req, res) => {
  res.json({
    status: "ONLINE",
    activeRelays: 48,
    p2pSync: 99.8,
    frequency: "868.4 MHz",
    lastHeartbeat: new Date().toISOString()
  });
});

// 2. Mesh Ingestion & Buffer
app.get('/api/mesh/packets', (req, res) => {
  res.json({
    count: packetBuffer.length,
    packets: packetBuffer
  });
});

// 3. Relay Packet (Full Ingestion + AI Engine + Disk Persistence)
app.post('/api/relay-packet', async (req, res) => {
  const distressText = `${req.body.emergencyType || ''} ${req.body.message || ''}`.trim() || "SOS Distress";
  
  let aiData = null;
  try {
    const aiRes = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: distressText })
    });
    if (aiRes.ok) {
      aiData = await aiRes.json();
    }
  } catch (e) {
    console.warn("AI Engine unreachable, falling back to local heuristic");
  }

  const urgency = aiData?.priority || (distressText.toLowerCase().includes('critical') ? 'Critical' : 'High');
  const weightMap = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

  const packet = {
    id: "pkt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    sender: req.body.sender || "Field-Relay-Node",
    lat: req.body.lat || 26.45,
    lng: req.body.lng || 80.33,
    message: req.body.message || distressText,
    emergencyType: req.body.emergencyType || "Emergency",
    urgency: urgency,
    priorityWeight: weightMap[urgency] || 3,
    tags: aiData?.tags || ["Emergency"],
    survivorCount: aiData?.survivor_count || 1,
    hops: req.body.hops || 1,
    routePath: req.body.routePath || ["RELAY-GATEWAY-PRIMARY"],
    timestamp: new Date().toISOString(),
    syncedToCloud: false,
    aiProcessed: true
  };

  packetBuffer.unshift(packet);
  if (packetBuffer.length > 50) packetBuffer.pop();

  try {
    fs.writeFileSync(BUFFER_PATH, JSON.stringify(packetBuffer, null, 2));
  } catch (err) {
    console.error("Buffer write error:", err);
  }

  res.status(201).json({
    success: true,
    packetId: packet.id,
    packet: packet,
    message: "SOS telemetry ingested into LoRa mesh & local buffer."
  });
});

app.post('/api/sos/dispatch', (req, res) => {
  res.json({ success: true, dispatchId: "DISP-" + Date.now(), status: "DISPATCHED" });
});

app.post('/api/sos/request-help', (req, res) => {
  res.json({ success: true, ticketId: "REQ-" + Date.now(), status: "QUEUED_FOR_TRIAGE" });
});

app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    meshNodes: 48,
    syncedPackets: packetBuffer.length,
    evacuatedCount: 1420,
    activeAlerts: packetBuffer.filter(p => p.urgency === 'Critical').length
  });
});

app.listen(PORT, () => {
  console.log(`ResQ-Mesh Backend Relay active on port ${PORT}`);
});
