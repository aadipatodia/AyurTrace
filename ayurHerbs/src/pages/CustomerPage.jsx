import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, QrCode, History, Camera, BarChart2, Sparkles, MapPin, Zap, RefreshCw } from "lucide-react";
import MapComponent from "../components/MapComponent";

export default function CustomerPage({ colors = {}, navigateTo, PAGES }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [traceData, setTraceData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [qualityScore, setQualityScore] = useState(null);

  // --- State and Constants ---
  const API_URL = "http://127.0.0.1:8000";
  const [allHerbs, setAllHerbs] = useState([]);
  const [mapCenter, setMapCenter] = useState(null); // Controls the map's center

  // --- Data Fetching Hooks ---
  useEffect(() => {
    // Fetches all herb locations for the global map view on initial load
    const fetchAllHerbs = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/`);
        const result = await response.json();
        if (result.status === "success") {
          setAllHerbs(result.data);
        } else {
          console.error("Failed to fetch dashboard data:", result.message);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchAllHerbs();
  }, []); // Empty dependency array ensures this runs only once

  // --- Handler Functions ---
  const handleTraceSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a Herb ID to trace.");
      setTraceData(null);
      return;
    }
    setLoading(true);
    setError(null);
    setTraceData(null);
    setMapCenter(null); // Reset map center on each new search

    try {
      const response = await fetch(`${API_URL}/trace_herb/${searchTerm}`);
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setTraceData(result.data);
        // Set the map center to the traced herb's location
        setMapCenter([result.data.origin.latitude, result.data.origin.longitude]);
      } else {
        setError(result.message || "Herb not found. Please try another ID.");
        setTraceData(null);
      }
    } catch (err) {
      setError("An error occurred while connecting to the server. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQrScan = () => {
    setIsScanning(true);
    // Simulates a QR scan finding ID "0" and then triggers a real search
    setTimeout(() => {
      setSearchTerm("0"); 
      setIsScanning(false);
      handleTraceSearch();
    }, 2000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setQualityScore(null);
    }
  };

  const handlePredictQuality = () => {
    if (!imageFile) {
      setQualityScore("Please upload an image first.");
      return;
    }
    
    setLoading(true);
    setQualityScore(null);

    // Simulate a 2-second processing delay
    setTimeout(() => {
      setQualityScore("Good Quality 94% Confidence");
      setLoading(false);
    }, 2000);
  };
  // --- Animation Variants ---
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } } };

  return (
    <motion.div 
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
       <motion.div 
        className="max-w-7xl mx-auto mb-8"
        variants={itemVariants}
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3" style={{ color: colors.primaryGreen }}>
              Public Traceability Dashboard
            </h1>
            <p className="text-lg opacity-80 max-w-2xl" style={{ color: colors.darkText }}>
              Explore verified herb records, scan QR codes, and discover the complete journey of your herbal products.
            </p>
          </div>

          <motion.button
            onClick={() => navigateTo(PAGES.healthyLifestyle)}
            className="flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300"
            style={{ backgroundColor: colors.goldTan }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              y: -2 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={20} />
            <span>Explore Lifestyle Tips</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Search Section */}
          <motion.div 
            className="p-8 rounded-3xl shadow-2xl backdrop-blur-sm border"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.borderColor }}
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <Search className="mr-3 text-3xl" style={{ color: colors.goldTan }} />
              <h2 className="text-2xl font-bold" style={{ color: colors.goldTan }}>
                Find Your Product
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter Herb ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-30 font-medium"
                  style={{ backgroundColor: colors.lightGrey, borderColor: colors.borderColor, color: colors.darkText }}
                  onKeyPress={(e) => e.key === 'Enter' && handleTraceSearch()}
                />
                <motion.button
                  onClick={handleTraceSearch}
                  disabled={loading}
                  className="px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: colors.primaryGreen }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? ( <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Search size={20} /></motion.div> ) : ( <Search size={20} /> )}
                </motion.button>
                <motion.button
                  onClick={handleQrScan}
                  className="px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: colors.goldTan }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <QrCode size={20} />
                </motion.button>
              </div>
              <AnimatePresence>
                {isScanning && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 rounded-2xl shadow-inner text-center" style={{ backgroundColor: colors.lightGrey }}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}><Camera className="text-5xl mx-auto mb-3" style={{ color: colors.accent }} /></motion.div>
                    <p className="font-semibold mb-2" style={{ color: colors.darkText }}>Scanning for QR code...</p>
                    <button onClick={() => setIsScanning(false)} className="text-sm font-semibold hover:underline" style={{ color: colors.error }}>Cancel</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quality Prediction Section */}
          <motion.div 
            className="p-8 rounded-3xl shadow-2xl backdrop-blur-sm border"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.borderColor }}
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <BarChart2 className="mr-3 text-3xl" style={{ color: colors.accent }} />
              <h2 className="text-2xl font-bold" style={{ color: colors.accent }}>AI Quality Prediction</h2>
            </div>
            <p className="mb-6 opacity-80" style={{ color: colors.darkText }}>Upload a photo of your herb to get an instant AI-powered quality assessment.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105" style={{ backgroundColor: colors.primaryGreen }}>
                  <Camera size={20} /><span>Take Photo</span><input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                </label>
                <label className="flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105" style={{ backgroundColor: colors.goldTan }}>
                  <Zap size={20} /><span>Upload from Device</span><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              {imageFile && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-4 rounded-xl shadow-inner" style={{ backgroundColor: colors.lightGrey }}>
                  <p className="font-medium" style={{ color: colors.darkText }}>File selected: {imageFile.name}</p>
                </motion.div>
              )}
              <motion.button onClick={handlePredictQuality} disabled={!imageFile || loading} className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${!imageFile ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}`} style={{ backgroundColor: colors.accent }} whileHover={imageFile ? { y: -2 } : {}} whileTap={imageFile ? { scale: 0.98 } : {}}>
                {loading && !traceData ? 'Analyzing...' : 'Analyze Quality'}
              </motion.button>
              <AnimatePresence>
                {qualityScore && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-6 text-center rounded-2xl shadow-lg border-l-4" style={{ backgroundColor: colors.lightGrey, borderColor: qualityScore.startsWith("Error") ? colors.error : colors.success }}>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkText }}>Quality Assessment:</h3>
                    <p className="text-2xl font-bold" style={{ color: qualityScore.startsWith("Error") ? colors.error : colors.success }}>{qualityScore}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Results */}
        <motion.div className="p-8 rounded-3xl shadow-2xl backdrop-blur-sm border min-h-[600px] flex flex-col" style={{ backgroundColor: colors.cardBackground, borderColor: colors.borderColor }} variants={itemVariants}>
          <div className="flex items-center mb-6"><History className="mr-3 text-3xl" style={{ color: colors.primaryGreen }} /><h2 className="text-2xl font-bold" style={{ color: colors.primaryGreen }}>Traceability Report</h2></div>
          <AnimatePresence mode="wait">
            {loading && !traceData && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col justify-center items-center flex-grow">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="mb-4"><Zap className="text-4xl" style={{ color: colors.primaryGreen }} /></motion.div>
                <p className="text-lg font-medium" style={{ color: colors.darkText }}>Tracing your herb...</p>
              </motion.div>
            )}
            {error && (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-6 rounded-2xl text-center border-l-4" style={{ backgroundColor: `${colors.error}10`, borderColor: colors.error, color: colors.error }}><p className="font-medium">{error}</p></motion.div>
            )}
            {traceData && (
              <motion.div key="data" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <motion.div className="p-6 rounded-2xl shadow-lg border-l-4" style={{ borderColor: colors.goldTan, backgroundColor: colors.lightGrey }} whileHover={{ scale: 1.02, y: -2 }}>
                  <h3 className="font-bold text-lg mb-3 flex items-center" style={{ color: colors.goldTan }}><MapPin className="mr-2" size={18} /> Origin</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Herb:</strong> {traceData.origin.name}</p>
                    <p><strong>AI Confidence:</strong> {traceData.origin.confidenceScore}%</p>
                    <p><strong>Location:</strong> {traceData.origin.latitude.toFixed(4)}, {traceData.origin.longitude.toFixed(4)}</p>
                    <p><strong>Date:</strong> {new Date(traceData.origin.timestamp * 1000).toLocaleString()}</p>
                  </div>
                </motion.div>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg" style={{ color: colors.primaryGreen }}>Processing Journey</h3>
                  {traceData.processingHistory.map((step, index) => (
                    <motion.div key={index} className="p-6 rounded-2xl shadow-lg border-l-4" style={{ borderColor: colors.primaryGreen, backgroundColor: colors.lightGrey }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }} whileHover={{ scale: 1.02, x: 5 }}>
                      <h4 className="font-bold mb-2" style={{ color: colors.primaryGreen }}>Step {index + 1}: {step.action}</h4>
                      <div className="space-y-1 text-sm" style={{ color: colors.darkText }}>
                        <p><strong>Batch No:</strong> {step.batchNumber}</p>
                        <p><strong>Date:</strong> {new Date(step.timestamp * 1000).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {!loading && !error && !traceData && (
              <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 flex-grow flex flex-col justify-center items-center">
                <QrCode className="text-6xl mx-auto mb-4 opacity-30" style={{ color: colors.darkText }} />
                <p className="text-lg opacity-60" style={{ color: colors.darkText }}>Search for a Herb ID or scan a QR code to see the complete traceability report.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div className="mt-8 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.borderColor }} variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                <MapPin className="mr-3 text-3xl" style={{ color: colors.accent }} />
                <h2 className="text-2xl font-bold" style={{ color: colors.accent }}>Global Herb Locations</h2>
            </div>
            {mapCenter && (
                 <motion.button onClick={() => setMapCenter(null)} className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300" style={{ backgroundColor: colors.lightGrey, color: colors.darkText }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <RefreshCw size={16} /><span>Reset View</span>
                </motion.button>
            )}
        </div>
        <p className="mb-6 opacity-80" style={{ color: colors.darkText }}>
          {mapCenter && traceData ? `Zoomed into the origin of ${traceData.origin.name}.` : "Explore the locations where our herbs are sourced from."}
        </p>
        <div className="w-full rounded-2xl overflow-hidden" style={{ height: '500px' }}>
          <MapComponent 
            colors={colors} 
            herbs={allHerbs} 
            center={mapCenter} 
          />
        </div>
      </motion.div>
    </motion.div>
  );
}