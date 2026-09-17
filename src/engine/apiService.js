/**
 * API Service for Legal Metrology Backend Server
 * Connects Auth and Scan Inspection Log Matrix to persistent Database.
 */

const API_BASE = '/api';

export async function fetchScanLogs() {
  try {
    const res = await fetch(`${API_BASE}/scans`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.scans)) {
      return data.scans;
    }
  } catch (err) {
    console.warn("API Server unavailable, using offline fallback:", err.message);
  }
  return null;
}

export async function saveScanRecord(scanData) {
  try {
    const res = await fetch(`${API_BASE}/scans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success) return data.scan;
  } catch (err) {
    console.warn("Failed to persist scan record to API server:", err.message);
  }
  return scanData;
}

export async function saveBatchScans(batchItems) {
  try {
    const res = await fetch(`${API_BASE}/scans/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: batchItems })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success) return data.scans;
  } catch (err) {
    console.warn("Failed to save batch scans to API server:", err.message);
  }
  return batchItems;
}

export async function loginUserApi(email, password, role = "Official") {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        if (data.token) localStorage.setItem('lm_auth_token', data.token);
        return data;
      }
    }
  } catch (err) {
    console.warn("API Auth unavailable, falling back to local auth:", err.message);
  }
  return null;
}

export async function registerUserApi(name, email, password, role = "Official") {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        if (data.token) localStorage.setItem('lm_auth_token', data.token);
        return data;
      }
    }
  } catch (err) {
    console.warn("API Register unavailable, falling back to local auth:", err.message);
  }
  return null;
}
