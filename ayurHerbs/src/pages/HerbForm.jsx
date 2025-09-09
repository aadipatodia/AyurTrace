import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaUpload, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaHistory } from "react-icons/fa";

function HerbForm({ colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const goldTan = colors.goldTan || "#a87f4f";
  const lightGrey = colors.lightGrey || "#f0f4f7";

  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null, timestamp: null, id: null });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const generateId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  const startCamera = async () => {
    setImage(null);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing the camera:", err);
      setError("Unable to access your camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/png');
    setImage(photoDataUrl);
    stopCamera();
    nextStep();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setError("");
      nextStep();
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError("");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          id: generateId(),
        });
        setLoading(false);
        nextStep();
      },
      (geoError) => {
        setError("Unable to retrieve your location. " + geoError.message);
        setLoading(false);
      }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      // Simulate API call to upload data
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newEntry = {
        id: location.id,
        image,
        location,
        date: new Date().toISOString().split("T")[0],
      };
      setHistory((prevHistory) => [newEntry, ...prevHistory]);
      setSuccessMessage("Herb entry submitted successfully!");
      setLoading(false);
      setStep(4);
    } catch (submitError) {
      setError("Failed to submit data. Please try again.");
      setLoading(false);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const resetForm = () => {
    setStep(1);
    setImage(null);
    setLocation({ lat: null, lng: null, timestamp: null, id: null });
    setSuccessMessage("");
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 50, scale: 0.8 },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="flex flex-col items-center p-8 min-h-[70vh] relative"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <h1 className="text-4xl font-extrabold mb-4" style={{ color: primaryGreen }}>
        Add a New Herb Entry
      </h1>
      <p className="text-lg mb-8 text-center max-w-xl" style={{ color: colors.darkText }}>
        Follow the steps to document a new herb:
      </p>

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 transition-colors duration-500 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Image Capture/Upload */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-6">Step 1: Add a Photo</h2>
              <p className="mb-4">Choose how you would like to add an image of the herb.</p>
              
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                <button
                  onClick={startCamera}
                  className="py-3 px-6 rounded-lg font-bold text-white transition-all duration-200"
                  style={{ backgroundColor: goldTan }}
                >
                  <FaCamera className="inline-block mr-2" />
                  Take Photo
                </button>
                <label className="py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 cursor-pointer" style={{ backgroundColor: primaryGreen }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <FaUpload className="inline-block mr-2" />
                  Upload Image
                </label>
              </div>

              {isCameraActive && (
                <div className="mt-8 flex flex-col items-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-lg" />
                  <button onClick={takePhoto} className="mt-4 py-3 px-6 rounded-lg font-bold text-white" style={{ backgroundColor: goldTan }}>
                    Capture Photo
                  </button>
                  <button onClick={stopCamera} className="mt-2 py-2 px-4 rounded-lg text-sm text-gray-600">
                    Cancel Camera
                  </button>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              )}
              {error && <p className="text-red-500 font-bold text-center mt-4">{error}</p>}
            </motion.div>
          )}

          {/* Step 2: Location and Review */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-6">Step 2: Get Location</h2>
              {image && (
                <img
                  src={image}
                  alt="Captured Herb"
                  className="w-full h-auto rounded-lg mb-4 shadow-lg"
                />
              )}
              <p className="text-lg font-medium mb-4">Click to add the current location.</p>
              <button
                onClick={getLocation}
                disabled={loading}
                className={`py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin inline-block mr-2" />
                ) : (
                  <FaMapMarkerAlt className="inline-block mr-2" />
                )}
                {loading ? "Fetching Location..." : "Get My Location"}
              </button>
              {error && <p className="text-red-500 font-bold text-center mt-4">{error}</p>}
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevStep}
                  className="py-3 px-6 rounded-lg font-semibold bg-gray-300 text-gray-800 transition-colors"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation and Submit */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-6">Step 3: Confirm & Submit</h2>
              {image && (
                <img
                  src={image}
                  alt="Captured Herb"
                  className="w-full h-auto rounded-lg mb-4 shadow-lg"
                />
              )}
              <p className="font-medium">Please review the details before submitting.</p>
              {location.lat && (
                <p className="font-medium">
                  Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
              {successMessage && <p className="text-green-600 font-bold text-center mt-4">{successMessage}</p>}
              {error && <p className="text-red-500 font-bold text-center mt-4">{error}</p>}

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
          
          {/* Step 4: Submission History */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-6">Submission History</h2>
              <p className="text-green-600 font-bold mb-4">{successMessage}</p>
              <div className="space-y-4 text-left">
                {history.length > 0 ? (
                  history.map((entry) => (
                    <div key={entry.id} className="p-4 rounded-lg border" style={{ borderColor: lightGrey }}>
                      <p><strong>ID:</strong> {entry.id}</p>
                      <p><strong>Date:</strong> {entry.date}</p>
                      <p><strong>Location:</strong> {entry.location.lat.toFixed(4)}, {entry.location.lng.toFixed(4)}</p>
                    </div>
                  ))
                ) : (
                  <p>No submission history found.</p>
                )}
              </div>
              <button
                onClick={resetForm}
                className="mt-6 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: primaryGreen }}
              >
                Start New Entry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default HerbForm;