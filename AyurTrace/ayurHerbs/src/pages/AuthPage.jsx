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
  Shield,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react";

export default function AuthPage({ colors, handleLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedSection, setSelectedSection] = useState("Customer");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sections = ["Customer", "Producer", "Processor"];

  // Helper functions for user management
  const getUsers = () => {
    const users = localStorage.getItem("ayurTrace_users");
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (userData) => {
    const users = getUsers();
    users.push(userData);
    localStorage.setItem("ayurTrace_users", JSON.stringify(users));
  };

  const findUser = (email, password) => {
    const users = getUsers();
    return users.find(user => user.email === email && user.password === password);
  };

  const userExists = (email) => {
    const users = getUsers();
    return users.some(user => user.email === email);
  };

  // Password validation
  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isLogin) {
        // Login logic
        const user = findUser(email, password);
        
        if (user) {
          setSuccess(`Welcome back! Redirecting to your ${user.role} dashboard...`);
          setTimeout(() => handleLogin(user), 1000);
        } else {
          setError("Invalid email or password. Please check your credentials or sign up for a new account.");
        }
      } else {
        // Signup logic
        if (!passwordValidation.isValid) {
          setError("Password must be at least 6 characters with uppercase, lowercase, and numbers.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords don't match.");
          setLoading(false);
          return;
        }

        if (userExists(email)) {
          setError("An account with this email already exists. Please log in instead.");
          setLoading(false);
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          email,
          password,
          role: selectedSection,
          createdAt: new Date().toISOString()
        };

        saveUser(newUser);
        setSuccess("Account created successfully! You can now log in.");
        
        // Auto-switch to login mode
        setTimeout(() => {
          setIsLogin(true);
          setPassword("");
          setConfirmPassword("");
          setSuccess("");
        }, 2000);
      }
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordStrengthIndicator = () => {
    if (!password || isLogin) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-2 p-3 rounded-lg"
        style={{ backgroundColor: colors.lightGrey }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: colors.darkText }}>
          Password Requirements:
        </p>
        <div className="space-y-1">
          {[
            { key: 'minLength', label: 'At least 6 characters' },
            { key: 'hasUpperCase', label: 'One uppercase letter' },
            { key: 'hasLowerCase', label: 'One lowercase letter' },
            { key: 'hasNumbers', label: 'One number' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2 text-xs">
              {passwordValidation[key] ? (
                <Check size={12} className="text-green-500" />
              ) : (
                <X size={12} className="text-gray-400" />
              )}
              <span
                className={passwordValidation[key] ? "text-green-600" : "text-gray-500"}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{ backgroundColor: colors.background }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
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
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5"
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
        {/* Additional floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-3"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <Leaf size={20 + i * 5} style={{ color: colors.accent }} />
          </motion.div>
        ))}
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
          style={{ backgroundColor: colors.cardBackground, borderColor: `${colors.primaryGreen}40` }}
          whileHover={{ boxShadow: "0 35px 70px rgba(0,0,0,0.2)", scale: 1.01 }}
        >
          {/* Enhanced Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-full h-full" style={{ color: colors.primaryGreen }} />
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-full h-full" style={{ color: colors.goldTan }} />
            </motion.div>
          </div>
          {/* Header */}
          <motion.div
            className="text-center mb-8 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-block p-4 rounded-full mb-4 shadow-lg"
              style={{ backgroundColor: `${colors.primaryGreen}20` }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="text-4xl" style={{ color: colors.primaryGreen }} />
            </motion.div>
            <h1
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
            >
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p className="text-sm opacity-80 font-medium" style={{ color: colors.darkText }}>
              {isLogin ? "Continue your herbal wellness journey" : "Start your natural health adventure"}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Role Selection - Now visible for both login and signup */}
            <motion.div className="relative" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }} >
              <label className="flex items-center font-medium mb-3 text-sm" style={{ color: colors.primaryGreen }} >
                <UserPlus className="mr-2" size={16} /> Select your role
              </label>
              <motion.div
                className="relative w-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between"
                style={{
                  backgroundColor: colors.lightGrey,
                  borderColor: dropdownOpen ? colors.primaryGreen : `${colors.primaryGreen}40`,
                  color: colors.darkText,
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-2 font-medium">
                  {selectedSection}
                </div>
                <ChevronDown
                  size={16}
                  className="transition-transform duration-300"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </motion.div>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full mt-2 rounded-xl shadow-xl z-50 overflow-hidden"
                    style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.borderColor}` }}
                  >
                    {sections.map((section) => (
                      <motion.li
                        key={section}
                        className="px-4 py-3 cursor-pointer font-medium transition-all duration-200"
                        style={{ color: colors.darkText }}
                        onClick={() => {
                          setSelectedSection(section);
                          setDropdownOpen(false);
                        }}
                        whileHover={{ backgroundColor: colors.hoverBg }}
                      >
                        {section}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkText }}>Email Address</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60"
                  size={18}
                  style={{ color: colors.primaryGreen }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-12 py-4 rounded-xl border-2 bg-transparent focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{
                    borderColor: `${colors.primaryGreen}40`,
                    color: colors.darkText,
                    '--tw-ring-color': colors.primaryGreen,
                  }}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkText }}>Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60"
                  size={18}
                  style={{ color: colors.primaryGreen }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-12 py-4 rounded-xl border-2 bg-transparent focus:outline-none focus:ring-2 transition-all duration-300 pr-12"
                  style={{
                    borderColor: `${colors.primaryGreen}40`,
                    color: colors.darkText,
                    '--tw-ring-color': colors.primaryGreen,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <PasswordStrengthIndicator />
            </motion.div>

            {/* Confirm Password Input - Only for signup */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.darkText }}>Confirm Password</label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60"
                      size={18}
                      style={{ color: colors.primaryGreen }}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-12 py-4 rounded-xl border-2 bg-transparent focus:outline-none focus:ring-2 transition-all duration-300 pr-12"
                      style={{
                        borderColor: `${colors.primaryGreen}40`,
                        color: colors.darkText,
                        '--tw-ring-color': colors.primaryGreen,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
              style={{ backgroundColor: colors.primaryGreen }}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              disabled={loading}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processing...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-4 p-4 rounded-xl font-medium text-center relative z-10"
                style={{
                  backgroundColor: colors.error + '15',
                  color: colors.error,
                  border: `1px solid ${colors.error}40`
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
                className="mt-4 p-4 rounded-xl font-medium text-center relative z-10"
                style={{
                  backgroundColor: colors.success + '15',
                  color: colors.success,
                  border: `1px solid ${colors.success}40`
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
            transition={{ delay: 0.8 }}
          >
            <p style={{ color: colors.darkText }} className="font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setPassword("");
                  setConfirmPassword("");
                  setDropdownOpen(false);
                }}
                className="font-bold underline hover:no-underline transition-all duration-200 hover:scale-105"
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