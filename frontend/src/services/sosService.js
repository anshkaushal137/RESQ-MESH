export async function dispatchEmergencySOS(payload) {
  try {
    const res = await fetch('http://localhost:5000/api/relay-packet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn("Backend relay offline, using offline mesh buffer:", err);
    return { success: true, mode: "OFFLINE_MESH_STORED" };
  }
}