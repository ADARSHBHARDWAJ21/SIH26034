import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function CameraScanner({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [hasStream, setHasStream] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasStream(false);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = mediaStream;
      setHasStream(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera permission denied or camera unavailable.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  useEffect(() => {
    if (hasStream && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [hasStream]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      onCapture(dataUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-semibold text-stone-900 dark:text-white">Live Product Packaging Scanner</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="text-center p-6 text-rose-500 dark:text-rose-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">{cameraError}</p>
              <button type="button" onClick={startCamera} className="mt-4 btn btn-secondary text-xs">
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              
              {/* Overlay Guidance Box */}
              <div className="absolute inset-8 border-2 border-dashed border-indigo-400/80 dark:border-cyan-400/60 rounded-xl pointer-events-none flex flex-col items-center justify-between p-3">
                <div className="flex justify-between w-full text-[10px] font-mono text-indigo-300 dark:text-cyan-400">
                  <span>[TARGET: LABEL]</span>
                  <span>[OCR: ACTIVE]</span>
                </div>
                <span className="text-xs font-mono font-semibold bg-stone-900/80 dark:bg-slate-950/80 text-indigo-200 dark:text-cyan-300 px-3 py-1 rounded-full border border-indigo-500/40 dark:border-cyan-500/40 shadow-lg backdrop-blur-sm">
                  Align Package Declarations Inside Frame
                </span>
                <div className="w-full flex justify-end text-[10px] font-mono text-indigo-300 dark:text-cyan-400">
                  <span>[AUTO-FOCUS: ON]</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between bg-stone-50 dark:bg-slate-950/50">
          <span className="text-xs text-stone-600 dark:text-slate-400">Ensure good lighting for OCR legibility</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs">Cancel</button>
            <button
              type="button"
              onClick={handleCapture}
              disabled={!!cameraError}
              className="btn btn-primary text-xs flex items-center gap-2 shadow-lg font-bold"
            >
              <Check className="w-4 h-4" /> Capture & Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
