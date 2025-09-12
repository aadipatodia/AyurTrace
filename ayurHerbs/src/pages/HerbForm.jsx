import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaUpload, FaMapMarkerAlt, FaCheckCircle, FaSpinner, FaTimes, FaEdit, FaQrcode } from "react-icons/fa";

function HerbForm({ colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const goldTan = colors.goldTan || "#a87f4f";
  const lightGrey = colors.lightGrey || "#f0f4f7";
  // ... inside your HerbForm component
  const [isEditingHerbName, setIsEditingHerbName] = useState(false);

  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [identificationResult, setIdentificationResult] = useState(null);
  const [editedHerbName, setEditedHerbName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [herbId, setHerbId] = useState(null); // New state for herb ID

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setImage(null);
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
      setImage(photo);
      stopCamera();
    }
  };

  const handleImageUpload = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const identifyAndSubmit = async () => {
    setLoading(true);
    setError("");
    setIdentificationResult(null);
    setLocation(null);
    setEditedHerbName("");
    setSubmissionStatus(null);
    setQrCodeUrl(null);
    setHerbId(null);

    if (!image) {
      setError("Please take a photo or upload an image first.");
      setLoading(false);
      return;
    }

    try {
      const locationPromise = new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }),
            (err) => reject("Could not retrieve location. Please check your browser settings."),
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          reject("Geolocation is not supported by this browser.");
        }
      });

      const imageBlob = await fetch(image).then(res => res.blob());
      const file = new File([imageBlob], "herb_image.png", { type: "image/png" });

      const locationData = await locationPromise;
      setLocation(locationData);

      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("latitude", locationData.lat);
      formData.append("longitude", locationData.lng);

      const response = await fetch("http://127.0.0.1:8000/submit_herb/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.status === "success") {
        setIdentificationResult({
          herb: data.ai_result.verified_species,
          confidence: parseFloat(data.ai_result.confidence),
        });
        setEditedHerbName(data.ai_result.verified_species);
        setHerbId(data.herb_id); // Store the herb ID

        // Fetch the QR code from the new backend endpoint
        const qrResponse = await fetch(`http://127.0.0.1:8000/generate_qr/${data.herb_id}`);
        const qrBlob = await qrResponse.blob();
        setQrCodeUrl(URL.createObjectURL(qrBlob));

        setSubmissionStatus("success");
      } else {
        setError(data.message);
        setSubmissionStatus("error");
      }
    } catch (err) {
      setError(`An error occurred: ${err}`);
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleManualCorrection = async () => {
    // This function is a placeholder for a potential manual correction endpoint.
    // The current backend does not have an endpoint for this.
    // In a real application, you would send the `editedHerbName` to the backend.
    setSubmissionStatus("success");
  };


  const resetForm = () => {
    setImage(null);
    setLocation(null);
    setError("");
    setIdentificationResult(null);
    setEditedHerbName("");
    setSubmissionStatus(null);
    setQrCodeUrl(null);
    setHerbId(null);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 min-h-[70vh]"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: primaryGreen }}>
          Herb Contribution
        </h1>
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
          {submissionStatus === null && (
            <motion.div key="input" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="text-center">
              <h2 className="text-3xl font-semibold mb-4">Capture Herb Image</h2>
              <p className="mb-6 text-gray-600">
                Use your camera or upload a photo of the herb you are contributing.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4">
                {image ? (
                  <div className="relative w-full max-w-xs">
                    <img src={image} alt="Herb" className="rounded-lg shadow-lg max-h-64 object-contain mx-auto" />
                    <button
                      onClick={() => setImage(null)}
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
                <div className="flex space-x-4">
                  <button
                    onClick={startCamera}
                    className="flex items-center space-x-2 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                    style={{ backgroundColor: primaryGreen }}
                  >
                    <FaCamera />
                    <span>Open Camera</span>
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
                  onClick={identifyAndSubmit}
                  className="mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                  style={{ backgroundColor: primaryGreen }}
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Identify & Submit"}
                </button>
              )}
            </motion.div>
          )}

          {submissionStatus === "review" && (
            <motion.div key="review" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="text-center">
              <h2 className="text-3xl font-semibold mb-4">Confirm Details</h2>
              <p className="mb-6 text-gray-600">
                Please review the identified herb and location. You can manually correct the name if needed.
              </p>
              <div className="p-6 rounded-xl shadow-lg border-l-4 text-left" style={{ borderColor: primaryGreen, backgroundColor: lightGrey }}>
                <p className="font-bold">Herb Name:</p>
                <div className="flex items-center space-x-2 mt-1 mb-4">
                  <input
                    type="text"
                    value={editedHerbName}
                    onChange={(e) => setEditedHerbName(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: lightGrey, backgroundColor: 'white', color: primaryGreen }}
                  />
                  <FaEdit style={{ color: primaryGreen }} />
                </div>
                {location && (
                  <>
                    <p className="font-bold">Location:</p>
                    <p className="font-mono text-sm">{location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}</p>
                  </>
                )}
                {identificationResult?.confidence && (
                  <p className="font-semibold text-sm text-gray-600 mt-2">
                    AI Confidence: <span style={{ color: primaryGreen }}>{identificationResult.confidence?.toFixed(2)}%</span>
                  </p>
                )}
                {image && <img src={image} alt="Review" className="mt-4 rounded-lg shadow-md max-h-48 object-contain" />}
              </div>
              <button
                onClick={handleManualCorrection}
                className="mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: primaryGreen }}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mx-auto" /> : "Confirm and Finalize Submission"}
              </button>
              <button
                onClick={resetForm}
                className="mt-4 w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Start New Entry
              </button>
            </motion.div>
          )}

          {submissionStatus === "success" && (
  <motion.div
    key="success"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
  >

    {/* Final, Polished Layout */}
    <div
      className="p-6 rounded-2xl shadow-lg border-l-4"
      style={{
        borderColor: primaryGreen,
        backgroundColor: lightGrey,
      }}
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col space-y-4">
          {/* Top Text Details */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-bold text-gray-500">
                Herb Name
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={editedHerbName}
                  onChange={(e) => setEditedHerbName(e.target.value)}
                  readOnly={!isEditingHerbName}
                  className={`w-full text-2xl font-semibold bg-transparent p-1 rounded-md ${
                    isEditingHerbName && "bg-white shadow-inner"
                  }`}
                  style={{ color: primaryGreen }}
                />
                <button
                  onClick={() => setIsEditingHerbName(!isEditingHerbName)}
                  className="p-1 rounded-md hover:bg-gray-200"
                >
                  <FaEdit size={16} style={{ color: primaryGreen }} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-500">
                Location
              </label>
              <p className="font-mono text-2xl p-1">
                {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Bottom Image */}
          {image && (
            <img
              src={image}
              alt="Submitted Herb"
              className="rounded-lg shadow-md w-full h-auto object-contain mt-1" // Ensures no cropping
            />
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Bigger QR Code */}
          {qrCodeUrl && (
            <div className="p-2 bg-white rounded-lg text-center shadow-lg">
              <img
                src={qrCodeUrl}
                alt="QR Code for Herb"
                className="mx-auto w-50 h-50" // Larger QR code
              />
            </div>
          )}

          {/* Single-line Herb ID */}
          <div className="flex items-center justify-center space-x-3 bg-gray-200 px-4 py-2 rounded-lg">
            <label className="text-xl font-bold text-gray-600">
              Herb ID:
            </label>
            <p className="font-mono text-2xl font-semibold">
              {herbId}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Action Button */}
    <div className="mt-6">
      <button
        onClick={resetForm}
        className="w-full py-4 px-6 rounded-lg font-semibold text-white text-lg"
        style={{ backgroundColor: primaryGreen }}
      >
        Start New Entry
      </button>
    </div>
  </motion.div>
)}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default HerbForm;