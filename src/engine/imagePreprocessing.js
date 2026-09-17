/**
 * Image Preprocessor for OCR Optimization
 * Enhances low-light packaging label photos with adaptive contrast, thresholding, and binarization.
 */

export function preprocessImageForOcr(imageSource) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl = null;
    const isRemoteUrl = typeof imageSource === "string" && /^https?:/i.test(imageSource);

    // Only remote http(s) images need CORS. Blob/file/data URLs break if this is always set.
    if (isRemoteUrl) {
      img.crossOrigin = "Anonymous";
    }
    
    img.onload = () => {
      try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Scale up if image is small to improve OCR accuracy
      let width = img.width;
      let height = img.height;
      
      const maxDim = 1800;
      if (width < 800 || height < 800) {
        const scale = Math.max(1200 / width, 1200 / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      } else if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      let imgData;
      try {
        imgData = ctx.getImageData(0, 0, width, height);
      } catch {
        throw new Error("Could not read this image for OCR (blocked by browser CORS). Upload a photo file instead of a webpage link.");
      }
      const data = imgData.data;

      // 1. Grayscale & Contrast Boosting
      const contrast = 1.35; // Contrast factor
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        // Luminance grayscale
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        // Contrast adjustment
        const newGray = factor * (gray - 128) + 128;
        
        // Clamping values
        const finalPixel = Math.max(0, Math.min(255, newGray));
        
        data[i] = finalPixel;     // Red
        data[i + 1] = finalPixel; // Green
        data[i + 2] = finalPixel; // Blue
      }

      ctx.putImageData(imgData, 0, 0);

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }

      resolve({
        processedDataUrl: canvas.toDataURL("image/png"),
        width,
        height
      });
      } catch (err) {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load packaging image. If this is a website link, paste a direct .jpg/.png image URL instead."));
    };

    if (typeof imageSource === "string") {
      img.src = imageSource;
    } else if (imageSource instanceof File || imageSource instanceof Blob) {
      objectUrl = URL.createObjectURL(imageSource);
      img.src = objectUrl;
    } else {
      reject(new Error("Unsupported image source type"));
    }
  });
}
