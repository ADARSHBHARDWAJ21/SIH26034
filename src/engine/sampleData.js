// Benchmark sample dataset of packaged commodities with complete dynamic violations & warnings data

export const BENCHMARK_SAMPLES = [
  {
    id: "sample-1",
    name: "Crispy Crunch Potato Chips 150g",
    category: "Snack Foods",
    brand: "Snacko Foods Pvt Ltd",
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80",
    status: "NON_COMPLIANT",
    score: 62,
    rawOcrText: `CRISPY CRUNCH POTATO CHIPS
Net Qty: 150 gms
Mfg Date: 05/2026
MRP: Rs 45.00
Packed by: Snacko Foods Pvt Ltd, Industrial Area Phase 2, Pune - 411057
For complaints contact: Manager at above address, Ph: 1800-123-4567
Country of Origin: India`,
    violationsCount: 3,
    warningsCount: 1,
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
    violations: [
      {
        ruleNo: "Rule 6(1)(c)",
        field: "Net Quantity Standard Unit",
        severity: "CRITICAL",
        message: "Illegal non-standard unit 'gms'. Legal Metrology Rules mandate standard SI symbols: 'g', 'kg', 'ml', 'l' / 'L', 'N' or 'U'.",
        legalRef: "Rule 6(1)(c) read with Schedule II"
      },
      {
        ruleNo: "Rule 6(1)(e)",
        field: "MRP Mandatory Tax Clause",
        severity: "MAJOR",
        message: "MRP declaration is missing mandatory clause '(incl. of all taxes)' or 'inclusive of all taxes'.",
        legalRef: "Rule 6(1)(e) Legal Metrology Rules 2011"
      },
      {
        ruleNo: "Rule 6(1)(f)",
        field: "Consumer Care Email Address",
        severity: "MAJOR",
        message: "Consumer Care box is missing a mandatory valid e-mail ID for consumer complaints.",
        legalRef: "Rule 6(1)(f) amendment 2017"
      }
    ],
    warnings: [
      {
        ruleNo: "Rule 6(11)",
        field: "Unit Sale Price",
        severity: "MINOR",
        message: "Unit Sale Price (e.g. ₹ per g / per ml / per unit) not detected on package label."
      }
    ],
    penaltyEstimate: {
      firstOffence: "Up to ₹ 25,000 per violation (Sec 36(1))",
      secondOffence: "Up to ₹ 50,000 or imprisonment up to 1 year (Sec 36(2))",
      legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
    },
    boundingBoxes: [
      { id: 1, field: "Commodity", label: "CRISPY CRUNCH POTATO CHIPS", box: { x: 10, y: 15, width: 80, height: 12 }, compliant: true },
      { id: 2, field: "Net Quantity", label: "Net Qty: 150 gms", box: { x: 15, y: 35, width: 45, height: 9 }, compliant: false, reason: "Illegal unit representation 'gms'. Standard unit under Rule 6(1)(c) must be 'g'." },
      { id: 3, field: "MRP", label: "MRP: Rs 45.00", box: { x: 15, y: 48, width: 40, height: 9 }, compliant: false, reason: "Missing mandatory tax clause '(incl. of all taxes)' mandated by Rule 6(1)(e)." },
      { id: 4, field: "Manufacturer", label: "Packed by: Snacko Foods Pvt Ltd...", box: { x: 10, y: 62, width: 75, height: 12 }, compliant: true },
      { id: 5, field: "Customer Care", label: "For complaints contact...", box: { x: 10, y: 78, width: 75, height: 10 }, compliant: false, reason: "Missing mandatory Email ID in Consumer Care details mandated by Rule 6(1)(f)." }
    ]
  },
  {
    id: "sample-2",
    name: "Pure Harvest Organic Almond Milk 1L",
    category: "Beverages",
    brand: "Harvest Organics Ltd",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    status: "COMPLIANT",
    score: 98,
    rawOcrText: `PURE HARVEST ALMOND MILK
Net Quantity: 1 L
Net Qty Unit Price: ₹ 0.22 / ml
Month & Year of Packing: 08/2026
MRP ₹ 220.00 (incl. of all taxes)
Manufactured & Marketed by: Harvest Organics Ltd, Plot 42, Biotech Park, Mysuru - 570018, Karnataka.
Consumer Care: Executive Officer, Address as above, Tel: 0821-2983741, Email: care@harvestorganics.in
Country of Origin: India`,
    violationsCount: 0,
    warningsCount: 0,
    declarations: {
      manufacturer: { found: true, text: "Harvest Organics Ltd, Plot 42, Biotech Park, Mysuru - 570018, Karnataka" },
      commodity: { found: true, text: "Pure Harvest Almond Milk" },
      netQuantity: { found: true, text: "1 L", isValidUnit: true, unitFound: "L", standardUnit: "L" },
      mfgDate: { found: true, text: "08/2026", formatValid: true },
      mrp: { found: true, text: "MRP ₹ 220.00 (incl. of all taxes)", taxClauseFound: true, currencyFound: true },
      consumerCare: { found: true, text: "Executive Officer, Tel: 0821-2983741, Email: care@harvestorganics.in", emailFound: true, phoneFound: true },
      countryOfOrigin: { found: true, text: "India" },
      unitSalePrice: { found: true, text: "₹ 0.22 / ml" }
    },
    violations: [],
    warnings: [],
    penaltyEstimate: {
      firstOffence: "Nil (Fully Compliant)",
      secondOffence: "Nil (Fully Compliant)",
      legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
    },
    boundingBoxes: [
      { id: 1, field: "Commodity", label: "PURE HARVEST ALMOND MILK", box: { x: 15, y: 10, width: 70, height: 10 }, compliant: true },
      { id: 2, field: "Net Quantity", label: "Net Quantity: 1 L", box: { x: 15, y: 25, width: 40, height: 8 }, compliant: true },
      { id: 3, field: "Unit Sale Price", label: "Unit Price: ₹ 0.22 / ml", box: { x: 58, y: 25, width: 35, height: 8 }, compliant: true },
      { id: 4, field: "MRP", label: "MRP ₹ 220.00 (incl. of all taxes)", box: { x: 15, y: 38, width: 65, height: 9 }, compliant: true },
      { id: 5, field: "Mfg Date", label: "Packing Date: 08/2026", box: { x: 15, y: 50, width: 45, height: 7 }, compliant: true },
      { id: 6, field: "Manufacturer", label: "Manufactured by: Harvest Organics Ltd...", box: { x: 10, y: 62, width: 80, height: 14 }, compliant: true },
      { id: 7, field: "Customer Care", label: "Consumer Care: Executive Officer...", box: { x: 10, y: 80, width: 80, height: 12 }, compliant: true }
    ]
  },
  {
    id: "sample-3",
    name: "GlowGoddess Rose Face Serum 30ml",
    category: "Personal Care / Cosmetics",
    brand: "Luxe Beauty Corp",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    status: "NON_COMPLIANT",
    score: 45,
    rawOcrText: `GLOW GODDESS ROSE SERUM
Volume: 30 milli-litres
Batch No: LR-8849
Price: Rs 799
Imported by: Luxe Beauty Corp, Mumbai
Customer Support: 9988776655`,
    violationsCount: 4,
    warningsCount: 1,
    declarations: {
      manufacturer: { found: true, text: "Luxe Beauty Corp, Mumbai" },
      commodity: { found: true, text: "Glow Goddess Rose Serum" },
      netQuantity: { found: true, text: "30 milli-litres", isValidUnit: false, unitFound: "milli-litres", standardUnit: "ml" },
      mfgDate: { found: false, text: null, formatValid: false },
      mrp: { found: true, text: "Rs 799", taxClauseFound: false, currencyFound: true },
      consumerCare: { found: true, text: "Customer Support: 9988776655", emailFound: false, phoneFound: true },
      countryOfOrigin: { found: false, text: null },
      unitSalePrice: { found: false, text: null }
    },
    violations: [
      {
        ruleNo: "Rule 6(1)(c)",
        field: "Net Quantity Standard Unit",
        severity: "CRITICAL",
        message: "Non-standard unit 'milli-litres'. Rule 6(1)(c) mandates standard SI symbol 'ml' or 'mL'.",
        legalRef: "Rule 6(1)(c) read with Schedule II"
      },
      {
        ruleNo: "Rule 6(1)(d)",
        field: "Month & Year of Mfg/Import",
        severity: "MAJOR",
        message: "Missing Month and Year of Manufacture / Packing / Import.",
        legalRef: "Section 36(1) of Legal Metrology Act, 2009"
      },
      {
        ruleNo: "Rule 6(1)(e)",
        field: "MRP Tax Clause",
        severity: "MAJOR",
        message: "Missing mandatory tax clause '(incl. of all taxes)'.",
        legalRef: "Rule 6(1)(e) Legal Metrology Rules 2011"
      },
      {
        ruleNo: "Rule 6(1)(g)",
        field: "Country of Origin",
        severity: "MAJOR",
        message: "Missing mandatory 'Country of Origin' declaration for imported commodity.",
        legalRef: "Rule 6(1)(g) Legal Metrology Amendment Rules"
      }
    ],
    warnings: [
      {
        ruleNo: "Rule 6(1)(f)",
        field: "Consumer Care Email Address",
        severity: "MINOR",
        message: "Missing email address in consumer care declaration."
      }
    ],
    penaltyEstimate: {
      firstOffence: "Up to ₹ 25,000 per violation (Sec 36(1))",
      secondOffence: "Up to ₹ 50,000 or imprisonment up to 1 year (Sec 36(2))",
      legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
    },
    boundingBoxes: [
      { id: 1, field: "Commodity", label: "GLOW GODDESS ROSE SERUM", box: { x: 10, y: 15, width: 80, height: 12 }, compliant: true },
      { id: 2, field: "Net Quantity", label: "Volume: 30 milli-litres", box: { x: 15, y: 32, width: 50, height: 8 }, compliant: false, reason: "Non-standard unit 'milli-litres'. Rule 6(1)(c) mandates 'ml' or 'mL'." },
      { id: 3, field: "MRP", label: "Price: Rs 799", box: { x: 15, y: 44, width: 35, height: 8 }, compliant: false, reason: "Missing tax clause '(incl. of all taxes)'. Rule 6(1)(e)." },
      { id: 4, field: "Country of Origin", label: "[MISSING DECLARATION]", box: { x: 10, y: 58, width: 60, height: 8 }, compliant: false, reason: "Missing Country of Origin declaration for imported commodity under Rule 6(1)(g)." },
      { id: 5, field: "Mfg Date", label: "[MISSING DECLARATION]", box: { x: 10, y: 70, width: 60, height: 8 }, compliant: false, reason: "Missing Month & Year of Mfg/Import mandated by Rule 6(1)(d)." }
    ]
  },
  {
    id: "sample-4",
    name: "FlexiFit Wireless Earbuds (Pack of 1 N)",
    category: "Electronics",
    brand: "SonicWave Technologies",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    status: "COMPLIANT",
    score: 95,
    rawOcrText: `FLEXIFIT WIRELESS EARBUDS
Net Quantity: 1 N (1 Pair Earbuds, 1 Charging Case, 1 Cable)
Month & Year of Import: 07/2026
MRP ₹ 1,499.00 (inclusive of all taxes)
USP: ₹ 1,499.00 / N
Imported & Marketed by: SonicWave Tech Pvt Ltd, Sector 62, Noida - 201309, UP.
Consumer Complaint Cell: Contact Quality Head at above address or Toll-Free 1800-444-999, Email: support@sonicwave.in
Country of Origin: Vietnam`,
    violationsCount: 0,
    warningsCount: 0,
    declarations: {
      manufacturer: { found: true, text: "SonicWave Tech Pvt Ltd, Sector 62, Noida - 201309, UP" },
      commodity: { found: true, text: "FlexiFit Wireless Earbuds" },
      netQuantity: { found: true, text: "1 N", isValidUnit: true, unitFound: "N", standardUnit: "N" },
      mfgDate: { found: true, text: "07/2026", formatValid: true },
      mrp: { found: true, text: "MRP ₹ 1,499.00 (inclusive of all taxes)", taxClauseFound: true, currencyFound: true },
      consumerCare: { found: true, text: "Quality Head, Toll-Free 1800-444-999, Email: support@sonicwave.in", emailFound: true, phoneFound: true },
      countryOfOrigin: { found: true, text: "Vietnam" },
      unitSalePrice: { found: true, text: "₹ 1,499.00 / N" }
    },
    violations: [],
    warnings: [],
    penaltyEstimate: {
      firstOffence: "Nil (Fully Compliant)",
      secondOffence: "Nil (Fully Compliant)",
      legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
    },
    boundingBoxes: [
      { id: 1, field: "Commodity", label: "FLEXIFIT WIRELESS EARBUDS", box: { x: 10, y: 12, width: 75, height: 10 }, compliant: true },
      { id: 2, field: "Net Quantity", label: "Net Quantity: 1 N", box: { x: 10, y: 26, width: 40, height: 8 }, compliant: true },
      { id: 3, field: "MRP", label: "MRP ₹ 1,499.00 (inclusive of all taxes)", box: { x: 10, y: 38, width: 80, height: 9 }, compliant: true },
      { id: 4, field: "Importer", label: "Imported by: SonicWave Tech Pvt Ltd...", box: { x: 10, y: 52, width: 80, height: 12 }, compliant: true },
      { id: 5, field: "Customer Care", label: "Consumer Complaint Cell...", box: { x: 10, y: 68, width: 80, height: 12 }, compliant: true },
      { id: 6, field: "Country of Origin", label: "Country of Origin: Vietnam", box: { x: 10, y: 84, width: 50, height: 8 }, compliant: true }
    ]
  }
];

export const LEGAL_METROLOGY_RULES = [
  {
    ruleNo: "Rule 6(1)(a)",
    title: "Manufacturer / Packer / Importer Details",
    description: "Every package shall bear the name and complete address of the manufacturer, packer, or importer.",
    mandatory: true,
    penaltySection: "Section 36(1) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  },
  {
    ruleNo: "Rule 6(1)(b)",
    title: "Generic / Common Name of Commodity",
    description: "The generic or common name of the commodity contained in the package must be prominently declared.",
    mandatory: true,
    penaltySection: "Section 36(1) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  },
  {
    ruleNo: "Rule 6(1)(c)",
    title: "Net Quantity & Standard Unit Representation",
    description: "Net quantity must be expressed in standard SI metric units (g, kg, ml, l/L, m, cm, N or U). Non-standard units like gms, grm, kilo, ltr, doz are strictly illegal.",
    mandatory: true,
    penaltySection: "Section 36(2) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  },
  {
    ruleNo: "Rule 6(1)(d)",
    title: "Month and Year of Manufacture / Packing / Import",
    description: "The month and year in which the commodity is manufactured, packed or imported must be declared in MM/YYYY format.",
    mandatory: true,
    penaltySection: "Section 36(1) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  },
  {
    ruleNo: "Rule 6(1)(e)",
    title: "Maximum Retail Price (MRP) & Tax Clause",
    description: "MRP must be declared in Indian Rupees (₹ or Rs) and explicitly mention '(incl. of all taxes)' or 'inclusive of all taxes'. Dual MRP stickers are prohibited.",
    mandatory: true,
    penaltySection: "Section 36(1) & 36(2) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  },
  {
    ruleNo: "Rule 6(1)(f)",
    title: "Consumer Care Contact Details",
    description: "Package must state the name/designation, full address, telephone number, and official e-mail address of the person or office for consumer complaints.",
    mandatory: true,
    penaltySection: "Section 36(1) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  },
  {
    ruleNo: "Rule 6(1)(g)",
    title: "Country of Origin",
    description: "Mandatory declaration of Country of Origin on all packaged commodities (especially imported goods).",
    mandatory: true,
    penaltySection: "Section 36(1) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  },
  {
    ruleNo: "Rule 6(11)",
    title: "Unit Sale Price (USP)",
    description: "Mandatory declaration of Unit Sale Price (e.g. ₹ per g / per ml / per N) on pre-packaged commodities to enable consumer price comparison.",
    mandatory: true,
    penaltySection: "Section 36(1) of Legal Metrology Act, 2009",
    fineFirstOffence: "Up to ₹ 25,000",
    fineSecondOffence: "Up to ₹ 50,000"
  }
];
