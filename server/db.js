import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'metrology_database.json');

// Initial seed benchmark data & demo user accounts
const INITIAL_SEED = {
  users: [
    {
      id: "user-official-1",
      name: "Rajesh Kumar (Senior Inspector)",
      email: "inspector@metrology.gov.in",
      passwordHash: "$2a$10$wT0cWfXvJ9gQ8kY2pZ1qOuG5uD9zE3xV7bN1mK3jL5hG9fD1sS3aK", // demo hash
      passwordRaw: "admin123",
      role: "Official",
      badge: "Senior Legal Metrology Officer",
      department: "Department of Consumer Affairs, New Delhi",
      createdAt: new Date().toISOString()
    },
    {
      id: "user-consumer-1",
      name: "Ananya Sharma",
      email: "consumer@gmail.com",
      passwordHash: "$2a$10$wT0cWfXvJ9gQ8kY2pZ1qOuG5uD9zE3xV7bN1mK3jL5hG9fD1sS3aK",
      passwordRaw: "user123",
      role: "Consumer",
      badge: "Verified Consumer Auditor",
      department: "Consumer Grievance Forum",
      createdAt: new Date().toISOString()
    }
  ],
  scans: [
    {
      id: "sample-1",
      userId: "user-official-1",
      name: "Crispy Crunch Potato Chips 150g",
      category: "Snack Foods",
      brand: "Snacko Foods Pvt Ltd",
      imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80",
      status: "NON_COMPLIANT",
      score: 62,
      declarations: {
        manufacturer: { found: true, text: "Snacko Foods Pvt Ltd, Industrial Area Phase 2, Pune - 411057" },
        commodity: { found: true, text: "Crispy Crunch Potato Chips" },
        netQuantity: { found: true, text: "150 gms", isValidUnit: false, unitFound: "gms", standardUnit: "g" },
        mfgDate: { found: true, text: "05/2026", formatValid: true },
        mrp: { found: true, text: "Rs 45.00", taxClauseFound: false, currencyFound: true },
        consumerCare: { found: true, text: "Manager at above address, Ph: 1800-123-4567", emailFound: false, phoneFound: true },
        countryOfOrigin: { found: true, text: "India" },
        unitSalePrice: { found: false, text: null }
      },
      violationsCount: 3,
      warningsCount: 1,
      violations: [
        { ruleNo: "Rule 6(1)(c)", field: "Net Quantity Standard Unit", severity: "CRITICAL", message: "Illegal non-standard unit 'gms'. Standard SI unit required: 'g'.", legalRef: "Rule 6(1)(c)" },
        { ruleNo: "Rule 6(1)(e)", field: "MRP Tax Clause", severity: "MAJOR", message: "Missing mandatory tax clause '(incl. of all taxes)'.", legalRef: "Rule 6(1)(e)" },
        { ruleNo: "Rule 6(1)(f)", field: "Consumer Care Email", severity: "MAJOR", message: "Missing official e-mail ID for consumer complaints.", legalRef: "Rule 6(1)(f)" }
      ],
      warnings: [
        { ruleNo: "Rule 6(11)", field: "Unit Sale Price", severity: "MINOR", message: "Unit Sale Price not declared on package front." }
      ],
      penaltyEstimate: {
        firstOffence: "Up to ₹ 75,000 (3 breaches)",
        secondOffence: "Up to ₹ 1,50,000 or Imprisonment",
        legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
      },
      scannedAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: "sample-2",
      userId: "user-official-1",
      name: "Pure Harvest Organic Almond Milk 1L",
      category: "Beverages",
      brand: "Harvest Organics Ltd",
      imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
      status: "COMPLIANT",
      score: 98,
      declarations: {
        manufacturer: { found: true, text: "Harvest Organics Ltd, Mysuru" },
        commodity: { found: true, text: "Pure Harvest Almond Milk" },
        netQuantity: { found: true, text: "1 L", isValidUnit: true, unitFound: "L", standardUnit: "L" },
        mfgDate: { found: true, text: "08/2026", formatValid: true },
        mrp: { found: true, text: "MRP ₹ 220.00 (incl. of all taxes)", taxClauseFound: true, currencyFound: true },
        consumerCare: { found: true, text: "Executive Officer, Email: care@harvestorganics.in", emailFound: true, phoneFound: true },
        countryOfOrigin: { found: true, text: "India" },
        unitSalePrice: { found: true, text: "₹ 0.22 / ml" }
      },
      violationsCount: 0,
      warningsCount: 0,
      violations: [],
      warnings: [],
      penaltyEstimate: {
        firstOffence: "₹ 0 (Fully Compliant)",
        secondOffence: "₹ 0 (Fully Compliant)",
        legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
      },
      scannedAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: "sample-3",
      userId: "user-consumer-1",
      name: "GlowGoddess Rose Face Serum 30ml",
      category: "Personal Care",
      brand: "Luxe Beauty Corp",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      status: "NON_COMPLIANT",
      score: 45,
      declarations: {
        manufacturer: { found: true, text: "Luxe Beauty Corp, Mumbai" },
        commodity: { found: true, text: "Glow Goddess Rose Serum" },
        netQuantity: { found: true, text: "30 milli-litres", isValidUnit: false, unitFound: "milli-litres", standardUnit: "ml" },
        mfgDate: { found: false, text: null },
        mrp: { found: true, text: "Rs 799", taxClauseFound: false, currencyFound: true },
        consumerCare: { found: true, text: "Customer Support: 9988776655", emailFound: false, phoneFound: true },
        countryOfOrigin: { found: false, text: null },
        unitSalePrice: { found: false, text: null }
      },
      violationsCount: 4,
      warningsCount: 1,
      violations: [
        { ruleNo: "Rule 6(1)(c)", field: "Net Quantity Unit", severity: "CRITICAL", message: "Non-standard unit 'milli-litres'. Mandated: 'ml'.", legalRef: "Rule 6(1)(c)" },
        { ruleNo: "Rule 6(1)(d)", field: "Mfg Date", severity: "MAJOR", message: "Missing Month & Year of Mfg.", legalRef: "Rule 6(1)(d)" },
        { ruleNo: "Rule 6(1)(e)", field: "MRP Tax Clause", severity: "MAJOR", message: "Missing tax clause '(incl. of all taxes)'.", legalRef: "Rule 6(1)(e)" },
        { ruleNo: "Rule 6(1)(g)", field: "Country of Origin", severity: "MAJOR", message: "Missing Country of Origin on imported product.", legalRef: "Rule 6(1)(g)" }
      ],
      warnings: [],
      penaltyEstimate: {
        firstOffence: "Up to ₹ 1,00,000 (4 breaches)",
        secondOffence: "Up to ₹ 2,00,000 or Imprisonment",
        legalSection: "Section 36 of Legal Metrology Act, 2009"
      },
      scannedAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: "sample-4",
      userId: "user-official-1",
      name: "FlexiFit Wireless Earbuds (Pack of 1 N)",
      category: "Electronics",
      brand: "SonicWave Technologies",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      status: "COMPLIANT",
      score: 95,
      declarations: {
        manufacturer: { found: true, text: "SonicWave Tech Pvt Ltd, Noida" },
        commodity: { found: true, text: "FlexiFit Wireless Earbuds" },
        netQuantity: { found: true, text: "1 N", isValidUnit: true, unitFound: "N", standardUnit: "N" },
        mfgDate: { found: true, text: "07/2026", formatValid: true },
        mrp: { found: true, text: "MRP ₹ 1,499.00 (inclusive of all taxes)", taxClauseFound: true, currencyFound: true },
        consumerCare: { found: true, text: "Quality Head, Toll-Free: 1800-444-999, Email: support@sonicwave.in", emailFound: true, phoneFound: true },
        countryOfOrigin: { found: true, text: "Vietnam" },
        unitSalePrice: { found: true, text: "₹ 1,499.00 / N" }
      },
      violationsCount: 0,
      warningsCount: 0,
      violations: [],
      warnings: [],
      penaltyEstimate: {
        firstOffence: "₹ 0 (Fully Compliant)",
        secondOffence: "₹ 0 (Fully Compliant)",
        legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
      },
      scannedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  batch_audits: []
};

export function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2));
    console.log("⚡ [Database] Initialized new Legal Metrology Database file with pre-seeded audit data.");
  } else {
    console.log("⚡ [Database] Connected to existing Legal Metrology Database file.");
  }
}

function readData() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading DB file:", err);
    return INITIAL_SEED;
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing DB file:", err);
  }
}

export const db = {
  // Users Operations
  getUsers: () => readData().users || [],
  findUserByEmail: (email) => {
    const users = readData().users || [];
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  },
  findUserById: (id) => {
    const users = readData().users || [];
    return users.find(u => u.id === id);
  },
  createUser: (userObj) => {
    const data = readData();
    data.users.unshift(userObj);
    writeData(data);
    return userObj;
  },

  // Scans Operations
  getScans: () => readData().scans || [],
  getScanById: (id) => {
    const scans = readData().scans || [];
    return scans.find(s => s.id === id);
  },
  createScan: (scanObj) => {
    const data = readData();
    data.scans.unshift(scanObj);
    writeData(data);
    return scanObj;
  },
  bulkCreateScans: (scanArr) => {
    const data = readData();
    data.scans.unshift(...scanArr);
    writeData(data);
    return scanArr;
  },
  deleteScan: (id) => {
    const data = readData();
    data.scans = data.scans.filter(s => s.id !== id);
    writeData(data);
    return true;
  }
};
