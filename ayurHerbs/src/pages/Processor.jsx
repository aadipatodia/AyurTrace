import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaQrcode, FaSearch, FaPlusCircle, FaHistory, FaCamera } from "react-icons/fa";

export default function Processor({ colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const darkText = colors.darkText || "#222";
  const lightGrey = colors.lightGrey || "#f0f4f7";
  const goldTan = colors.goldTan || "#a87f4c";

  // Dummy data for demonstration
  const allHerbEntries = [
    { id: "batch-1a2b3c", name: "Echinacea", location: "40.7128, -74.0060", date: "2025-09-01" },
    { id: "batch-4d5e6f", name: "Lavender", location: "34.0522, -118.2437", date: "2025-08-28" },
    { id: "batch-7g8h9i", name: "Chamomile", location: "51.5074, -0.1278", date: "2025-09-02" },
    { id: "batch-1j2k3l", name: "Peppermint", location: "34.0522, -118.2437", date: "2025-09-03" },
  ];

  // State for search and QR code scanning
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEntries, setFilteredEntries] = useState(allHerbEntries);
  const [isScanning, setIsScanning] = useState(false);

  // New states for the processing form
  const [processingHerbId, setProcessingHerbId] = useState("");
  const [processingAction, setProcessingAction] = useState("");
  const [processingBatchNumber, setProcessingBatchNumber] = useState("");
  const [processingHistory, setProcessingHistory] = useState([]);
  const [message, setMessage] = useState("");

  // Filter entries whenever the search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = allHerbEntries.filter(entry =>
        entry.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(allHerbEntries);
    }
  }, [searchTerm]);

  const handleQrScan = () => {
    setIsScanning(true);
    // Simulate a successful scan after 2 seconds
    setTimeout(() => {
      const scannedId = "batch-4d5e6f"; // Example scanned batch ID
      setSearchTerm(scannedId);
      setIsScanning(false);
    }, 2000);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleProcessSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!processingHerbId || !processingAction || !processingBatchNumber) {
      setMessage("All fields are required.");
      return;
    }

    const newEntry = {
      herbId: processingHerbId,
      action: processingAction,
      batchNumber: processingBatchNumber,
      timestamp: new Date().toISOString(),
    };
    
    // Simulate adding to history
    setProcessingHistory([newEntry, ...processingHistory]);
    setMessage("Processing step added successfully!");

    // Clear the form
    setProcessingHerbId("");
    setProcessingAction("");
    setProcessingBatchNumber("");
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-4" style={{ color: primaryGreen }}>
          <span style={{ color: goldTan }}>Processor</span> Dashboard
        </h1>
        <p className="max-w-3xl mx-auto text-lg" style={{ color: darkText }}>
          Check and verify herb batch details including location and authenticity using our processor tools.
        </p>
      </motion.div>

      {/* Verify a Batch Section */}
      <motion.div
        className="w-full max-w-2xl relative rounded-2xl overflow-hidden shadow-2xl p-8 text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ backgroundColor: lightGrey }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: primaryGreen }}>
          Verify a Batch 🔍
        </h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
          <motion.button
            className="px-6 py-3 rounded-full font-bold text-lg text-white shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
            style={{ backgroundColor: primaryGreen }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQrScan}
          >
            <FaQrcode className="mr-2" /> Scan QR Code
          </motion.button>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Batch ID..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-6 py-3 rounded-full font-bold text-lg border-2 border-transparent focus:border-green-500 focus:outline-none transition-all"
            />
            <div className="absolute right-0 top-0 flex items-center h-full px-4 text-gray-400">
              <FaSearch className="text-xl" />
            </div>
          </div>
        </div>
        
        {/* QR Code Scanning UI */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 rounded-lg bg-gray-100 flex flex-col items-center text-center"
            >
              <FaCamera className="text-4xl mb-2 text-gray-600" />
              <p className="font-semibold text-gray-700">Scanning for QR code...</p>
              <p className="text-sm text-gray-500">
                (A camera feed would appear here in a real application)
              </p>
              <button
                onClick={() => setIsScanning(false)}
                className="mt-2 text-sm text-red-500 font-semibold"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <motion.div
          className="w-full md:w-2/3 rounded-2xl shadow-xl overflow-hidden p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ backgroundColor: lightGrey }}
        >
          {/* Form for adding a processing step */}
          <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: primaryGreen }}>
            <FaPlusCircle className="mr-2" /> Add Processing Step
          </h2>
          <form onSubmit={handleProcessSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: darkText }}>
                Herb ID
              </label>
              <input
                type="text"
                value={processingHerbId}
                onChange={(e) => setProcessingHerbId(e.target.value)}
                placeholder="e.g., batch-4d5e6f"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: darkText }}>
                Action Performed
              </label>
              <input
                type="text"
                value={processingAction}
                onChange={(e) => setProcessingAction(e.target.value)}
                placeholder="e.g., Packaged, Dried"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: darkText }}>
                Batch Number
              </label>
              <input
                type="text"
                value={processingBatchNumber}
                onChange={(e) => setProcessingBatchNumber(e.target.value)}
                placeholder="e.g., BATCH-001"
                className="w-full p-2 border rounded"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: primaryGreen }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Step
            </motion.button>
            {message && <p className="mt-2 text-sm text-center font-semibold" style={{ color: primaryGreen }}>{message}</p>}
          </form>
        </motion.div>

        {/* Recent Herb Entries Section */}
        <motion.div
          className="w-full md:w-1/3 p-6 rounded-2xl shadow-xl"
          style={{ backgroundColor: lightGrey }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: primaryGreen }}>
            <FaMapMarkerAlt className="mr-2" /> Recent Herb Entries
          </h3>
          <motion.ul
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <motion.li
                  key={entry.id}
                  className="p-4 rounded-xl border-l-4"
                  style={{ borderColor: goldTan, backgroundColor: "white" }}
                  variants={itemVariants}
                  custom={index}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{entry.name}</span>
                    <span className="text-xs font-mono text-gray-500">ID: {entry.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Location: {entry.location}</p>
                  <p className="text-xs text-gray-400">Date: {entry.date}</p>
                </motion.li>
              ))
            ) : (
              <p className="text-center text-gray-500">No matching entries found.</p>
            )}
          </motion.ul>
        </motion.div>
      </div>

      {/* Processing History Section */}
      {processingHistory.length > 0 && (
        <motion.div
          className="w-full max-w-7xl mt-8 p-6 rounded-2xl shadow-xl"
          style={{ backgroundColor: lightGrey }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: primaryGreen }}>
            <FaHistory className="mr-2" /> Processing History
          </h3>
          <ul className="space-y-4">
            {processingHistory.map((step, index) => (
              <li key={index} className="p-4 rounded-xl border-l-4" style={{ borderColor: goldTan, backgroundColor: "white" }}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Herb ID: {step.herbId}</span>
                  <span className="text-xs font-mono text-gray-500">{new Date(step.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Action: {step.action}</p>
                <p className="text-xs text-gray-400">Batch Number: {step.batchNumber}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}