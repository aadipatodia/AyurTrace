import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaQrcode, FaSearch, FaPlusCircle, FaHistory, FaCamera, FaSpinner } from "react-icons/fa";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Processor({ colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const darkText = colors.darkText || "#222";
  const lightGrey = colors.lightGrey || "#f0f4f7";
  const goldTan = colors.goldTan || "#a87f4c";

  const [searchTerm, setSearchTerm] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [qrCodeScanner, setQrCodeScanner] = useState(null);

  // New states for fetching and displaying data
  const [verifiedHerbData, setVerifiedHerbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingHerbId, setProcessingHerbId] = useState("");
  const [processingAction, setProcessingAction] = useState("");
  const [processingHistory, setProcessingHistory] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isScanning && !qrCodeScanner) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-code-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      html5QrcodeScanner.render(onScanSuccess, onScanError);
      setQrCodeScanner(html5QrcodeScanner);
    }
    return () => {
      if (qrCodeScanner) {
        qrCodeScanner.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
        setQrCodeScanner(null);
      }
    };
  }, [isScanning]);

  const onScanSuccess = (decodedText) => {
    console.log(`Scan result: ${decodedText}`);
    const urlParts = decodedText.split('/');
    const herbId = urlParts[urlParts.length - 1];
    setSearchTerm(herbId);
    setProcessingHerbId(herbId);
    setIsScanning(false);
    handleSearch(herbId); // Automatically trigger search after scan
  };

  const onScanError = (error) => {
    console.warn(`QR code scan error: ${error}`);
  };

  const handleQrScan = () => {
    setIsScanning(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (herbId = searchTerm) => {
    if (!herbId) {
      setError("Please enter a Herb ID to search.");
      setVerifiedHerbData(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/trace_herb/${herbId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.status === "success") {
        setVerifiedHerbData(data.data);
        setError(null);
        setProcessingHerbId(herbId);
      } else {
        setError(data.message || "Herb ID not found.");
        setVerifiedHerbData(null);
      }
    } catch (err) {
      setError(`An error occurred while fetching data: ${err.message}`);
      setVerifiedHerbData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!processingHerbId || !processingAction) {
      setMessage("Herb ID and Action are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", processingAction);

      const response = await fetch(`http://127.0.0.1:8000/process_herb/${processingHerbId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.status === "success") {
        setMessage("Processing step added successfully!");
        setProcessingAction("");
        setProcessingHerbId("");
        // Optionally, refresh the displayed data after a successful submission
        handleSearch(processingHerbId);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage(`An error occurred: ${err.message}`);
    }
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
          Check and verify herb batch details including location and authenticity.
        </p>
      </motion.div>

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
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center items-center">
          <motion.button
            className="px-6 py-3 rounded-full font-bold text-lg text-white shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
            style={{ backgroundColor: primaryGreen }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQrScan}
          >
            <FaQrcode className="mr-2" /> Scan QR Code
          </motion.button>
          <div className="relative w-full md:w-auto flex-1">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter Herb ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-6 py-3 rounded-full font-bold text-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none transition-all"
              />
              <motion.button
                type="button"
                className="ml-2 px-4 py-3 rounded-full font-bold text-lg text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: goldTan }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSearch()}
              >
                <FaSearch />
              </motion.button>
            </div>
          </div>
        </div>

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
              <div id="qr-code-reader" style={{ width: '100%', maxWidth: '300px' }}></div>
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
                placeholder="e.g., 123"
                className="w-full p-2 border rounded"
                disabled={!verifiedHerbData}
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
                disabled={!verifiedHerbData}
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: primaryGreen }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!verifiedHerbData}
            >
              Submit Step
            </motion.button>
            {message && <p className="mt-2 text-sm text-center font-semibold" style={{ color: primaryGreen }}>{message}</p>}
          </form>
        </motion.div>

        <motion.div
          className="w-full md:w-1/3 p-6 rounded-2xl shadow-xl"
          style={{ backgroundColor: lightGrey }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: primaryGreen }}>
            <FaMapMarkerAlt className="mr-2" /> Herb Details
          </h3>
          {loading && <FaSpinner className="animate-spin text-4xl mx-auto" style={{ color: primaryGreen }} />}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {verifiedHerbData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p><strong>Name:</strong> {verifiedHerbData.origin.name}</p>
              <p><strong>AI Confidence:</strong> {verifiedHerbData.origin.confidenceScore}%</p>
              <p><strong>Farmer:</strong> {verifiedHerbData.origin.farmer}</p>
              <p><strong>Location:</strong> {verifiedHerbData.origin.latitude.toFixed(4)}, {verifiedHerbData.origin.longitude.toFixed(4)}</p>
              <p><strong>Timestamp:</strong> {new Date(verifiedHerbData.origin.timestamp * 1000).toLocaleString()}</p>
              
              <h4 className="font-bold mt-4" style={{ color: darkText }}>Processing History:</h4>
              <ul className="list-disc list-inside space-y-2">
                {verifiedHerbData.processingHistory.length > 0 ? (
                  verifiedHerbData.processingHistory.map((step, index) => (
                    <li key={index}>
                      <p><strong>Action:</strong> {step.action}</p>
                      <p className="text-sm text-gray-600">Batch: {step.batchNumber}</p>
                      <p className="text-sm text-gray-600">Processor: {step.processor}</p>
                      <p className="text-xs text-gray-500">Time: {new Date(step.timestamp * 1000).toLocaleString()}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No processing steps recorded yet.</p>
                )}
              </ul>
            </motion.div>
          )}
          {!loading && !error && !verifiedHerbData && (
            <p className="text-center text-gray-500">Search for a herb ID to see its details.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}