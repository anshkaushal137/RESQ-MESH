# Backend - ResQ Mesh

This directory contains the server-side architecture, APIs, and business logic for ResQ Mesh.

## Overview
ResQ-Mesh provides a resilient, decentralized emergency dispatch architecture designed for zero-connectivity disaster zones using edge-first store-and-forward mesh topology with disk persistence, priority-based cloud synchronization, and real-time GIS tactical tracking.

---

## ⚡ Core Architecture & Ingestion Flow

```text
[Field Unit / Tactical Patrol SOS]
           │
           ▼ (Zero-Internet Edge Relay)
┌────────────────────────────────────────────────────────┐
│  ResQ-Mesh Local Relay Node (Express.js / Node.js)     │
│  ├── Multi-Hop Ingestion & Deduplication Hash Check    │
│  ├── Local Disk Persistence Engine (buffer.json)       │
│  ├── Weighted Priority Queue Engine (Critical > Low)   │
│  └── Storage Maintenance & Safe Purge API              │
└────────────────────────────────────────────────────────┘
           │
           ▼ (Manual Force-Sync / Internet Recovery)
┌────────────────────────────────────────────────────────┐
│  Google Cloud Firestore Database                       │
│  └── Broadcast to Central Search & Rescue Command     │
└────────────────────────────────────────────────────────┘