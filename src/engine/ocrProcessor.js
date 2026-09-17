import { createWorker } from 'tesseract.js';
import workerPath from 'tesseract.js/dist/worker.min.js?url';
import corePath from 'tesseract.js-core/tesseract-core-simd-lstm.wasm.js?url';
import { preprocessImageForOcr } from './imagePreprocessing';
import { analyzeLegalMetrologyCompliance } from './metrologyRulesEngine';

/**
 * Optical Character Recognition & Spatial Text Box Extractor
 */
export async function performPackagingOcr(imageSource, progressCallback = null) {
  let worker = null;

  try {
    if (progressCallback) progressCallback({ status: "PREPROCESSING", progress: 0.15 });

    const { processedDataUrl, width, height } = await preprocessImageForOcr(imageSource);

    if (progressCallback) progressCallback({ status: "INITIALIZING_OCR", progress: 0.35 });

    worker = await createWorker('eng', 1, {
      workerPath,
      corePath,
      langPath: `${window.location.origin}/tessdata`,
      gzip: true,
      logger: (message) => {
        if (!progressCallback) return;
        if (message.status === 'loading language traineddata') {
          progressCallback({ status: 'LOADING_LANGUAGE', progress: 0.4 });
        }
        if (message.status === 'recognizing text') {
          progressCallback({
            status: 'RECOGNIZING_TEXT',
            progress: 0.45 + Math.min(0.4, (message.progress || 0) * 0.4)
          });
        }
      }
    });

    if (progressCallback) progressCallback({ status: "RECOGNIZING_TEXT", progress: 0.65 });

    const ret = await worker.recognize(processedDataUrl);
    const rawOcrText = ret.data.text;

    await worker.terminate();
    worker = null;

    if (progressCallback) progressCallback({ status: "ANALYZING_RULES", progress: 0.90 });

    const boundingBoxes = (ret.data.lines || []).map((line, idx) => {
      const bbox = line.bbox;
      const xPercent = Math.round((bbox.x0 / width) * 100);
      const yPercent = Math.round((bbox.y0 / height) * 100);
      const wPercent = Math.round(((bbox.x1 - bbox.x0) / width) * 100);
      const hPercent = Math.round(((bbox.y1 - bbox.y0) / height) * 100);

      return {
        id: idx + 1,
        field: identifyFieldType(line.text),
        label: line.text.trim(),
        box: {
          x: Math.max(0, Math.min(95, xPercent)),
          y: Math.max(0, Math.min(95, yPercent)),
          width: Math.max(5, Math.min(95, wPercent)),
          height: Math.max(4, Math.min(50, hPercent))
        },
        compliant: isLineCompliant(line.text)
      };
    });

    const analysis = analyzeLegalMetrologyCompliance(rawOcrText);

    if (progressCallback) progressCallback({ status: "COMPLETE", progress: 1.0 });

    return {
      rawOcrText,
      analysis,
      boundingBoxes: boundingBoxes.length > 0 ? boundingBoxes : generateFallbackBoxes(rawOcrText),
      processedDataUrl
    };

  } catch (err) {
    console.error("OCR Processing error:", err);
    throw new Error("OCR Processing failed: " + err.message);
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore terminate errors
      }
    }
  }
}

function identifyFieldType(text) {
  const t = text.toLowerCase();
  if (/mrp|price|rs|₹/i.test(t)) return "MRP";
  if (/net\s*qty|g|kg|ml|l|wt/i.test(t)) return "Net Quantity";
  if (/mfg|packed|pkd|date/i.test(t)) return "Mfg Date";
  if (/manufactured|marketed|imported|by/i.test(t)) return "Manufacturer";
  if (/consumer|customer|care|complaint|email|tel/i.test(t)) return "Customer Care";
  if (/origin|made\s*in/i.test(t)) return "Country of Origin";
  return "Declaration Line";
}

function isLineCompliant(text) {
  const t = text.toLowerCase();
  if (/gms|gm\b|kilo|ltrs|milli-litres/i.test(t)) return false;
  if (/mrp|price/i.test(t) && !/tax/i.test(t)) return false;
  return true;
}

function generateFallbackBoxes(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  return lines.slice(0, 8).map((line, idx) => ({
    id: idx + 1,
    field: identifyFieldType(line),
    label: line,
    box: { x: 10, y: 12 + idx * 10, width: 80, height: 8 },
    compliant: isLineCompliant(line)
  }));
}
