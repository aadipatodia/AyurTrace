import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaSignInAlt, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

export default function AuthPage({ colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const lightGrey = colors.lightGrey || "#f0f4f7";
  const goldTan = colors.goldTan || "#a87f4c";

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const title = isLogin ? "Welcome Back" : "Join Us";
  const actionButtonText = isLogin ? "Log In" : "Sign Up";
  const toggleText = isLogin ? "Don't have an account?" : "Already have an account?";
  const toggleLinkText = isLogin ? "Sign Up" : "Log In";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (isLogin) {
        setSuccess("Logged in successfully! Redirecting...");
      } else {
        setSuccess("Account created successfully! Please log in.");
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-[70vh] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transition-colors duration-500">
        <motion.h2
          key={isLogin ? "login" : "signup"}
          className="text-4xl font-extrabold text-center mb-6"
          style={{ color: primaryGreen }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {isLogin ? <FaSignInAlt className="inline-block mr-2" /> : <FaUserPlus className="inline-block mr-2" />}
          {title}
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: primaryGreen }}>
              <FaEnvelope className="inline-block mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border-2"
              style={{ borderColor: lightGrey }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: primaryGreen }}>
              <FaLock className="inline-block mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border-2"
              style={{ borderColor: lightGrey }}
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "hover:scale-105"
            }`}
            style={{ backgroundColor: goldTan }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? <FaSpinner className="animate-spin" /> : actionButtonText}
          </motion.button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-600 text-center mt-4">{success}</p>}

        <p className="text-center mt-6">
          {toggleText}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold underline"
            style={{ color: primaryGreen }}
          >
            {toggleLinkText}
          </button>
        </p>
      </div>
    </motion.div>
  );
}