import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQrcode, FaSearch, FaHistory, FaCamera } from "react-icons/fa";
import { Sparkles, BarChart2 } from "lucide-react";
import MapComponent from "../components/MapComponent";
import ChatModal from "../components/ChatModal";

export default function CustomerPage({ colors = {}, navigateTo, PAGES }) {
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [traceData, setTraceData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // State for Quality Prediction Model
  const [predictionInput, setPredictionInput] = useState({
    soilType: "",
    weather: "",
    harvestDate: ""
  });
  const [qualityScore, setQualityScore] = useState(null);

  // Simulated backend/blockchain data for traceability
  const mockTraceData = {
    "batch-1a2b3c": {
      id: "batch-1a2b3c",
      origin: {
        name: "Echinacea Farm #1",
        location: "40.7128, -74.0060",
        date: "2025-09-01",
        action: "Harvested",
        notes: "Grown with organic practices."
      },
      processingHistory: [
        { action: "Dried", processor: "Processor A", date: "2025-09-05" },
        { action: "Packaged", processor: "Processor B", date: "2025-09-10" }
      ]
    },
    "batch-4d5e6f": {
      id: "batch-4d5e6f",
      origin: {
        name: "Lavender Field Co.",
        location: "34.0522, -118.2437",
        date: "2025-08-28",
        action: "Harvested",
        notes: "Field-grown, hand-picked."
      },
      processingHistory: [
        { action: "Distilled", processor: "Processor C", date: "2025-09-02" },
        { action: "Bottled", processor: "Processor D", date: "2025-09-05" }
      ]
    },
  };

  const openChat = (herb) => {
    setSelectedHerb(herb);
  };

  const closeChat = () => {
    setSelectedHerb(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const data = mockTraceData[value];
    if (data) {
      setTraceData(data);
    } else {
      setTraceData(null);
    }
  };

  const handleQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const scannedId = "batch-4d5e6f"; // Simulates a successful scan
      setSearchTerm(scannedId);
      setTraceData(mockTraceData[scannedId]);
      setIsScanning(false);
    }, 2000);
  };

  const handlePredictionInputChange = (e) => {
    const { name, value } = e.target;
    setPredictionInput(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePredictQuality = () => {
    const { soilType, weather, harvestDate } = predictionInput;
    if (!soilType || !weather || !harvestDate) {
      setQualityScore("Please fill all fields.");
      return;
    }

    // Simulate ML model prediction
    let score = Math.floor(Math.random() * 40) + 60; // Base score 60-99
    
    if (soilType.toLowerCase().includes("organic")) {
      score += 5;
    }
    if (weather.toLowerCase().includes("sunny")) {
      score += 3;
    }
    if (harvestDate.split('-')[1] === '09') { // Specific month bonus
      score += 4;
    }

    const finalScore = Math.min(100, score);
    setQualityScore(finalScore.toFixed(2));
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="min-h-[70vh] p-4 flex flex-col items-center">
      <div className="flex flex-col md:flex-row md:justify-between items-center w-full max-w-7xl mb-6">
        <h2 className="text-3xl font-bold text-center mb-4 md:mb-0" style={{ color: colors.primaryGreen }}>
          Public Traceability Dashboard
        </h2>
        
        {/* Button for Healthy Lifestyle */}
        <motion.button
          onClick={() => navigateTo(PAGES.healthyLifestyle)}
          className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300"
          style={{ backgroundColor: colors.goldTan }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          <span>Explore Lifestyle Tips</span>
        </motion.button>
      </div>
      
      <p className="mb-6 max-w-2xl text-center" style={{ color: colors.darkText }}>
        Explore verified herb records on the map, scan a product's QR code, or search for its ID to see its complete journey.
      </p>

      {/* Main content area */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        
        {/* Left Column */}
        <div className="w-full lg:w-2/3 flex flex-col space-y-8">
            {/* Search and Scan Section */}
            <div className="w-full bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: colors.goldTan }}>
                <FaSearch className="mr-2" /> Find Your Product
                </h3>
                <div className="flex space-x-4">
                <input
                    type="text"
                    placeholder="Search by Herb ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-1 p-3 rounded-md border"
                />
                <button
                    onClick={handleQrScan}
                    className="p-3 rounded-md font-bold text-white transition-all duration-200"
                    style={{ backgroundColor: colors.primaryGreen }}
                >
                    <FaQrcode className="inline-block" />
                </button>
                </div>
                <AnimatePresence>
                {isScanning && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 rounded-lg bg-gray-100 flex flex-col items-center text-center"
                    >
                    <FaCamera className="text-4xl mb-2 text-gray-600" />
                    <p className="font-semibold text-gray-700">Scanning for QR code...</p>
                    <button
                        onClick={() => setIsScanning(false)}
                        className="mt-2 text-sm text-red-500 font-semibold"
                    >
                        Cancel
                    </button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Quality Prediction Model Section */}
            <div className="w-full bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: colors.accent }}>
                    <BarChart2 className="mr-2" /> Herb Quality Prediction
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Enter production details to get a machine learning-predicted quality score.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        name="soilType"
                        placeholder="Soil Type (e.g., Organic, Sandy)"
                        value={predictionInput.soilType}
                        onChange={handlePredictionInputChange}
                        className="p-3 rounded-md border"
                    />
                    <input
                        type="text"
                        name="weather"
                        placeholder="Weather (e.g., Sunny, Rainy)"
                        value={predictionInput.weather}
                        onChange={handlePredictionInputChange}
                        className="p-3 rounded-md border"
                    />
                    <input
                        type="date"
                        name="harvestDate"
                        placeholder="Harvest Date"
                        value={predictionInput.harvestDate}
                        onChange={handlePredictionInputChange}
                        className="p-3 rounded-md border"
                    />
                </div>
                <button
                    onClick={handlePredictQuality}
                    className="w-full p-3 rounded-md font-bold text-white transition-all duration-200"
                    style={{ backgroundColor: colors.accent }}
                >
                    Predict Quality Score
                </button>
                <AnimatePresence>
                    {qualityScore && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-4 p-4 text-center rounded-lg shadow-inner"
                            style={{ backgroundColor: colors.lightGrey }}
                        >
                            <p className="text-xl font-bold" style={{ color: colors.darkText }}>
                                Predicted Quality Score: <span className="text-2xl" style={{ color: colors.primaryGreen }}>{qualityScore}%</span>
                            </p>
                            {qualityScore >= 85 && (
                              <p className="text-sm text-gray-500 mt-1">Excellent predicted quality!</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Map Section */}
            <div className="w-full" style={{ height: "500px" }}>
                <MapComponent openChat={openChat} colors={colors} />
            </div>
        </div>

        {/* Right Column */}
        <motion.div
          className="w-full lg:w-1/3 p-6 rounded-2xl shadow-xl"
          style={{ backgroundColor: colors.lightGrey }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {traceData ? (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.primaryGreen }}>
                <FaHistory className="mr-2" /> Traceability Report
              </h3>
              <div className="space-y-4">
                {/* Origin */}
                <div className="p-4 rounded-xl border-l-4" style={{ borderColor: colors.goldTan, backgroundColor: "white" }}>
                  <p className="font-bold">Origin: {traceData.origin.name}</p>
                  <p className="text-sm">Location: {traceData.origin.location}</p>
                  <p className="text-sm">Date: {traceData.origin.date}</p>
                  <p className="text-xs italic mt-2">"{traceData.origin.notes}"</p>
                </div>
                {/* Processing Steps */}
                {traceData.processingHistory.map((step, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl border-l-4"
                    style={{ borderColor: colors.primaryGreen, backgroundColor: "white" }}
                    variants={itemVariants}
                    custom={index + 1}
                  >
                    <p className="font-bold">Step {index + 1}: {step.action}</p>
                    <p className="text-sm">Processor: {step.processor}</p>
                    <p className="text-sm">Date: {step.date}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Scan a QR code or search for a Herb ID to see its full history.
            </p>
          )}
        </motion.div>
      </div>

      {selectedHerb && (
        <ChatModal
          herb={selectedHerb}
          isOpen={true}
          onClose={closeChat}
          colors={colors}
        />
      )}
    </div>
  );
}