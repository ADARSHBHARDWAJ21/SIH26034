import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeLanding from './components/Home/HomeLanding';
import InspectPage from './components/Scanner/InspectPage';
import CameraScanner from './components/Scanner/CameraScanner';
import EcomInspector from './components/Scanner/EcomInspector';
import BatchAuditor from './components/Batch/BatchAuditor';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import RulebookExplorer from './components/Rulebook/RulebookExplorer';
import ReportsView from './components/Reports/ReportsView';
import AuthModal from './components/Auth/AuthModal';

import { BENCHMARK_SAMPLES } from './engine/sampleData';
import { performPackagingOcr } from './engine/ocrProcessor';
import { getCurrentUser, logoutUser } from './engine/authService';
import { saveScanRecord } from './engine/apiService';
import { generateCompliancePdf } from './engine/reportGenerator';

const LAST_SCAN_KEY = 'lm_last_scan';
const LAST_TAB_KEY = 'lm_active_tab';

function readSessionJson(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSessionJson(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors (large data URLs)
  }
}

export default function App() {
  const restoredScan = readSessionJson(LAST_SCAN_KEY);
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem(LAST_TAB_KEY) || 'home');
  const [homeHighlight, setHomeHighlight] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lm_theme') || 'dark';
  });

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [activeProduct, setActiveProduct] = useState(restoredScan || BENCHMARK_SAMPLES[0]);
  const [selectedSampleId, setSelectedSampleId] = useState(restoredScan ? restoredScan.id : BENCHMARK_SAMPLES[0].id);
  const [activeBoxId, setActiveBoxId] = useState(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isEcomOpen, setIsEcomOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('lm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleTabChange = (tab) => {
    if (tab === 'resources') {
      setActiveTab('home');
      setHomeHighlight('smartmet-resources');
      return;
    }
    if (tab === 'about') {
      setActiveTab('home');
      setHomeHighlight('smartmet-about');
      return;
    }
    setHomeHighlight(null);
    setActiveTab(tab);
    sessionStorage.setItem(LAST_TAB_KEY, tab);
    if (tab === 'scanner') {
      setTimeout(() => {
        document.getElementById('packaging-scanner')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setActiveProduct(sample);
    setActiveBoxId(null);
    writeSessionJson(LAST_SCAN_KEY, sample);
  };

  const handleProcessCustomImage = async (imageSource, name = "Custom Package Scan") => {
    setIsScanning(true);
    setScanProgress({ status: "Loading Canvas & Image Preprocessor...", progress: 0.15 });

    try {
      const result = await performPackagingOcr(imageSource, (prog) => {
        setScanProgress(prog);
      });

      const newProduct = {
        id: `custom-scan-${Date.now()}`,
        name: name,
        category: "Scanned Packaged Commodity",
        brand: "Custom Label Input",
        imageUrl: typeof imageSource === "string" ? imageSource : URL.createObjectURL(imageSource),
        status: result.analysis.status,
        score: result.analysis.score,
        declarations: result.analysis.declarations,
        violationsCount: result.analysis.violations.length,
        warningsCount: result.analysis.warnings.length,
        violations: result.analysis.violations,
        warnings: result.analysis.warnings,
        analysis: result.analysis,
        boundingBoxes: result.boundingBoxes,
        penaltyEstimate: result.analysis.penaltyEstimate
      };

      writeSessionJson(LAST_SCAN_KEY, newProduct);
      sessionStorage.setItem(LAST_TAB_KEY, 'scanner');

      await saveScanRecord(newProduct);

      setSelectedSampleId(null);
      setActiveProduct(newProduct);
      setActiveBoxId(null);
      setActiveTab('scanner');
    } catch (err) {
      console.error("Scan error:", err);
      alert("Failed to analyze packaging label: " + err.message);
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  };

  const isPortalHome = activeTab === 'home';

  return (
    <div className={`min-h-screen flex flex-col ${isPortalHome ? 'smartmet-shell' : 'smartmet-inner'}`}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {isPortalHome && (
        <HomeLanding
          highlight={homeHighlight}
          onStartInspection={() => handleTabChange('scanner')}
          onWatchDemo={() => { handleTabChange('scanner'); setIsCameraOpen(true); }}
          onOpenBatch={() => handleTabChange('batch')}
          onOpenAnalytics={() => handleTabChange('analytics')}
          onOpenRegulations={() => handleTabChange('rulebook')}
          onOpenReports={() => handleTabChange('reports')}
          onGenerateReport={() => generateCompliancePdf(activeProduct)}
          onOpenAbout={() => handleTabChange('about')}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {!isPortalHome && activeTab === 'scanner' && (
        <main className="flex-1">
          <InspectPage
            selectedSampleId={selectedSampleId}
            onSelectSample={handleSelectSample}
            productData={activeProduct}
            activeBoxId={activeBoxId}
            setActiveBoxId={setActiveBoxId}
            onImageSelected={(file) => handleProcessCustomImage(file, file.name)}
            onOpenCamera={() => setIsCameraOpen(true)}
            onOpenEcom={() => setIsEcomOpen(true)}
            isScanning={isScanning}
            scanProgress={scanProgress}
            onOpenRegulations={() => handleTabChange('rulebook')}
            onGoHome={() => handleTabChange('home')}
          />
        </main>
      )}

      {!isPortalHome && activeTab === 'rulebook' && (
        <main className="flex-1">
          <RulebookExplorer />
        </main>
      )}

      {!isPortalHome && activeTab === 'reports' && (
        <main className="flex-1">
          <ReportsView productData={activeProduct} inspections={BENCHMARK_SAMPLES} />
        </main>
      )}

      {!isPortalHome && activeTab !== 'scanner' && activeTab !== 'rulebook' && activeTab !== 'reports' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {activeTab === 'batch' && <BatchAuditor />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </main>
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      <CameraScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => handleProcessCustomImage(dataUrl, "Live Camera Scan")}
      />

      <EcomInspector
        isOpen={isEcomOpen}
        onClose={() => setIsEcomOpen(false)}
        onUrlSubmit={(url) => handleProcessCustomImage(url, "E-Commerce Package Image")}
      />

      {!isPortalHome && (
        <footer className="sm-footer text-center text-xs text-slate-500 py-6">
          <div className="sm-wrap flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>SmartMet • SIH26034 • Ministry of Consumer Affairs, Food & Public Distribution</span>
            <span className="font-mono text-cyan-400">Packaged Commodities Rules, 2011 Enforced</span>
          </div>
        </footer>
      )}
    </div>
  );
}
