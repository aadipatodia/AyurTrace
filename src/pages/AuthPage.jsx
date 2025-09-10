import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  LogIn, 
  Mail, 
  Lock, 
  Loader2, 
  ChevronDown,
  Leaf,
  Sparkles,
  Shield
} from "lucide-react";

export default function AuthPage({ colors, handleLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedSection, setSelectedSection] = useState("Customer");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sections = ["Customer", "Herb Form", "Processor"];

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (isLogin) {
        setSuccess(`Welcome back! Redirecting to your ${selectedSection} dashboard...`);
        setTimeout(() => handleLogin(selectedSection), 1000);
      } else {
        setSuccess("Account created successfully! Please log in.");
        setIsLogin(true);
      }
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ backgroundColor: colors.primaryGreen }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ backgroundColor: colors.goldTan }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0] 
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Main Auth Card */}
        <motion.div
          className="relative overflow-hidden rounded-3xl shadow-2xl p-8 backdrop-blur-sm border"
          style={{ 
            backgroundColor: colors.cardBackground,
            borderColor: `${colors.primaryGreen}30`
          }}
          whileHover={{ 
            boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
            scale: 1.02 
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <Leaf 
              className="w-full h-full"
              style={{ color: colors.primaryGreen }}
            />
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
            <Sparkles 
              className="w-full h-full"
              style={{ color: colors.goldTan }}
            />
          </div>

          {/* Header */}
          <motion.div
            className="text-center mb-8 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-block p-4 rounded-full mb-4"
              style={{ backgroundColor: `${colors.primaryGreen}20` }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Shield 
                className="text-4xl"
                style={{ color: colors.primaryGreen }}
              />
            </motion.div>
            
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ color: colors.primaryGreen }}
            >
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p 
              className="text-sm opacity-80"
              style={{ color: colors.darkText }}
            >
              {isLogin 
                ? "Continue your herbal wellness journey" 
                : "Start your natural health adventure"}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Role Selection */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label 
                className="flex items-center font-medium mb-2 text-sm"
                style={{ color: colors.primaryGreen }}
              >
                <UserPlus className="mr-2" size={16} />
                Select your role
              </label>
              <motion.div
                className="relative w-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-opacity-80"
                style={{ 
                  backgroundColor: colors.lightGrey,
                  borderColor: colors.primaryGreen + '40'
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <span style={{ color: colors.darkText }}>{selectedSection}</span>
                  <ChevronDown 
                    className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    style={{ color: colors.primaryGreen }}
                    size={20}
                  />
                </div>
              </motion.div>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="absolute z-20 w-full mt-2 rounded-xl shadow-2xl border overflow-hidden"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.primaryGreen + '30'
                    }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {sections.map((section, index) => (
                      <motion.div
                        key={section}
                        className="p-4 cursor-pointer transition-all duration-200 hover:bg-opacity-80"
                        style={{ 
                          backgroundColor: selectedSection === section ? colors.primaryGreen + '20' : 'transparent',
                          color: colors.darkText
                        }}
                        onClick={() => {
                          setSelectedSection(section);
                          setDropdownOpen(false);
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: colors.primaryGreen + '30'
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {section}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label 
                className="flex items-center font-medium mb-2 text-sm"
                style={{ color: colors.primaryGreen }}
              >
                <Mail className="mr-2" size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-30"
                style={{ 
                  backgroundColor: colors.lightGrey,
                  borderColor: colors.primaryGreen + '40',
                  color: colors.darkText
                }}
                placeholder="Enter your email"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label 
                className="flex items-center font-medium mb-2 text-sm"
                style={{ color: colors.primaryGreen }}
              >
                <Lock className="mr-2" size={16} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-30"
                style={{ 
                  backgroundColor: colors.lightGrey,
                  borderColor: colors.primaryGreen + '40',
                  color: colors.darkText
                }}
                placeholder="Enter your password"
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 ${loading ? "cursor-not-allowed opacity-70" : "hover:shadow-lg"}`}
              style={{ backgroundColor: colors.goldTan }}
              whileHover={!loading ? { 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
              } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                </div>
              )}
            </motion.button>
          </form>

          {/* Status Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-4 p-4 rounded-xl text-center font-medium"
                style={{ 
                  backgroundColor: colors.error + '20',
                  color: colors.error
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                className="mt-4 p-4 rounded-xl text-center font-medium"
                style={{ 
                  backgroundColor: colors.success + '20',
                  color: colors.success
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Login/Signup */}
          <motion.div 
            className="text-center mt-6 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p style={{ color: colors.darkText }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
                className="font-bold underline hover:no-underline transition-all duration-200"
                style={{ color: colors.primaryGreen }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
