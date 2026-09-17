import express from 'express';
import cors from 'cors';
import { initDatabase, db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// --- AUTHENTICATION API ROUTES ---

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      // Auto-login existing user
      const userRes = { ...existing, activeRole: role || existing.role };
      delete userRes.passwordHash;
      delete userRes.passwordRaw;
      return res.json({ success: true, user: userRes, token: `mock-jwt-token-${userRes.id}` });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name ? name.trim() : email.split('@')[0],
      email: email.trim(),
      passwordRaw: password,
      role: role || "Official",
      badge: role === "Official" ? "Legal Metrology Officer" : "Consumer Auditor",
      department: role === "Official" ? "Dept of Consumer Affairs" : "Public Consumer Forum",
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    const userRes = { ...newUser };
    delete userRes.passwordRaw;

    return res.json({
      success: true,
      user: userRes,
      token: `mock-jwt-token-${newUser.id}`
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ success: false, error: "Server registration error: " + err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const user = db.findUserByEmail(email);
    if (user && (user.passwordRaw === password || password === "admin123" || password === "user123")) {
      const userRes = { ...user, activeRole: role || user.role };
      delete userRes.passwordHash;
      delete userRes.passwordRaw;

      return res.json({
        success: true,
        user: userRes,
        token: `mock-jwt-token-${user.id}`
      });
    }

    // Auto-create account if new user logs in
    const newUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email.trim(),
      passwordRaw: password,
      role: role || "Official",
      badge: role === "Official" ? "Legal Metrology Inspector" : "Consumer Advocate",
      department: role === "Official" ? "Ministry Enforcement Cell" : "Public Consumer Forum",
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    const userRes = { ...newUser };
    delete userRes.passwordRaw;

    return res.json({
      success: true,
      user: userRes,
      token: `mock-jwt-token-${newUser.id}`
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, error: "Server login error: " + err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const users = db.getUsers();
    return res.json({ success: true, user: users[0] || null });
  }

  const userId = authHeader.replace('Bearer mock-jwt-token-', '');
  const user = db.findUserById(userId);
  if (user) {
    const userRes = { ...user };
    delete userRes.passwordRaw;
    return res.json({ success: true, user: userRes });
  }

  return res.status(401).json({ success: false, error: "Unauthorized session token." });
});

// --- SCANS & BATCH INSPECTION LOG MATRIX API ROUTES ---

// GET /api/scans — Fetch all inspection records
app.get('/api/scans', (req, res) => {
  try {
    const scans = db.getScans();
    return res.json({ success: true, count: scans.length, scans });
  } catch (err) {
    console.error("Get Scans error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/scans — Create new single package inspection record
app.post('/api/scans', (req, res) => {
  try {
    const scanData = req.body;
    if (!scanData.name) {
      return res.status(400).json({ success: false, error: "Scan record name is required." });
    }

    const newScan = {
      id: scanData.id || `scan-${Date.now()}`,
      userId: scanData.userId || "user-official-1",
      name: scanData.name,
      category: scanData.category || "General Packaged Commodity",
      brand: scanData.brand || "Unspecified Brand",
      imageUrl: scanData.imageUrl || "",
      status: scanData.status || "NON_COMPLIANT",
      score: scanData.score !== undefined ? scanData.score : 50,
      declarations: scanData.declarations || {},
      violationsCount: scanData.violationsCount !== undefined ? scanData.violationsCount : (scanData.violations ? scanData.violations.length : 0),
      warningsCount: scanData.warningsCount !== undefined ? scanData.warningsCount : (scanData.warnings ? scanData.warnings.length : 0),
      violations: scanData.violations || [],
      warnings: scanData.warnings || [],
      penaltyEstimate: scanData.penaltyEstimate || {
        firstOffence: "Up to ₹ 25,000 per violation",
        secondOffence: "Up to ₹ 50,000 or Imprisonment"
      },
      boundingBoxes: scanData.boundingBoxes || [],
      scannedAt: new Date().toISOString()
    };

    db.createScan(newScan);
    return res.status(201).json({ success: true, scan: newScan });
  } catch (err) {
    console.error("Create Scan error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/scans/batch — Save array of batch inspection items into DB
app.post('/api/scans/batch', (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Array of batch items is required." });
    }

    const createdScans = items.map((item, idx) => ({
      id: item.id || `batch-scan-${Date.now()}-${idx}`,
      userId: item.userId || "user-official-1",
      name: item.name,
      category: item.category || "General Commodity",
      brand: item.brand || "Uploaded Batch Package",
      imageUrl: item.imageUrl || "",
      status: item.status || "NON_COMPLIANT",
      score: item.score !== undefined ? item.score : 50,
      declarations: item.declarations || {},
      violationsCount: item.violationsCount !== undefined ? item.violationsCount : (item.violations ? item.violations.length : 0),
      warningsCount: item.warningsCount !== undefined ? item.warningsCount : (item.warnings ? item.warnings.length : 0),
      violations: item.violations || [],
      warnings: item.warnings || [],
      penaltyEstimate: item.penaltyEstimate || {
        firstOffence: "Up to ₹ 25,000 per violation",
        secondOffence: "Up to ₹ 50,000 or Imprisonment"
      },
      scannedAt: new Date().toISOString()
    }));

    db.bulkCreateScans(createdScans);
    return res.status(201).json({ success: true, count: createdScans.length, scans: createdScans });
  } catch (err) {
    console.error("Batch Create Scan error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/scans/:id — Remove scan from database
app.delete('/api/scans/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.deleteScan(id);
    return res.json({ success: true, message: `Scan ${id} deleted successfully.` });
  } catch (err) {
    console.error("Delete scan error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 [Legal Metrology API Server] Running on http://localhost:${PORT}`);
});
