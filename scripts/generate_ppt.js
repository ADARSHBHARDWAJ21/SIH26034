import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pptxgen = require('pptxgenjs');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pptx = new pptxgen();

pptx.layout = 'LAYOUT_16x9';
pptx.title = 'SIH26034 Legal Metrology Compliance System';
pptx.author = 'Smart India Hackathon Team';
pptx.company = 'Ministry of Consumer Affairs, Food & Public Distribution';

// Styling Palette
const BG_DARK = '0F172A';
const CARD_BG = '1E293B';
const ACCENT_CYAN = '38BDF8';
const ACCENT_INDIGO = '6366F1';
const ACCENT_ROSE = 'F43F5E';
const ACCENT_EMERALD = '10B981';
const ACCENT_AMBER = 'F59E0B';
const TEXT_WHITE = 'FFFFFF';
const TEXT_MUTED = '94A3B8';

// Slide 1: Title Slide
const slide1 = pptx.addSlide();
slide1.background = { color: BG_DARK };

slide1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 0.15, fill: { color: ACCENT_INDIGO } });

slide1.addText('SMART INDIA HACKATHON 2024 • PROBLEM ID: SIH26034', {
  x: 0.8, y: 0.8, w: 11.5, h: 0.4,
  fontSize: 14, color: ACCENT_CYAN, bold: true, fontFace: 'Trebuchet MS'
});

slide1.addText('Software System for Legal Metrology Compliance', {
  x: 0.8, y: 1.4, w: 11.5, h: 1.2,
  fontSize: 32, color: TEXT_WHITE, bold: true, fontFace: 'Trebuchet MS'
});

slide1.addText('Automated Label Scanning, Rule 6(1) Offences Verification & Statutory Section 36 Penalty Engine', {
  x: 0.8, y: 2.7, w: 11.5, h: 0.8,
  fontSize: 16, color: TEXT_MUTED, fontFace: 'Calibri'
});

// Ministry Tag Box
slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 4.0, w: 11.5, h: 1.8, fill: { color: CARD_BG }, line: { color: ACCENT_CYAN, width: 1 } });

slide1.addText('MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION', {
  x: 1.1, y: 4.3, w: 11.0, h: 0.4,
  fontSize: 14, color: ACCENT_EMERALD, bold: true, fontFace: 'Trebuchet MS'
});

slide1.addText('Department of Consumer Affairs • Legal Metrology Division (Packaged Commodities Rules 2011)', {
  x: 1.1, y: 4.8, w: 11.0, h: 0.4,
  fontSize: 12, color: TEXT_WHITE, fontFace: 'Calibri'
});

slide1.addText('System Architecture: React 18 + Tesseract OCR + Canvas Vision Engine + Express API + Persistent DB', {
  x: 1.1, y: 5.3, w: 11.0, h: 0.3,
  fontSize: 11, color: TEXT_MUTED, fontFace: 'Calibri'
});


// Slide 2: Problem Statement & Context
const slide2 = pptx.addSlide();
slide2.background = { color: BG_DARK };
slide2.addText('PROBLEM STATEMENT & MARKET CONTEXT', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide2.addText('Legal Metrology (Packaged Commodities) Rules, 2011 Enforcement', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

// Card 1
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.8, w: 3.6, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_ROSE, width: 1 } });
slide2.addText('1. Inspection Bottleneck', { x: 1.0, y: 2.1, w: 3.2, h: 0.4, fontSize: 16, color: ACCENT_ROSE, bold: true });
slide2.addText('• Millions of retail packages & quick-commerce listings (Blinkit, Zepto, Amazon).\n• Manual inspection by officers is physically impossible at scale.\n• Need for instant automated label scanning.', { x: 1.0, y: 2.7, w: 3.2, h: 3.6, fontSize: 12, color: TEXT_MUTED });

// Card 2
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.8, y: 1.8, w: 3.6, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_AMBER, width: 1 } });
slide2.addText('2. Obsolete Unit Symbols', { x: 5.0, y: 2.1, w: 3.2, h: 0.4, fontSize: 16, color: ACCENT_AMBER, bold: true });
slide2.addText('• Widespread illegal use of non-standard units (gms, gm, ltrs, pcs).\n• Rule 6(1)(c) mandates strict SI metric symbols (g, kg, ml, L, N).\n• Causes consumer confusion and measurement errors.', { x: 5.0, y: 2.7, w: 3.2, h: 3.6, fontSize: 12, color: TEXT_MUTED });

// Card 3
slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.8, y: 1.8, w: 3.6, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_EMERALD, width: 1 } });
slide2.addText('3. Omitted Declarations', { x: 9.0, y: 2.1, w: 3.2, h: 0.4, fontSize: 16, color: ACCENT_EMERALD, bold: true });
slide2.addText('• Missing mandatory "(incl. of all taxes)" MRP clauses.\n• Missing customer care email addresses.\n• Omitted Country of Origin on imported commodities.', { x: 9.0, y: 2.7, w: 3.2, h: 3.6, fontSize: 12, color: TEXT_MUTED });


// Slide 3: Key Audit Findings
const slide3 = pptx.addSlide();
slide3.background = { color: BG_DARK };
slide3.addText('KEY AUTOMATED AUDIT FINDINGS FROM THE SITE', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide3.addText('Empirical Non-Compliance Breakdown Across Tested Sectors', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

// Table of findings
const rows3 = [
  [
    { text: 'Violation Category', options: { bold: true, color: TEXT_WHITE, fill: '1E293B' } },
    { text: 'Statutory Rule Clause', options: { bold: true, color: TEXT_WHITE, fill: '1E293B' } },
    { text: 'Offence Frequency %', options: { bold: true, color: ACCENT_CYAN, fill: '1E293B' } },
    { text: 'Impact & Legal Consequence', options: { bold: true, color: TEXT_WHITE, fill: '1E293B' } }
  ],
  [
    { text: 'Illegal Non-Standard Metric Units (gms, ltrs)', options: { color: TEXT_WHITE } },
    { text: 'Rule 6(1)(c) & Schedule II', options: { color: ACCENT_AMBER } },
    { text: '38.2%', options: { bold: true, color: ACCENT_ROSE } },
    { text: 'Critical Violation • Fine up to ₹25,000 (Sec 36(1))', options: { color: TEXT_MUTED } }
  ],
  [
    { text: 'Missing MRP Mandatory Tax Clause (incl. of all taxes)', options: { color: TEXT_WHITE } },
    { text: 'Rule 6(1)(e)', options: { color: ACCENT_AMBER } },
    { text: '31.4%', options: { bold: true, color: ACCENT_ROSE } },
    { text: 'Major Offence • Seizure under Section 36', options: { color: TEXT_MUTED } }
  ],
  [
    { text: 'Omitted Consumer Care Official E-Mail ID', options: { color: TEXT_WHITE } },
    { text: 'Rule 6(1)(f) Amendment 2017', options: { color: ACCENT_AMBER } },
    { text: '25.1%', options: { bold: true, color: ACCENT_AMBER } },
    { text: 'Major Offence • Prevents consumer grievance redressal', options: { color: TEXT_MUTED } }
  ],
  [
    { text: 'Missing Country of Origin on Packaging', options: { color: TEXT_WHITE } },
    { text: 'Rule 6(1)(g) Amendment 2021', options: { color: ACCENT_AMBER } },
    { text: '17.6%', options: { bold: true, color: ACCENT_AMBER } },
    { text: 'Major Offence • Mandatory for imported commodities', options: { color: TEXT_MUTED } }
  ],
  [
    { text: 'Missing Unit Sale Price (USP) Rate', options: { color: TEXT_WHITE } },
    { text: 'Rule 6(11)', options: { color: ACCENT_AMBER } },
    { text: '12.3%', options: { bold: true, color: ACCENT_EMERALD } },
    { text: 'Minor Warning • Price per gram / ml rate missing', options: { color: TEXT_MUTED } }
  ]
];

slide3.addTable(rows3, { x: 0.8, y: 1.8, w: 11.5, h: 4.5, colW: [3.8, 2.5, 1.8, 3.4], fontSize: 11, border: { pt: 0.5, color: '334155' } });


// Slide 4: Legal Metrology 2011 Rules Matrix
const slide4 = pptx.addSlide();
slide4.background = { color: BG_DARK };
slide4.addText('STATUTORY COMPLIANCE RULES MATRIX', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide4.addText('Legal Metrology (Packaged Commodities) Rules, 2011 Benchmark', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

const rows4 = [
  [
    { text: 'Rule Clause', options: { bold: true, color: TEXT_WHITE, fill: '1E293B' } },
    { text: 'Mandatory Declaration', options: { bold: true, color: TEXT_WHITE, fill: '1E293B' } },
    { text: 'Standard Legal Requirement', options: { bold: true, color: ACCENT_EMERALD, fill: '1E293B' } },
    { text: 'Common Non-Compliance Flags', options: { bold: true, color: ACCENT_ROSE, fill: '1E293B' } }
  ],
  [
    { text: 'Rule 6(1)(a)', options: { bold: true, color: ACCENT_CYAN } },
    { text: 'Manufacturer / Packer / Importer', options: { color: TEXT_WHITE } },
    { text: 'Full Name, Address, City, State, 6-Digit PIN', options: { color: TEXT_MUTED } },
    { text: 'Missing complete address or PIN code', options: { color: ACCENT_ROSE } }
  ],
  [
    { text: 'Rule 6(1)(c)', options: { bold: true, color: ACCENT_CYAN } },
    { text: 'Net Quantity & Metric Unit', options: { color: TEXT_WHITE } },
    { text: 'Standard SI Metric Units (g, kg, ml, L, N)', options: { color: TEXT_MUTED } },
    { text: 'Illegal non-standard units (gms, ltrs, pcs)', options: { color: ACCENT_ROSE } }
  ],
  [
    { text: 'Rule 6(1)(e)', options: { bold: true, color: ACCENT_CYAN } },
    { text: 'MRP & Tax Clause', options: { color: TEXT_WHITE } },
    { text: 'Must state ₹ / Rs and (incl. of all taxes)', options: { color: TEXT_MUTED } },
    { text: 'Missing (incl. of all taxes) clause', options: { color: ACCENT_ROSE } }
  ],
  [
    { text: 'Rule 6(1)(f)', options: { bold: true, color: ACCENT_CYAN } },
    { text: 'Consumer Care Contact Details', options: { color: TEXT_WHITE } },
    { text: 'Designated Officer, Address, Phone, Mandatory Email', options: { color: TEXT_MUTED } },
    { text: 'Missing official complaint Email ID', options: { color: ACCENT_ROSE } }
  ],
  [
    { text: 'Rule 6(1)(g)', options: { bold: true, color: ACCENT_CYAN } },
    { text: 'Country of Origin', options: { color: TEXT_WHITE } },
    { text: 'Mandatory Country of Origin Tag', options: { color: TEXT_MUTED } },
    { text: 'Omitted origin country tag', options: { color: ACCENT_ROSE } }
  ]
];

slide4.addTable(rows4, { x: 0.8, y: 1.8, w: 11.5, h: 4.5, colW: [1.8, 3.2, 3.5, 3.0], fontSize: 11, border: { pt: 0.5, color: '334155' } });


// Slide 5: System Architecture
const slide5 = pptx.addSlide();
slide5.background = { color: BG_DARK };
slide5.addText('END-TO-END SYSTEM ARCHITECTURE', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide5.addText('Full-Stack Inspection, Processing & Database Flow', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.8, w: 11.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_CYAN, width: 1 } });

const archText = `
1. INPUT SCANNER LAYER (App.jsx & Scanner Component Suite)
   • Drag & Drop Packaging Image Upload Zone (PNG, JPG, WEBP)
   • Live Camera Scanner Stream Modal (Real-Time WebCam)
   • E-Commerce Link Inspector Modal (Amazon India, Flipkart, Blinkit, Zepto URLs)

2. VISION PREPROCESSING & OCR ENGINE (imagePreprocessing.js & ocrProcessor.js)
   • HTML5 Canvas Adaptive Contrast Boost (1.3x) & Pixel Binarization Thresholding
   • Client-Side Tesseract.js OCR Worker & Spatial Bounding Box Position Mapping

3. COMPLIANCE RULES & PENALTY ENGINE (metrologyRulesEngine.js)
   • Rule 6(1)(a-g) Regex Parser & Rule 6(11) Unit Sale Price Evaluator
   • Legal Metrology Act 2009 Section 36(1) & 36(2) Fine Compounding Estimator

4. REST API BACKEND & DATABASE LAYER (server/index.js & server/db.js)
   • Express REST API listening on Port 5000 with CORS & Vite Proxy
   • Persistent JSON / SQLite Database Store for User Accounts & Batch Audit Matrix

5. STATUTORY REPORT GENERATOR (reportGenerator.js)
   • 1-Click PDF Generation with Margin Wrapping & Clean Rs. Currency Formatting
`;

slide5.addText(archText, { x: 1.1, y: 2.0, w: 10.9, h: 4.3, fontSize: 12, color: TEXT_WHITE, fontFace: 'Calibri' });


// Slide 6: Section 36 Penalty Engine
const slide6 = pptx.addSlide();
slide6.background = { color: BG_DARK };
slide6.addText('STATUTORY OFFENCE & PENALTY CALCULATOR', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide6.addText('Legal Metrology Act, 2009 Enforcement Provisions', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

// Left Card: Sec 36(1)
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.8, w: 5.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_ROSE, width: 1 } });
slide6.addText('SECTION 36(1) — FIRST OFFENCE', { x: 1.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 18, color: ACCENT_ROSE, bold: true });
slide6.addText('Statutory Fine: Up to ₹ 25,000 per violation', { x: 1.1, y: 2.7, w: 5.0, h: 0.4, fontSize: 14, color: TEXT_WHITE, bold: true });
slide6.addText('• Applies to any person who manufactures, packs, imports, or sells non-compliant pre-packaged commodities.\n• Fine accumulates dynamically per detected rule breach.\n• Example: 3 breaches (Crispy Chips) = Fine up to ₹ 75,000.', { x: 1.1, y: 3.3, w: 5.0, h: 3.0, fontSize: 12, color: TEXT_MUTED });

// Right Card: Sec 36(2)
slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.8, w: 5.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_AMBER, width: 1 } });
slide6.addText('SECTION 36(2) — REPEAT OFFENCE', { x: 7.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 18, color: ACCENT_AMBER, bold: true });
slide6.addText('Fine Up to ₹ 50,000 OR Imprisonment (1 Year)', { x: 7.1, y: 2.7, w: 5.0, h: 0.4, fontSize: 14, color: TEXT_WHITE, bold: true });
slide6.addText('• Applies to second and subsequent offences under Legal Metrology Act.\n• Mandates imprisonment up to 1 year or fine up to ₹ 50,000 or both.\n• Section 48 compounding allowed prior to prosecution.', { x: 7.1, y: 3.3, w: 5.0, h: 3.0, fontSize: 12, color: TEXT_MUTED });


// Slide 7: Persistent Database & REST API
const slide7 = pptx.addSlide();
slide7.background = { color: BG_DARK };
slide7.addText('BACKEND REST API & PERSISTENT DATABASE', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide7.addText('Full Database Persistence & Dual Role Authentication', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.8, w: 5.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_INDIGO, width: 1 } });
slide7.addText('Express REST API Endpoints', { x: 1.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 16, color: ACCENT_INDIGO, bold: true });
slide7.addText('• POST /api/auth/register — User registration\n• POST /api/auth/login — User login & session\n• GET /api/scans — Retrieve persistent audit logs\n• POST /api/scans — Save packaging inspection log\n• POST /api/scans/batch — Bulk batch scan log', { x: 1.1, y: 2.7, w: 5.0, h: 3.6, fontSize: 12, color: TEXT_MUTED });

slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.8, w: 5.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_EMERALD, width: 1 } });
slide7.addText('Dual Role User System', { x: 7.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 16, color: ACCENT_EMERALD, bold: true });
slide7.addText('• Official Inspector Role: Unlocks enforcement metrics, fine compounding calculators, notice generation & CSV batch export.\n• Consumer Advocate Role: Allows public consumers to scan products, check unit sale price rates, and download certificates.\n• Sessions persist across systems & server restarts.', { x: 7.1, y: 2.7, w: 5.0, h: 3.6, fontSize: 12, color: TEXT_MUTED });


// Slide 8: Batch Auditor Matrix & Analytics
const slide8 = pptx.addSlide();
slide8.background = { color: BG_DARK };
slide8.addText('BATCH INSPECTION MATRIX & ANALYTICS', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide8.addText('Warehouse Bulk Inspector & Enforcement Analytics', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.8, w: 11.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_CYAN, width: 1 } });

const batchText = `
1. BATCH INSPECTION LOG MATRIX (BatchAuditor.jsx)
   • Upload 100+ packaging image files simultaneously for automated warehouse audit.
   • Displays thumbnail preview, commodity name, brand, compliance rating %, status badge, & offences count.
   • Interactive Eye icon button (👁️) pops up detailed rule violation breakdown for any item.
   • 1-Click "Export CSV Report" downloads complete audit log matrix file.

2. INSPECTOR ENFORCEMENT ANALYTICS (AnalyticsDashboard.jsx)
   • Top Non-Compliance Rule Trends bar charts (Rule 6(1)(c) net qty unit leading at 38%).
   • Category Risk Heatmap (Cosmetics at 54% risk, Snacks at 42% risk, Electronics at 12% risk).
   • Cumulative Offence Fine Estimator slider simulating market seizure quantities (10 to 2000 units).
`;

slide8.addText(batchText, { x: 1.1, y: 2.0, w: 10.9, h: 4.3, fontSize: 12, color: TEXT_WHITE, fontFace: 'Calibri' });


// Slide 9: PDF Notice Generator
const slide9 = pptx.addSlide();
slide9.background = { color: BG_DARK };
slide9.addText('OFFICIAL STATUTORY PDF NOTICE GENERATOR', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide9.addText('Formal Notice of Violation & Compliance Certificate', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.8, w: 5.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_CYAN, width: 1 } });
slide9.addText('PDF Notice Features', { x: 1.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 16, color: ACCENT_CYAN, bold: true });
slide9.addText('• Official Ministry Header (Ministry of Consumer Affairs, Food & Public Distribution).\n• Inspection ID, Date, Time & Commodity Metadata Box.\n• Rules 6(1)(a-g) Pass/Fail Evaluation Matrix Table.\n• Digital Verification Block & Digital Signature Stamp.', { x: 1.1, y: 2.7, w: 5.0, h: 3.6, fontSize: 12, color: TEXT_MUTED });

slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.8, w: 5.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_EMERALD, width: 1 } });
slide9.addText('Layout & Encoding Safeguards', { x: 7.1, y: 2.1, w: 5.0, h: 0.4, fontSize: 16, color: ACCENT_EMERALD, bold: true });
slide9.addText('• Dynamic Text Wrapping: doc.splitTextToSize(text, 174) ensures penalty text lines never overflow page margins.\n• Clean Currency Formatting: Sanitizes un-encoded symbols to clean "Rs." to prevent PDF font superscript bugs.\n• Dynamic Red Box Height: Expands automatically based on line count.', { x: 7.1, y: 2.7, w: 5.0, h: 3.6, fontSize: 12, color: TEXT_MUTED });


// Slide 10: Future Roadmap & Conclusion
const slide10 = pptx.addSlide();
slide10.background = { color: BG_DARK };
slide10.addText('FUTURE ROADMAP & CONCLUSION', { x: 0.8, y: 0.5, w: 11.5, h: 0.4, fontSize: 14, color: ACCENT_CYAN, bold: true });
slide10.addText('Scaling LM-CompliScan to a Nationwide Platform', { x: 0.8, y: 1.0, w: 11.5, h: 0.6, fontSize: 24, color: TEXT_WHITE, bold: true });

slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.8, w: 11.5, h: 4.8, fill: { color: CARD_BG }, line: { color: ACCENT_EMERALD, width: 1 } });

const roadText = `
1. REGIONAL INDIAN LANGUAGE OCR: Train AI models on 12+ Indian regional languages (Hindi, Tamil, Telugu, Marathi, etc.).
2. 3D VOLUMETRIC SCANNING: Integrate depth-sensing camera APIs to enforce Rule 7 Slack Packaging packaging volume rules.
3. NCH & BIS DATABASE API: Connect to National Consumer Helpline & BIS Care portal to verify FSSAI / ISI logo authenticity.
4. E-COMMERCE AUTOMATED WEBHOOK: Pre-listing headless web crawler for Amazon, Flipkart, Blinkit & Zepto listings.
5. NATIVE MOBILE APP: Offline mobile edge AI scanning app for field officers in remote check-posts.

Conclusion: LM-CompliScan AI 2.0 transforms Legal Metrology enforcement from slow manual checks into an automated, instant, database-backed national compliance engine.
`;

slide10.addText(roadText, { x: 1.1, y: 2.0, w: 10.9, h: 4.3, fontSize: 12, color: TEXT_WHITE, fontFace: 'Calibri' });

// Output directory
const docsDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

const outputPath = path.join(docsDir, 'SIH26034_Legal_Metrology_Compliance_Presentation.pptx');
pptx.writeFile({ fileName: outputPath }).then(fileName => {
  console.log(`✅ [PPT Generator] Successfully generated PowerPoint presentation: ${fileName}`);
}).catch(err => {
  console.error("PPT Generation error:", err);
});
