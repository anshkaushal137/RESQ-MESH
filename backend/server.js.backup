import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUFFER_FILE = path.join(__dirname, 'buffer.json');

// --- FIREBASE CLOUD CONFIG ---
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyReplaceIfDifferent",
  authDomain: "resq-mesh.firebaseapp.com",
  projectId: "resq-mesh",
  storageBucket: "resq-mesh.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

let cloudDb = null;
try {
  const firebaseApp = initializeApp(firebaseConfig);
  cloudDb = getFirestore(firebaseApp);
  console.log('☁️  Firebase Cloud DB Driver initialized');
} catch (fbErr) {
  console.warn('⚠️  Cloud DB init fallback:', fbErr.message);
}

const app = express();
app.use(cors());
app.use(express.json());

// Disk persistence helpers
const readBuffer = () => {
  try {
    if (!fs.existsSync(BUFFER_FILE)) {
      fs.writeFileSync(BUFFER_FILE, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(BUFFER_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Buffer read error:', err.message);
    return [];
  }
};

const writeBuffer = (data) => {
  try {
    fs.writeFileSync(BUFFER_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Buffer write error:', err.message);
  }
};

// Urgency Priority Weights
const PRIORITY_MAP = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

// Coordinate validator
const sanitizeCoords = (locationStr) => {
  let lat = 26.4499;
  let lng = 80.3319;
  if (locationStr && typeof locationStr === 'string' && locationStr.includes(',')) {
    const parts = locationStr.split(',').map(p => parseFloat(p.trim()));
    if (!isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] >= -90 && parts[0] <= 90 && parts[1] >= -180 && parts[1] <= 180) {
      lat = parts[0];
      lng = parts[1];
    }
  }
  return { lat, lng };
};

// 1. Status Check & Node Metrics
app.get('/api/node-status', (req, res) => {
  const buffer = readBuffer();
  const unSynced = buffer.filter(p => !p.syncedToCloud).length;
  res.json({
    online: true,
    totalPackets: buffer.length,
    bufferedPackets: unSynced,
    nodeId: 'RELAY-KANPUR-PRIMARY',
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// 2. Fetch Packets for Tactical Map
app.get('/api/mesh/packets', (req, res) => {
  const buffer = readBuffer();
  res.json({ success: true, packets: buffer });
});

// 3. Packet Ingestion with Deduplication & Hop Routing
app.post('/api/relay-packet', (req, res) => {
  const { id, sender, location, message, urgency, hops, routePath } = req.body;
  const buffer = readBuffer();

  const packetId = id || `pkt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const currentNode = 'RELAY-KANPUR-PRIMARY';

  // Deduplication check
  const existingIndex = buffer.findIndex(p => p.id === packetId);

  if (existingIndex !== -1) {
    const existing = buffer[existingIndex];
    existing.hops = Math.max(existing.hops || 1, (hops || 1) + 1);
    if (!existing.routePath.includes(currentNode)) {
      existing.routePath.push(currentNode);
    }
    writeBuffer(buffer);
    console.log(`[DEDUP] Duplicate packet dropped/updated: ${packetId}`);
    return res.json({ success: true, status: 'duplicate_updated', packet: existing });
  }

  const { lat, lng } = sanitizeCoords(location);

  const newPacket = {
    id: packetId,
    sender: (sender || 'Unknown Unit').trim().substring(0, 50),
    lat,
    lng,
    message: (message || '').trim().substring(0, 500),
    severity: urgency || 'Critical',
    hops: (hops || 0) + 1,
    routePath: Array.isArray(routePath) ? [...routePath, currentNode] : [sender || 'Origin', currentNode],
    timestamp: new Date().toISOString(),
    syncedToCloud: false
  };

  buffer.push(newPacket);
  writeBuffer(buffer);

  console.log(`[MESH INGEST] Packet ${packetId} stored. Priority: ${newPacket.severity} | Hops: ${newPacket.hops}`);
  res.json({ success: true, status: 'stored_locally', packet: newPacket });
});

// 4. Cloud Sync Core Engine (Dono Auto-Sync aur Manual Force-Sync yahi use karenge)
const isInternetConnected = () => {
  return new Promise((resolve) => {
    dns.lookup('1.1.1.1', (err) => {
      resolve(!err);
    });
  });
};

const executeSync = async () => {
  const online = await isInternetConnected();
  if (!online) {
    console.log('[SYNC] Network offline. Packets safely held in local buffer.');
    return { success: false, reason: 'offline' };
  }

  const buffer = readBuffer();
  const unSynced = buffer.filter(p => !p.syncedToCloud);
  if (unSynced.length === 0) return { success: true, syncedCount: 0 };

  // Priority queue sort: Critical -> High -> Medium -> Low
  unSynced.sort((a, b) => {
    const weightA = PRIORITY_MAP[a.severity] || 1;
    const weightB = PRIORITY_MAP[b.severity] || 1;
    return weightB - weightA;
  });

  console.log(`[CLOUD SYNC] Flushing ${unSynced.length} prioritized packets to Central Cloud...`);

  let syncedCount = 0;
  for (const p of unSynced) {
    try {
      if (cloudDb) {
        const docRef = doc(collection(cloudDb, 'requests'), p.id);
        await setDoc(docRef, {
          name: p.sender,
          sender: p.sender,
          message: p.message,
          urgency: p.severity,
          location: `${p.lat}, ${p.lng}`,
          lat: p.lat,
          lng: p.lng,
          hops: p.hops,
          routePath: p.routePath,
          source: 'RESQ_MESH_RELAY',
          syncedAt: serverTimestamp(),
          createdAt: new Date(p.timestamp)
        }, { merge: true });
      }
      p.syncedToCloud = true;
      syncedCount++;
      console.log(`   ✅ Synced: ${p.id} [${p.severity}] from ${p.sender}`);
    } catch (pushErr) {
      console.error(`   ❌ Failed cloud push for ${p.id}:`, pushErr.message);
      break;
    }
  }

  writeBuffer(buffer);
  return { success: true, syncedCount };
};

// 5. MANUAL FORCE SYNC API ENDPOINT (Instant trigger without waiting 10s)
app.post('/api/mesh/force-sync', async (req, res) => {
  console.log('⚡ [MANUAL SYNC TRIGGERED] Received instant sync request from Tactical Dashboard...');
  const result = await executeSync();
  res.json(result);
});

// 6. Maintenance: Purge Synced Packets
app.post('/api/mesh/clear-synced', (req, res) => {
  const buffer = readBuffer();
  const remaining = buffer.filter(p => !p.syncedToCloud);
  const purgedCount = buffer.length - remaining.length;
  writeBuffer(remaining);
  console.log(`[MAINTENANCE] Purged ${purgedCount} already-synced packets.`);
  res.json({ success: true, purgedCount, remainingCount: remaining.length });
});

// Background Auto-Sync Worker (Runs every 10 seconds)
setInterval(executeSync, 10000);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`⚡ ResQ Mesh Local Relay Node active on http://localhost:5000`);
});