import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaUpload, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaHistory, FaLeaf, FaTimes } from "react-icons/fa";

function HerbForm({ colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const goldTan = colors.goldTan || "#a87f4f";
  const lightGrey = colors.lightGrey || "#f0f4f7";

  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); // New state to hold the file object
  const [location, setLocation] = useState({ lat: null, lng: null, timestamp: null, id: null });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const [identificationResult, setIdentificationResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const generateId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  const startCamera = async () => {
    setImage(null);
    setFile(null); // Reset the file state
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      setError("Could not access camera. Please allow camera permissions.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const photo = canvasRef.current.toDataURL("image/png");
      
      // Convert Data URL to Blob, then to File for API submission
      const byteString = atob(photo.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'image/png' });
      const photoFile = new File([blob], "herb-photo.png", { type: 'image/png' });

      setImage(photo);
      setFile(photoFile); // Set the file state
      stopCamera();
    }
  };

  const handleImageUpload = (e) => {
    setError("");
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
      setFile(uploadedFile); // Set the file state
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const getLocation = () => {
    setError("");
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString(),
            id: generateId(),
          });
          setLoading(false);
          setStep(4);
        },
        (err) => {
          setError("Could not retrieve location. Please check your browser settings.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Connects to the FastAPI /submit_herb endpoint for identification
  const handleIdentification = async () => {
    setLoading(true);
    setError("");
    if (!file) { // Use the `file` state
      setError("Please take a photo or upload an image first.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("latitude", 0); // Placeholder, as latitude and longitude are required but not used for identification.
    formData.append("longitude", 0);
    formData.append("image_file", file); // Send the file object

    try {
        const response = await fetch("http://127.0.0.1:8000/submit_herb/", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        
        if (data.status === "success") {
            setIdentificationResult({
                herb: data.ai_result.verified_species,
                confidence: parseFloat(data.ai_result.confidence),
            });
            setStep(2); // Move to the confirmation step
        } else {
            setError(data.message || "An error occurred during identification.");
        }
    } catch (err) {
        setError("Failed to connect to the identification service. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // Submits to the FastAPI /submit_herb endpoint with real data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!file || !location.lat) {
        setError("Missing image or location data.");
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);
    formData.append("image_file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/submit_herb/", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.status === "success") {
            setSuccessMessage("Your herb entry has been successfully submitted!");
            setHistory((prevHistory) => [...prevHistory, { 
                ...location, 
                image, 
                identifiedHerb: identificationResult?.herb, 
                id: generateId(),
            }]);
            setStep(5);
        } else {
            setError(data.message || "An error occurred during submission.");
        }
    } catch (err) {
        setError("Failed to submit data. Please check the backend connection.");
    } finally {
        setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setImage(null);
    setFile(null); // Reset the file state
    setLocation({ lat: null, lng: null, timestamp: null, id: null });
    setError("");
    setSuccessMessage("");
    setIdentificationResult(null);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 min-h-[70vh]"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: primaryGreen }}>
          Herb Contribution Form
        </h1>
        <div className="flex justify-between w-full mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
                  step >= s ? "scale-110" : "scale-100"
                }`}
                style={{ backgroundColor: step >= s ? primaryGreen : lightGrey }}
              >
                {step > s ? <FaCheckCircle /> : s}
              </div>
              <span className={`text-sm mt-1 ${step >= s ? "font-semibold" : "text-gray-500"}`}>
                Step {s}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <motion.div
            className="p-4 rounded-xl text-center font-medium bg-red-100 text-red-600 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-4">Capture Herb Image</h2>
              <p className="mb-6 text-gray-600">
                Use your camera or upload a photo of the herb you are contributing.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4">
                {image ? (
                  <div className="relative w-full max-w-xs">
                    <img src={image} alt="Herb" className="rounded-lg shadow-lg max-h-64 object-contain mx-auto" />
                    <button
                      onClick={() => { setImage(null); setFile(null); }}
                      className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center" style={{ borderColor: lightGrey }}>
                    <div className="flex flex-col items-center text-gray-400">
                      <FaCamera size={48} />
                      <p className="mt-2 text-sm">No image captured or uploaded</p>
                    </div>
                  </div>
                )}
                {isCameraActive && (
                  <video ref={videoRef} autoPlay playsInline className="w-full max-w-xs rounded-lg shadow-lg" />
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={isCameraActive ? takePhoto : startCamera}
                    className="flex items-center space-x-2 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                    style={{ backgroundColor: primaryGreen }}
                  >
                    <FaCamera />
                    <span>{isCameraActive ? "Take Photo" : "Open Camera"}</span>
                  </button>
                  <label htmlFor="file-upload" className="flex items-center space-x-2 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 cursor-pointer" style={{ backgroundColor: goldTan }}>
                    <FaUpload />
                    <span>Upload Image</span>
                  </label>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>
              {image && (
                <button
                  onClick={handleIdentification}
                  className="mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                  style={{ backgroundColor: primaryGreen }}
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Identify Herb"}
                </button>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-4">Confirm Identification</h2>
              <p className="mb-6 text-gray-600">
                The AI model has analyzed the image. Please confirm the result.
              </p>
              <div className="p-6 rounded-xl shadow-lg border-l-4" style={{ borderColor: primaryGreen, backgroundColor: lightGrey }}>
                <h3 className="text-xl font-bold mb-2 flex items-center justify-center" style={{ color: primaryGreen }}>
                    <FaLeaf className="mr-2" />
                    Predicted Herb: {identificationResult.herb}
                </h3>
                <p className="font-semibold text-sm text-gray-600">
                    Confidence: <span style={{ color: primaryGreen }}>{identificationResult.confidence}%</span>
                </p>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Go Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                  style={{ backgroundColor: primaryGreen }}
                >
                  Confirm and Continue
                </button>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-4">Capture Location</h2>
              <p className="mb-6 text-gray-600">
                Please allow us to use your device's location to geotag this entry.
              </p>
              {location.lat && (
                <div className="mb-4 p-4 rounded-xl shadow-inner font-mono text-sm" style={{ backgroundColor: lightGrey }}>
                  <p>Location captured successfully:</p>
                  <p>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                  <p className="text-xs text-gray-500">{location.timestamp}</p>
                </div>
              )}
              <button
                onClick={getLocation}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: primaryGreen }}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Get Location"}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-4">Review & Submit</h2>
              <p className="mb-6 text-gray-600">
                Review your details before submitting to the blockchain.
              </p>
              <div className="p-6 rounded-xl shadow-lg border-l-4 text-left" style={{ borderColor: primaryGreen, backgroundColor: lightGrey }}>
                <p><strong>Herb:</strong> {identificationResult.herb}</p>
                <p><strong>Location:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                <p><strong>Timestamp:</strong> {new Date(location.timestamp).toLocaleString()}</p>
                {image && <img src={image} alt="Review" className="mt-4 rounded-lg shadow-md max-h-48 object-contain" />}
              </div>
              <button
                onClick={handleSubmit}
                className="mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: goldTan }}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Submit to Blockchain"}
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
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
                      <p><strong>Herb:</strong> {entry.identifiedHerb || 'N/A'}</p>
                      <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {entry.location ? (
                            `${entry.location.lat.toFixed(4)}, ${entry.location.lng.toFixed(4)}`
                        ) : (
                            "Not available"
                        )}
                      </p>
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