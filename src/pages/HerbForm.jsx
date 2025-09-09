import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaHistory } from "react-icons/fa";

function HerbForm({ colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const goldTan = colors.goldTan || "#a87f4c";
  const lightGrey = colors.lightGrey || "#f0f4f7";

  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null, timestamp: null, id: null });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setError("");
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: new Date().toLocaleTimeString(),
          id: generateId(),
        };
        setLocation(newLocation);
        setHistory(prev => [newLocation, ...prev]);
        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to retrieve your location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!image || !location.lat) {
      setError("Please upload an image and capture location.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await new Promise((res) => setTimeout(res, 1500));
      setSuccessMessage("Herb entry submitted successfully!");
      setStep(1);
      setImage(null);
      setLocation({ lat: null, lng: null, timestamp: null, id: null });
    } catch {
      setError("Something went wrong with the submission.");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ stepNumber, label, currentStep }) => (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300
          ${currentStep >= stepNumber ? "bg-green-600" : "bg-gray-400"}`}
      >
        {currentStep > stepNumber ? <FaCheckCircle /> : stepNumber}
      </div>
      <span className="text-sm mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center p-8 min-h-[70vh] bg-gray-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-xl transition-colors duration-500">
        <h2 className="text-4xl font-extrabold text-center mb-6" style={{ color: primaryGreen }}>
          🌿 Herb Entry Wizard
        </h2>

        <div className="flex justify-around items-center mb-8">
          <StepIndicator stepNumber={1} label="Upload Image" currentStep={step} />
          <div className="flex-1 h-1 mx-2" style={{ backgroundColor: step > 1 ? primaryGreen : lightGrey }} />
          <StepIndicator stepNumber={2} label="Capture Location" currentStep={step} />
          <div className="flex-1 h-1 mx-2" style={{ backgroundColor: step > 2 ? primaryGreen : lightGrey }} />
          <StepIndicator stepNumber={3} label="Review & Submit" currentStep={step} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-6"
            >
              <label className="text-lg font-semibold flex items-center">
                <FaUpload className="inline-block mr-2 text-gray-500" />
                Upload Image
              </label>
              <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-green-500 transition-colors" style={{ borderColor: image ? primaryGreen : lightGrey }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="w-full text-center">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Click to select an image or drag & drop</p>
                  )}
                </label>
              </div>
              <button
                onClick={nextStep}
                disabled={!image}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-200 ${
                  image ? `bg-green-600 hover:bg-green-700` : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Next Step
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-6"
            >
              <label className="text-lg font-semibold flex items-center justify-center">
                <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" />
                Capture Location
              </label>
              <button
                type="button"
                onClick={getLocation}
                disabled={loading}
                className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200"
                style={{ backgroundColor: goldTan }}
              >
                {loading ? <FaSpinner className="animate-spin inline-block mr-2" /> : <FaMapMarkerAlt className="inline-block mr-2" />}
                {loading ? "Capturing..." : "Capture Location"}
              </button>
              {location.lat && (
                <p className="text-green-600 font-medium text-center">
                  <FaCheckCircle className="inline-block mr-1" />
                  Location Captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center justify-center">
                  <FaHistory className="inline-block mr-2 text-gray-500" />
                  Location History
                </h3>
                <div className="h-40 overflow-y-auto bg-gray-50 rounded-lg p-3">
                  {history.length > 0 ? (
                    history.map((loc) => (
                      <div key={loc.id} className="p-2 border-b border-gray-200 last:border-b-0">
                        <p className="text-sm text-gray-700">Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}</p>
                        <p className="text-xs text-gray-500">Time: {loc.timestamp}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-4">No location history yet.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevStep}
                  className="py-3 px-6 rounded-lg font-semibold bg-gray-300 text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!location.lat}
                  className={`py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                    location.lat ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col space-y-6"
            >
              <p className="text-center text-lg font-semibold">Review and Submit</p>
              {image && (
                <div className="flex flex-col items-center">
                  <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2 border" />
                  <p className="text-sm text-gray-500">Image to be submitted</p>
                </div>
              )}
              {location.lat && (
                <p className="text-center font-medium">
                  Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
              {successMessage && <p className="text-green-600 font-bold text-center">{successMessage}</p>}
              {error && <p className="text-red-500 font-bold text-center">{error}</p>}

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevStep}
                  className="py-3 px-6 rounded-lg font-semibold bg-gray-300 text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin inline-block mr-2" />
                  ) : (
                    <FaCheckCircle className="inline-block mr-2" />
                  )}
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HerbForm;