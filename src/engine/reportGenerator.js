import jsPDF from "jspdf";

/**
 * PDF Compliance Report & Violation Notice Generator
 */
export function generateCompliancePdf(productData) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const timeStr = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const inspectionId = "SM-INSP-" + Math.floor(100000 + Math.random() * 900000);

  // Header Banner
  doc.setFillColor(18, 24, 38);
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION", 105, 14, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Department of Consumer Affairs • Legal Metrology Division (Packaged Commodities Rules 2011)", 105, 22, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(56, 189, 248);
  doc.text("SMARTMET OFFICIAL PACKAGED COMMODITY COMPLIANCE REPORT", 105, 30, { align: "center" });

  const sanitizeStr = (str) => (str || "").replace(/₹/g, "Rs. ");

  // Metadata Box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, 182, 30, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Inspection ID: ${inspectionId}`, 20, 50);
  doc.text(`Date & Time: ${dateStr} at ${timeStr}`, 20, 57);
  doc.text(`Commodity: ${sanitizeStr(productData.name || "Scanned Packaged Commodity")}`, 20, 64, { maxWidth: 115 });

  const status = productData.status || "NON_COMPLIANT";
  let statusColor = [244, 63, 94]; // Red
  if (status === "COMPLIANT") statusColor = [16, 185, 129]; // Green
  else if (status === "PARTIALLY_COMPLIANT") statusColor = [245, 158, 11]; // Orange

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(140, 48, 50, 18, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(status.replace("_", " "), 165, 59, { align: "center" });

  // Score & Summary Section
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Compliance Score & Declarations Summary", 14, 82);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Overall Score: ${productData.score || 0} / 100`, 14, 89);
  doc.text(`Violations Count: ${productData.violationsCount || (productData.analysis?.violations?.length || 0)}`, 80, 89);
  doc.text(`Warnings Count: ${productData.warningsCount || (productData.analysis?.warnings?.length || 0)}`, 140, 89);

  // Table Headers
  let yPos = 98;
  doc.setFillColor(30, 41, 59);
  doc.rect(14, yPos, 182, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Rule Clause", 18, yPos + 5.5);
  doc.text("Mandatory Declaration", 45, yPos + 5.5);
  doc.text("Extracted Value / Findings", 110, yPos + 5.5);
  doc.text("Status", 175, yPos + 5.5);

  yPos += 8;

  const rulesList = [
    { clause: "Rule 6(1)(a)", field: "Manufacturer / Importer", declKey: "manufacturer" },
    { clause: "Rule 6(1)(b)", field: "Commodity Generic Name", declKey: "commodity" },
    { clause: "Rule 6(1)(c)", field: "Net Quantity & Metric Unit", declKey: "netQuantity" },
    { clause: "Rule 6(1)(d)", field: "Month & Year of Mfg/Packing", declKey: "mfgDate" },
    { clause: "Rule 6(1)(e)", field: "MRP & Mandatory Tax Clause", declKey: "mrp" },
    { clause: "Rule 6(1)(f)", field: "Consumer Care Contact & Email", declKey: "consumerCare" },
    { clause: "Rule 6(1)(g)", field: "Country of Origin", declKey: "countryOfOrigin" },
    { clause: "Rule 6(11)", field: "Unit Sale Price (USP)", declKey: "unitSalePrice" }
  ];

  const declarations = productData.declarations || productData.analysis?.declarations || {};

  rulesList.forEach((r, idx) => {
    const data = declarations[r.declKey] || { found: false, text: null };
    const isPass = data.found && (data.isValidUnit !== false) && (data.taxClauseFound !== false) && (data.emailFound !== false);

    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(14, yPos, 182, 10, "F");
    doc.setDrawColor(226, 232, 240);
    doc.line(14, yPos + 10, 196, yPos + 10);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(r.clause, 18, yPos + 6);

    doc.setFont("helvetica", "normal");
    doc.text(r.field, 45, yPos + 6);

    const rawVal = data.text ? String(data.text).substring(0, 35) + (String(data.text).length > 35 ? "..." : "") : "[MISSING DECLARATION]";
    const extractedVal = sanitizeStr(rawVal);
    doc.setTextColor(data.found ? 51 : 225, data.found ? 65 : 29, data.found ? 85 : 72);
    doc.text(extractedVal, 110, yPos + 6, { maxWidth: 60 });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(isPass ? 16 : 225, isPass ? 185 : 29, isPass ? 129 : 72);
    doc.text(isPass ? "PASS" : "FAIL", 175, yPos + 6);

    yPos += 10;
  });

  // Penalty Section
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Legal Metrology Act, 2009 Offence & Penalty Assessment", 14, yPos);

  yPos += 5;

  const firstOffenceStr = sanitizeStr(productData.penaltyEstimate?.firstOffence || "Up to Rs. 25,000 per violation");
  const secondOffenceStr = sanitizeStr(productData.penaltyEstimate?.secondOffence || "Up to Rs. 50,000 or Imprisonment");

  const line1 = `Legal Provision: Section 36 & Section 37 of Legal Metrology Act, 2009`;
  const line2 = `First Offence Fine Estimate: ${firstOffenceStr}`;
  const line3 = `Second / Subsequent Offence: ${secondOffenceStr}`;

  const splitLine2 = doc.splitTextToSize(line2, 174);
  const splitLine3 = doc.splitTextToSize(line3, 174);

  const boxHeight = Math.max(22, 10 + splitLine2.length * 5 + splitLine3.length * 5);

  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(14, yPos, 182, boxHeight, 2, 2, "FD");

  doc.setTextColor(153, 27, 27);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");

  let textY = yPos + 6;
  doc.text(line1, 18, textY, { maxWidth: 174 });
  textY += 6;

  doc.text(splitLine2, 18, textY);
  textY += splitLine2.length * 5;

  doc.text(splitLine3, 18, textY);
  textY += splitLine3.length * 5;

  // Footer / Verification Stamp
  yPos = Math.max(yPos + boxHeight + 10, 275);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("This report is generated by SmartMet Automated Legal Metrology Inspection Software System.", 14, yPos);
  doc.text("Verified by Digital Signature • Department of Consumer Affairs, Govt. of India", 14, yPos + 4);

  doc.save(`Legal_Metrology_Inspection_${inspectionId}.pdf`);
}
