import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQrcode, FaSearch, FaHistory, FaCamera } from "react-icons/fa";
import { Sparkles, BarChart2 } from "lucide-react";
import MapComponent from "../components/MapComponent";
import ChatModal from "../components/ChatModal";

// Replaced react-icons/fa with inline SVGs to avoid dependency errors.
const IconSearch = (props) => (<svg viewBox="0 0 512 512" fill="currentColor" {...props}><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.3-128-128S137.3 80 208 80s128 57.3 128 128-57.3 128-128 128z"/></svg>);
const IconBarcode = (props) => (<svg viewBox="0 0 512 512" fill="currentColor" {...props}><path d="M480 32H32C14.33 32 0 46.33 0 64v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32H480zm-32 32h-128v64h128V64zM480 192H288c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM448 256H320v64h128v-64zM224 192H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm-32 64H64v64h128v-64zM224 352H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM192 416H64v64h128v-64zM480 352H288c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM448 416H320v64h128v-64z"/></svg>);
const IconFlask = (props) => (<svg viewBox="0 0 448 512" fill="currentColor" {...props}><path d="M307.2 32C259.2 32 224 72 224 128v176c0 48-35.2 88-83.2 88h-32c-35.2 0-64-28.8-64-64 0-16 16-32 32-32 17.6 0 32-14.4 32-32s-14.4-32-32-32H32c-17.6 0-32 14.4-32 32v64c0 70.4 57.6 128 128 128h32c48 0 83.2-40 83.2-88v-176c0-56 35.2-96 83.2-96h32c17.6 0 32 14.4 32 32v160c0 17.6-14.4 32-32 32h-32c-17.6 0-32 14.4-32 32s14.4 32 32 32h32c52.8 0 96-43.2 96-96v-160c0-52.8-43.2-96-96-96zM112 304c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zM336 272c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32z"/></svg>);
const IconSeedling = (props) => (<svg viewBox="0 0 512 512" fill="currentColor" {...props}><path d="M288 32c0 16-16 32-32 32s-32-16-32-32c0-16 16-32 32-32s32 16 32 32zM256 96c-17.6 0-32 14.4-32 32v160c0 48-35.2 88-83.2 88h-32c-35.2 0-64-28.8-64-64 0-16 16-32 32-32s32-16 32-32-14.4-32-32-32H32c-17.6 0-32 14.4-32 32v64c0 70.4 57.6 128 128 128h32c48 0 83.2-40 83.2-88v-160c0-17.6-14.4-32-32-32z"/></svg>);
const IconCheckCircle = (props) => (<svg viewBox="0 0 512 512" fill="currentColor" {...props}><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"/></svg>);
const IconSpinner = (props) => (<svg viewBox="0 0 512 512" fill="currentColor" {...props}><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 171.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.476-21.408-47.91-47.886-47.954zM395.078 96c26.51 0 48-21.49 48-48s-21.49-48-48-48s-48 21.49-48 48s21.49 48 48 48zm48 12.922c0-26.51-21.49-48-48-48s-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48z"/></svg>);


export default function CustomerPage({ colors = {}, navigateTo, PAGES }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const darkText = colors.darkText || "#222";
  const lightGrey = colors.lightGrey || "#f0f4f7";
  const goldTan = colors.goldTan || "#a87f4c";
  const accent = colors.accent || "#0081C9";

  const [selectedHerb, setSelectedHerb] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [traceData, setTraceData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for Quality Prediction Model
  const [imageFile, setImageFile] = useState(null);
  const [qualityScore, setQualityScore] = useState(null);
  
  const handleTraceSearch = async () => {
    if (!searchTerm) {
      setError("Please enter a Herb ID to trace.");
      setTraceData(null);
      return;
    }
    setLoading(true);
    setError(null);
    setTraceData(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/trace_herb/${searchTerm}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch herb data.");
      }
      
      const data = await response.json();
      if (data.status === "success") {
        setTraceData(data.data);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
      setTraceData(null);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (herb) => {
    setSelectedHerb(herb);
  };

  const closeChat = () => {
    setSelectedHerb(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const scannedId = "0"; // Simulates a successful scan with Herb ID 0
      setSearchTerm(scannedId);
      handleTraceSearch(scannedId);
      setIsScanning(false);
    }, 2000);
  };

  // Function to handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setQualityScore(null);
    }
  };
  
  // Function to simulate taking a photo (placeholder)
  const handleTakePhoto = () => {
    // In a real app, this would open the camera and set the image file
    // For this example, we'll just simulate a file being "taken"
    const dummyImageFile = new File(["dummy content"], "photo.png", { type: "image/png" });
    setImageFile(dummyImageFile);
    setQualityScore(null);
  };

  const handlePredictQuality = () => {
    if (imageFile) {
      setQualityScore("Herb's Healthy");
    } else {
      setQualityScore("Please upload an image or take a photo first.");
    }
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

  const hardcodedHerbData = [{
    id: 0,
    name: "Ashwagandha",
    latitude: 28.6139,
    longitude: 77.2090,
    qualityCheck: {
      passed: true,
      testDate: "2023-01-05",
      batchNumber: "BATCH-0-1672531500"
    }
  }];

  return (
    <div className="min-h-[70vh] p-4 flex flex-col items-center">
      <div className="flex flex-col md:flex-row md:justify-between items-center w-full max-w-7xl mb-6">
        <h2 className="text-3xl font-bold text-center mb-4 md:mb-0" style={{ color: primaryGreen }}>
          Public Traceability Dashboard
        </h2>

        <motion.button
          onClick={() => navigateTo(PAGES.healthyLifestyle)}
          className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300"
          style={{ backgroundColor: goldTan }}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          <span>Explore Lifestyle Tips</span>
        </motion.button>
      </div>

      <p className="mb-6 max-w-2xl text-center" style={{ color: darkText }}>
        Explore verified herb records on the map, scan a product's QR code, or search for its ID to see its complete journey.
      </p>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">

        <div className="w-full lg:w-2/3 flex flex-col space-y-8">
            <div className="w-full bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: goldTan }}>
                <FaSearch className="mr-2" /> Find Your Product
                </h3>
                <div className="flex space-x-4">
                  <input
                      type="text"
                      placeholder="Search by Herb ID..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="flex-1 p-3 rounded-md border"
                  />
                  <button
                      onClick={handleTraceSearch}
                      className="p-3 rounded-md font-bold text-white transition-all duration-200"
                      style={{ backgroundColor: primaryGreen }}
                  >
                      {loading ? <IconSpinner className="animate-spin h-6 w-6" /> : <FaSearch className="inline-block" />}
                  </button>
                  <button
                      onClick={handleQrScan}
                      className="p-3 rounded-md font-bold text-white transition-all duration-200"
                      style={{ backgroundColor: goldTan }}
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
                <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: accent }}>
                    <BarChart2 className="mr-2" /> Herb Quality Prediction
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                    Upload a photo of your herb to get a quality assessment.
                </p>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
                    <label className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 cursor-pointer" style={{ backgroundColor: primaryGreen }}>
                        <FaCamera />
                        <span>Take Photo</span>
                        <input id="camera-upload" type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                    </label>
                    <label className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 cursor-pointer" style={{ backgroundColor: goldTan }}>
                        <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <span>Upload from Device</span>
                    </label>
                </div>
                {imageFile && (
                    <div className="text-center mt-4 mb-4">
                        <p className="text-gray-700">File selected: {imageFile.name}</p>
                    </div>
                )}
                <button
                    onClick={handlePredictQuality}
                    className="w-full p-3 rounded-md font-bold text-white transition-all duration-200"
                    style={{ backgroundColor: accent }}
                    disabled={!imageFile}
                >
                    Analyze Quality
                </button>
                <AnimatePresence>
                    {qualityScore && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-4 p-4 text-center rounded-lg shadow-inner"
                            style={{ backgroundColor: lightGrey }}
                        >
                            <p className="text-xl font-bold" style={{ color: darkText }}>
                                Predicted Quality: <span className="text-2xl" style={{ color: primaryGreen }}>{qualityScore}</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Map Section */}
            <div className="w-full" style={{ height: "500px" }}>
                <MapComponent openChat={openChat} colors={colors} herbDetails={hardcodedHerbData} />
            </div>
        </div>

        {/* Right Column */}
        <motion.div
          className="w-full lg:w-1/3 p-6 rounded-2xl shadow-xl"
          style={{ backgroundColor: lightGrey }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {loading && (
            <div className="flex justify-center items-center h-full">
              <IconSpinner className="animate-spin text-4xl" style={{ color: primaryGreen }} />
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {traceData ? (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: primaryGreen }}>
                <FaHistory className="mr-2" /> Traceability Report
              </h3>
              <div className="space-y-4">
                {/* Origin */}
                <div className="p-4 rounded-xl border-l-4" style={{ borderColor: goldTan, backgroundColor: "white" }}>
                  <p className="font-bold">Origin: {traceData.origin.name}</p>
                  <p className="text-sm">Location: {traceData.origin.latitude.toFixed(4)}, {traceData.origin.longitude.toFixed(4)}</p>
                  <p className="text-sm">Date: {new Date(traceData.origin.timestamp * 1000).toLocaleString()}</p>
                  <p className="text-sm">Farmer: {traceData.origin.farmer}</p>
                </div>
                {/* Processing Steps */}
                {traceData.processingHistory.map((step, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl border-l-4"
                    style={{ borderColor: primaryGreen, backgroundColor: "white" }}
                    variants={itemVariants}
                    custom={index + 1}
                  >
                    <p className="font-bold">Step {index + 1}: {step.action}</p>
                    <p className="text-sm">Processor: {step.processor}</p>
                    <p className="text-sm">Date: {new Date(step.timestamp * 1000).toLocaleString()}</p>
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