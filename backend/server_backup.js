import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// In-Memory Store-and-Forward Mesh Queue (Offline Buffer)
let meshQueue = [
  {
    id: 'pkt-init-001',
    nodeId: 'NODE-RELAY-01',
    type: 'ALERT',
    severity: 'MEDIUM',
    message: 'ResQ-Mesh Local Node Synchronized',
    lat: 26.4499,
    lng: 80.3319,
    hops: 1,
    syncedToCloud: false,
    timestamp: new Date().toISOString()
  }
];

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    relayNode: 'ACTIVE',
    bufferedPackets: meshQueue.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Tactical map & Alerts fetch endpoint
app.get('/api/mesh/packets', (req, res) => {
  res.status(200).json({
    success: true,
    total: meshQueue.length,
    packets: meshQueue
  });
});

// 3. Incoming Mesh Packet Relay endpoint (Store-and-Forward)
app.post('/api/mesh/packet', (req, res) => {
  const { senderId, type, severity, payload, lat, lng, hops } = req.body;

  const packet = {
    id: `pkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    nodeId: senderId || `NODE-${Math.floor(1000 + Math.random() * 9000)}`,
    type: type || 'TELEMETRY',
    severity: severity || 'LOW',
    message: payload || 'Mesh relay data hop',
    lat: lat ? parseFloat(lat) : 26.4499,
    lng: lng ? parseFloat(lng) : 80.3319,
    hops: (hops || 0) + 1,
    syncedToCloud: false,
    timestamp: new Date().toISOString()
  };

  meshQueue.unshift(packet);
  console.log(`[MESH RELAY] Packet forwarded from ${packet.nodeId} | Hops: ${packet.hops}`);

  res.status(201).json({
    success: true,
    message: 'Packet buffered in local mesh relay',
    packet
  });
});

// 4. Critical SOS Emergency Trigger endpoint
app.post('/api/sos', (req, res) => {
  const { lat, lng, type, severity, description } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      error: 'Latitude and Longitude are mandatory for SOS dispatch'
    });
  }

  const sosAlert = {
    id: `sos-${Date.now()}`,
    nodeId: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    type: type || 'CRITICAL_DISASTER',
    severity: severity || 'CRITICAL',
    description: description || 'Immediate rescue required',
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    hops: 0,
    syncedToCloud: false,
    timestamp: new Date().toISOString()
  };

  meshQueue.unshift(sosAlert);
  console.log(`🚨 [SOS DISPATCH] Priority Alert at (${lat}, ${lng}) - Type: ${sosAlert.type}`);

  res.status(201).json({
    success: true,
    message: 'SOS signal registered in relay network',
    alert: sosAlert
  });
});

// Server Listen
app.listen(PORT, () => {
  console.log(`⚡ ResQ Mesh Local Relay Node active on http://localhost:${PORT}`);
});