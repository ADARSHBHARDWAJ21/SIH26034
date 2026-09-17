/**
 * Legal Metrology (Packaged Commodities) Rules, 2011 Compliance Verification Engine
 * Parses raw OCR text and evaluates rules adherence according to Ministry of Consumer Affairs guidelines.
 */

export function analyzeLegalMetrologyCompliance(ocrText) {
  if (!ocrText || typeof ocrText !== "string") {
    return {
      status: "NON_COMPLIANT",
      score: 0,
      declarations: {},
      violations: [{ rule: "Rule 6", message: "No text could be extracted from the label image." }],
      warnings: [],
      penaltyEstimate: { firstOffence: "Up to ₹ 25,000", secondOffence: "Up to ₹ 50,000" }
    };
  }

  const cleanText = ocrText.replace(/\r\n/g, "\n");
  const lines = cleanText.split("\n").map(l => l.trim()).filter(Boolean);

  const declarations = {
    manufacturer: parseManufacturer(cleanText, lines),
    commodity: parseCommodity(cleanText, lines),
    netQuantity: parseNetQuantity(cleanText, lines),
    mfgDate: parseMfgDate(cleanText, lines),
    mrp: parseMRP(cleanText, lines),
    consumerCare: parseConsumerCare(cleanText, lines),
    countryOfOrigin: parseCountryOfOrigin(cleanText, lines),
    unitSalePrice: parseUnitSalePrice(cleanText, lines)
  };

  const violations = [];
  const warnings = [];
  let scorePoints = 100;

  // Rule 6(1)(a): Manufacturer Details
  if (!declarations.manufacturer.found) {
    violations.push({
      ruleNo: "Rule 6(1)(a)",
      field: "Manufacturer / Packer / Importer",
      severity: "CRITICAL",
      message: "Missing complete name & address of Manufacturer/Packer/Importer.",
      legalRef: "Section 36(1) of Legal Metrology Act, 2009"
    });
    scorePoints -= 20;
  } else if (!declarations.manufacturer.hasPincode) {
    warnings.push({
      ruleNo: "Rule 6(1)(a)",
      field: "Manufacturer Address",
      severity: "MINOR",
      message: "Address detected but lacks a 6-digit Pincode."
    });
    scorePoints -= 5;
  }

  // Rule 6(1)(b): Commodity Generic Name
  if (!declarations.commodity.found) {
    violations.push({
      ruleNo: "Rule 6(1)(b)",
      field: "Generic Commodity Name",
      severity: "MAJOR",
      message: "Missing clear common/generic name declaration of the commodity.",
      legalRef: "Section 36(1) of Legal Metrology Act, 2009"
    });
    scorePoints -= 15;
  }

  // Rule 6(1)(c): Net Quantity & Unit Standard
  if (!declarations.netQuantity.found) {
    violations.push({
      ruleNo: "Rule 6(1)(c)",
      field: "Net Quantity",
      severity: "CRITICAL",
      message: "Missing Net Quantity declaration.",
      legalRef: "Section 36(2) of Legal Metrology Act, 2009"
    });
    scorePoints -= 25;
  } else if (!declarations.netQuantity.isValidUnit) {
    violations.push({
      ruleNo: "Rule 6(1)(c)",
      field: "Net Quantity Standard Unit",
      severity: "CRITICAL",
      message: `Illegal non-standard unit '${declarations.netQuantity.unitFound}'. Legal Metrology Rules mandate standard SI symbols: 'g', 'kg', 'ml', 'l' / 'L', 'N' or 'U'.`,
      legalRef: "Rule 6(1)(c) read with Schedule II"
    });
    scorePoints -= 20;
  }

  // Rule 6(1)(d): Month & Year of Mfg/Packing
  if (!declarations.mfgDate.found) {
    violations.push({
      ruleNo: "Rule 6(1)(d)",
      field: "Month & Year of Mfg/Packing",
      severity: "MAJOR",
      message: "Missing Month and Year of Manufacture / Packing / Import.",
      legalRef: "Section 36(1) of Legal Metrology Act, 2009"
    });
    scorePoints -= 15;
  }

  // Rule 6(1)(e): Maximum Retail Price & Tax Clause
  if (!declarations.mrp.found) {
    violations.push({
      ruleNo: "Rule 6(1)(e)",
      field: "MRP Declaration",
      severity: "CRITICAL",
      message: "Missing Maximum Retail Price (MRP) declaration.",
      legalRef: "Section 36(1) of Legal Metrology Act, 2009"
    });
    scorePoints -= 25;
  } else {
    if (!declarations.mrp.taxClauseFound) {
      violations.push({
        ruleNo: "Rule 6(1)(e)",
        field: "MRP Tax Clause",
        severity: "MAJOR",
        message: "MRP declaration is missing mandatory clause '(incl. of all taxes)' or 'inclusive of all taxes'.",
        legalRef: "Rule 6(1)(e) Legal Metrology Rules 2011"
      });
      scorePoints -= 15;
    }
    if (!declarations.mrp.currencyFound) {
      warnings.push({
        ruleNo: "Rule 6(1)(e)",
        field: "MRP Currency Symbol",
        severity: "MINOR",
        message: "MRP value present but missing Indian Rupee currency symbol (₹ or Rs)."
      });
      scorePoints -= 5;
    }
  }

  // Rule 6(1)(f): Consumer Care Contact Details
  if (!declarations.consumerCare.found) {
    violations.push({
      ruleNo: "Rule 6(1)(f)",
      field: "Consumer Care Contact",
      severity: "MAJOR",
      message: "Missing complete Consumer Care details for consumer complaints.",
      legalRef: "Section 36(1) of Legal Metrology Act, 2009"
    });
    scorePoints -= 15;
  } else {
    if (!declarations.consumerCare.emailFound) {
      violations.push({
        ruleNo: "Rule 6(1)(f)",
        field: "Consumer Care Email",
        severity: "MAJOR",
        message: "Consumer Care box is missing a mandatory valid e-mail ID.",
        legalRef: "Rule 6(1)(f) amendment 2017"
      });
      scorePoints -= 10;
    }
    if (!declarations.consumerCare.phoneFound) {
      warnings.push({
        ruleNo: "Rule 6(1)(f)",
        field: "Consumer Care Telephone",
        severity: "MINOR",
        message: "Missing phone number/toll-free helpline in Consumer Care declaration."
      });
      scorePoints -= 5;
    }
  }

  // Rule 6(1)(g): Country of Origin
  if (!declarations.countryOfOrigin.found) {
    violations.push({
      ruleNo: "Rule 6(1)(g)",
      field: "Country of Origin",
      severity: "MAJOR",
      message: "Missing mandatory 'Country of Origin' declaration.",
      legalRef: "Rule 6(1)(g) Legal Metrology (Packaged Commodities) Amendment Rules"
    });
    scorePoints -= 15;
  }

  // Rule 6(11): Unit Sale Price (USP)
  if (!declarations.unitSalePrice.found) {
    warnings.push({
      ruleNo: "Rule 6(11)",
      field: "Unit Sale Price",
      severity: "MINOR",
      message: "Unit Sale Price (e.g. ₹ per g / per ml / per unit) not detected on package label."
    });
    scorePoints -= 5;
  }

  const finalScore = Math.max(0, scorePoints);
  let status = "COMPLIANT";
  if (violations.some(v => v.severity === "CRITICAL") || finalScore < 70) {
    status = "NON_COMPLIANT";
  } else if (violations.length > 0 || warnings.length > 0) {
    status = "PARTIALLY_COMPLIANT";
  }

  // Penalty Calculation based on violation count & severity
  let firstOffenceFine = "Nil (Compliant)";
  let secondOffenceFine = "Nil (Compliant)";

  if (status === "NON_COMPLIANT") {
    firstOffenceFine = "Up to ₹ 25,000 per violation (Sec 36(1))";
    secondOffenceFine = "Up to ₹ 50,000 or imprisonment up to 1 year (Sec 36(2))";
  } else if (status === "PARTIALLY_COMPLIANT") {
    firstOffenceFine = "Up to ₹ 10,000 - ₹ 25,000";
    secondOffenceFine = "Up to ₹ 50,000";
  }

  return {
    status,
    score: finalScore,
    declarations,
    violations,
    warnings,
    penaltyEstimate: {
      firstOffence: firstOffenceFine,
      secondOffence: secondOffenceFine,
      legalSection: "Section 36 & Section 37 of Legal Metrology Act, 2009"
    }
  };
}

/* Parsers */

function parseManufacturer(text, lines) {
  const mfgRegex = /(?:manufactured|mfg|packed|marketed|imported|pkd)\s*(?:and\s*marketed)?\s*by[:\s]+([^\n]+)/i;
  const match = text.match(mfgRegex);
  const pincodeMatch = text.match(/\b[1-9][0-9]{5}\b/);

  if (match) {
    return {
      found: true,
      text: match[1].trim().substring(0, 150),
      hasPincode: !!pincodeMatch
    };
  }

  // Fallback search for address keywords
  const addressKeyword = lines.find(l => /industrial area|plot|street|road|nagar|city|pune|mumbai|delhi|bengaluru|chennai|hyderabad|pincode|pin\s*[:-]/i.test(l));
  if (addressKeyword) {
    return {
      found: true,
      text: addressKeyword.substring(0, 150),
      hasPincode: !!pincodeMatch
    };
  }

  return { found: false, text: null, hasPincode: false };
}

function parseCommodity(text, lines) {
  const commRegex = /(?:commodity|product|name of commodity|item)[:\s]+([^\n]+)/i;
  const match = text.match(commRegex);
  if (match) {
    return { found: true, text: match[1].trim() };
  }

  // Fallback: Assume first prominent line is commodity name
  if (lines.length > 0) {
    return { found: true, text: lines[0] };
  }

  return { found: false, text: null };
}

function parseNetQuantity(text, lines) {
  const netQtyRegex = /(?:net\s*qty|net\s*quantity|net\s*wt|net\s*weight|volume|contents)[:\s]+([0-9.]+\s*[a-zA-Z]+)/i;
  const match = text.match(netQtyRegex);

  const illegalUnits = ["gms", "gm", "grm", "kilo", "kilos", "ltr", "ltrs", "doz", "dozens", "pcs", "milli-litres"];
  const legalUnits = ["g", "kg", "ml", "l", "L", "N", "U", "cm", "m"];

  if (match) {
    const rawVal = match[1].trim();
    const unitMatch = rawVal.match(/[a-zA-Z]+/);
    const unitFound = unitMatch ? unitMatch[0].toLowerCase() : "";

    const isIllegal = illegalUnits.includes(unitFound);
    const isLegal = legalUnits.map(u => u.toLowerCase()).includes(unitFound);

    return {
      found: true,
      text: rawVal,
      isValidUnit: isLegal && !isIllegal,
      unitFound: unitMatch ? unitMatch[0] : "",
      standardUnit: getStandardEquivalent(unitFound)
    };
  }

  // General match for numbers followed by unit
  const generalUnitMatch = text.match(/([0-9.]+\s*(?:gms|gm|g|kg|ml|l|L|ltr|ltrs|N|U|milli-litres))/i);
  if (generalUnitMatch) {
    const rawVal = generalUnitMatch[1].trim();
    const unitMatch = rawVal.match(/[a-zA-Z]+/);
    const unitFound = unitMatch ? unitMatch[0].toLowerCase() : "";

    const isIllegal = illegalUnits.includes(unitFound);
    const isLegal = legalUnits.map(u => u.toLowerCase()).includes(unitFound);

    return {
      found: true,
      text: rawVal,
      isValidUnit: isLegal && !isIllegal,
      unitFound: unitMatch ? unitMatch[0] : "",
      standardUnit: getStandardEquivalent(unitFound)
    };
  }

  return { found: false, text: null, isValidUnit: false, unitFound: "", standardUnit: "" };
}

function getStandardEquivalent(unit) {
  const u = unit.toLowerCase();
  if (u === "gms" || u === "gm" || u === "grm") return "g";
  if (u === "ltr" || u === "ltrs" || u === "milli-litres") return "ml / L";
  if (u === "pcs" || u === "doz") return "N";
  return "g / kg / ml / L / N";
}

function parseMfgDate(text, lines) {
  const mfgRegex = /(?:mfg|mfg\s*date|date\s*of\s*mfg|packed|pkd|date\s*of\s*packing|imported|month\s*&\s*year)[:\s]+([0-9]{1,2}[\/\.-][0-9]{2,4}|[A-Za-z]+\s+[0-9]{4})/i;
  const match = text.match(mfgRegex);
  if (match) {
    return { found: true, text: match[1].trim(), formatValid: true };
  }

  // Check generic date pattern MM/YYYY or MM-YYYY
  const genericDate = text.match(/\b(0[1-9]|1[0-2])[\/\.-](20[2-9][0-9])\b/);
  if (genericDate) {
    return { found: true, text: genericDate[0], formatValid: true };
  }

  return { found: false, text: null, formatValid: false };
}

function parseMRP(text, lines) {
  const mrpRegex = /(?:mrp|max\s*retail\s*price|price)[:\s]*([₹Rs\.\s]*[0-9,]+(?:\.[0-9]{2})?)/i;
  const match = text.match(mrpRegex);

  const taxClauseRegex = /(?:incl\.?\s*of\s*all\s*taxes|inclusive\s*of\s*all\s*taxes|incl\s*taxes)/i;
  const hasTaxClause = taxClauseRegex.test(text);

  const currencyRegex = /[₹]|Rs\.?|INR/i;

  if (match) {
    const rawMrp = match[0].trim();
    return {
      found: true,
      text: rawMrp,
      taxClauseFound: hasTaxClause,
      currencyFound: currencyRegex.test(rawMrp) || currencyRegex.test(text)
    };
  }

  return { found: false, text: null, taxClauseFound: false, currencyFound: false };
}

function parseConsumerCare(text, lines) {
  const careKeywords = /(?:consumer\s*care|customer\s*care|complaints|feedback|contact\s*us|for\s*complaints)/i;
  const hasCareSection = careKeywords.test(text);

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);

  const phoneRegex = /(?:tel|ph|phone|mobile|toll\s*free|call)[:\s]*([0-9\+\-\s]{8,15})|\b1800[0-9\-\s]{6,10}\b/;
  const phoneMatch = text.match(phoneRegex);

  if (hasCareSection || emailMatch || phoneMatch) {
    return {
      found: true,
      text: (emailMatch ? `Email: ${emailMatch[0]}` : "") + (phoneMatch ? ` Tel: ${phoneMatch[0]}` : ""),
      emailFound: !!emailMatch,
      phoneFound: !!phoneMatch
    };
  }

  return { found: false, text: null, emailFound: false, phoneFound: false };
}

function parseCountryOfOrigin(text, lines) {
  const originRegex = /(?:country\tag\sof\sorigin|made\sin|product\sof|origin)[:\s]+([a-zA-Z\s]+)/i;
  const match = text.match(originRegex);
  if (match) {
    return { found: true, text: match[1].trim() };
  }

  const countrMatch = text.match(/\b(India|Vietnam|China|Thailand|Germany|USA|UK|Japan|Korea|France)\b/i);
  if (countrMatch) {
    return { found: true, text: countrMatch[0] };
  }

  return { found: false, text: null };
}

function parseUnitSalePrice(text, lines) {
  const uspRegex = /(?:unit\s*sale\s*price|usp|unit\s*price)[:\s]*([₹Rs\.\s]*[0-9\.]+\s*\/\s*(?:g|kg|ml|l|L|N|U|unit))/i;
  const match = text.match(uspRegex);
  if (match) {
    return { found: true, text: match[1].trim() };
  }
  return { found: false, text: null };
}
