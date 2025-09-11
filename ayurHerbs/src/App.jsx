import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Leaf,
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight,
  User,
  Factory,
  LogOut,
  Sparkles,
  Heart
} from "lucide-react";

// Lazy load pages
const HomePage = lazy(() => import("./pages/Home"));
const HerbForm = lazy(() => import("./pages/HerbForm"));
const HealthyLifestyle = lazy(() => import("./pages/HealthyLifestyle"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CustomerPage = lazy(() => import("./pages/CustomerPage"));
const Processor = lazy(() => import("./pages/Processor"));

// Import the enhanced Chatbot component
import Chatbot from "./components/Chatbot";

// Page constants
const PAGES = {
  home: "home",
  herbForm: "herb-form",
  healthyLifestyle: "healthy-lifestyle",
  auth: "auth",
  customer: "customer",
  processor: "processor",
};

// Role constants
const ROLES = {
  customer: "Customer",
  herbContributor: "Herb Form",
  processor: "Processor",
};

function App() {
  const [page, setPage] = useState(PAGES.auth);
  const [pageHistory, setPageHistory] = useState([PAGES.auth]);
  const [futurePages, setFuturePages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const colors = {
    primaryGreen: darkMode ? "#10b981" : "#059669",
    secondaryGreen: darkMode ? "#34d399" : "#047857",
    goldTan: darkMode ? "#f59e0b" : "#d97706",
    lightGrey: darkMode ? "#374151" : "#f3f4f6",
    darkText: darkMode ? "#f9fafb" : "#111827",
    background: darkMode ? "#0f172a" : "#ffffff",
    cardBackground: darkMode ? "#1e293b" : "#ffffff",
    accent: darkMode ? "#8b5cf6" : "#7c3aed",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  };

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setPage(PAGES.home);
    setPageHistory([PAGES.home]);
    setFuturePages([]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setPage(PAGES.auth);
    setPageHistory([PAGES.auth]);
    setFuturePages([]);
  };

  const navigateTo = (destination) => {
    if (destination !== page) {
      setPage(destination);
      setPageHistory((prevHistory) => [...prevHistory, destination]);
      setFuturePages([]);
    }
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const currentPage = pageHistory[pageHistory.length - 1];
      const prevPage = pageHistory[pageHistory.length - 2];
      setPage(prevPage);
      setPageHistory((prevHistory) => prevHistory.slice(0, -1));
      setFuturePages((prevFuture) => [currentPage, ...prevFuture]);
    }
  };

  const handleForward = () => {
    if (futurePages.length > 0) {
      const nextPage = futurePages[0];
      setPage(nextPage);
      setFuturePages((prevFuture) => prevFuture.slice(1));
      setPageHistory((prevHistory) => [...prevHistory, nextPage]);
    }
  };

  const renderPage = () => {
    switch (page) {
      case PAGES.home:
        return <HomePage colors={colors} navigateTo={navigateTo} PAGES={PAGES} userRole={userRole} ROLES={ROLES} />;
      case PAGES.herbForm:
        return <HerbForm colors={colors} navigateTo={navigateTo} PAGES={PAGES} />;
      case PAGES.healthyLifestyle:
        return <HealthyLifestyle colors={colors} />;
      case PAGES.customer:
        return <CustomerPage colors={colors} />;
      case PAGES.processor:
        return <Processor colors={colors} />;
      case PAGES.auth:
      default:
        return <AuthPage colors={colors} handleLogin={handleLogin} />;
    }
  };

  const NavLink = ({ icon: Icon, label, onClick, active }) => (
    <motion.button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
        active ? "text-white bg-white/20 shadow-sm" : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </motion.button>
  );

  const renderNavLinks = () => {
    if (isAuthenticated) {
      const links = [
        { label: "Home", icon: Home, page: PAGES.home },
      ];

      if (userRole === ROLES.customer) {
        links.push({
          label: "Lifestyle",
          icon: Heart,
          page: PAGES.healthyLifestyle,
        });
      }

      return (
        <div className="flex items-center space-x-2">
          {links.map((link) => (
            <NavLink
              key={link.label}
              label={link.label}
              icon={link.icon}
              onClick={() => navigateTo(link.page)}
              active={page === link.page}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-all duration-500 ${
        darkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navigation Bar */}
      <motion.nav
        className="backdrop-blur-sm border-b shadow-sm z-10 sticky top-0"
        style={{
          backgroundColor: `${colors.primaryGreen}f0`,
          borderColor: `${colors.primaryGreen}30`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <div className="relative">
                <Leaf className="text-white text-3xl" />
                <Sparkles className="absolute -top-1 -right-1 text-yellow-300 text-sm animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Ayur Trace</h1>
            </motion.div>

            {/* Navigation Links */}
            {renderNavLinks()}

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleBack}
                    disabled={pageHistory.length <= 1}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      pageHistory.length > 1 ? "hover:bg-white/20 text-white" : "opacity-40 cursor-not-allowed text-white/60"
                    }`}
                    whileHover={pageHistory.length > 1 ? { scale: 1.1 } : {}}
                    whileTap={pageHistory.length > 1 ? { scale: 0.9 } : {}}
                  >
                    <ArrowLeft size={20} />
                  </motion.button>
                  <motion.button
                    onClick={handleForward}
                    disabled={futurePages.length === 0}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      futurePages.length > 0 ? "hover:bg-white/20 text-white" : "opacity-40 cursor-not-allowed text-white/60"
                    }`}
                    whileHover={futurePages.length > 0 ? { scale: 1.1 } : {}}
                    whileTap={futurePages.length > 0 ? { scale: 0.9 } : {}}
                  >
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              )}

              {isAuthenticated && (
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </motion.button>
              )}

              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun className="text-yellow-300" size={20} />
                ) : (
                  <Moon className="text-white" size={20} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <Leaf className="text-6xl" style={{ color: colors.primaryGreen }} />
                  </motion.div>
                  <p className="text-xl font-medium" style={{ color: colors.darkText }}>
                    Loading your herbal journey...
                  </p>
                </div>
              }
            >
              {renderPage()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Chatbot */}
      {isAuthenticated && page !== PAGES.auth && (
        <Chatbot page={page} colors={colors} userRole={userRole} />
      )}
    </div>
  );
}

export default App;