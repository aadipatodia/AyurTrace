// src/App.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaHome,
  FaSeedling,
  FaLeaf,
  FaSun,
  FaMoon,
  FaUser,
  FaQrcode,
  FaIndustry, // Icon for Processor
} from "react-icons/fa";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const HerbForm = lazy(() => import("./pages/HerbForm"));
const HealthyLifestyle = lazy(() => import("./pages/HealthyLifestyle"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CustomerPage = lazy(() => import("./pages/CustomerPage"));
const Processor = lazy(() => import("./pages/Processor"));

// We'll use these string constants for clarity
const PAGES = {
  home: "home",
  herbForm: "herb-form",
  healthyLifestyle: "healthy-lifestyle",
  auth: "auth",
  customer: "customer",
  processor: "processor",
};

// Define roles to match the dropdown in AuthPage
const ROLES = {
  customer: "Customer",
  herbContributor: "Herb Form", // Renamed for clarity
  processor: "Processor",
};

function App() {
  // Set the initial page to 'auth' to show the login page first
  const [page, setPage] = useState(PAGES.auth);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Will be 'Customer', 'Herb Form', or 'Processor'

  useEffect(() => {
    // Check for theme preference on component mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // This function will be passed to AuthPage to update the authentication state
  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // After login, navigate the user to their designated page
    switch (role) {
      case ROLES.customer:
        setPage(PAGES.customer);
        break;
      case ROLES.herbContributor:
        setPage(PAGES.herbForm);
        break;
      case ROLES.processor:
        setPage(PAGES.processor);
        break;
      default:
        setPage(PAGES.home);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setPage(PAGES.home);
  };

  const colors = {
    primaryGreen: darkMode ? "#8BC34A" : "#4a7c59",
    darkText: darkMode ? "#f0f4f7" : "#222",
    lightGrey: darkMode ? "#2c2c2c" : "#f0f4f7",
    goldTan: darkMode ? "#FFEB3B" : "#a87f4c",
  };

  // This function dynamically renders the correct page based on state
  const renderPage = () => {
    if (page === PAGES.auth) {
      // Pass the handleLogin function to the AuthPage
      return <AuthPage colors={colors} handleLogin={handleLogin} />;
    }

    // For authenticated users, show the page based on their role
    if (isAuthenticated) {
      switch (userRole) {
        case ROLES.customer:
          return <CustomerPage colors={colors} navigateTo={setPage} PAGES={PAGES} />;
        case ROLES.herbContributor:
          return <HerbForm colors={colors} navigateTo={setPage} PAGES={PAGES} />;
        case ROLES.processor:
          return <Processor colors={colors} navigateTo={setPage} PAGES={PAGES} />;
        default:
          // Fallback for unexpected roles
          return <Home colors={colors} navigateTo={setPage} PAGES={PAGES} />;
      }
    }

    // Default case for unauthenticated users, or Home and Healthy Lifestyle pages
    switch (page) {
      case PAGES.healthyLifestyle:
        return <HealthyLifestyle colors={colors} />;
      case PAGES.home:
      default:
        return <Home colors={colors} navigateTo={setPage} PAGES={PAGES} />;
    }
  };

  // Helper function to get the correct icon and label for the authenticated user's page
  const getUserPageLink = () => {
    switch (userRole) {
      case ROLES.customer:
        return (
          <NavLink
            icon={<FaQrcode />}
            label="Customer"
            onClick={() => setPage(PAGES.customer)}
            active={page === PAGES.customer}
            colors={colors}
          />
        );
      case ROLES.herbContributor:
        return (
          <NavLink
            icon={<FaSeedling />}
            label="Herb Form"
            onClick={() => setPage(PAGES.herbForm)}
            active={page === PAGES.herbForm}
            colors={colors}
          />
        );
      case ROLES.processor:
        return (
          <NavLink
            icon={<FaIndustry />}
            label="Processor"
            onClick={() => setPage(PAGES.processor)}
            active={page === PAGES.processor}
            colors={colors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ backgroundColor: darkMode ? "#1a1a1a" : "#f0f4f7" }}
    >
      <nav
        className="flex items-center justify-between p-4 shadow-md transition-all duration-500"
        style={{
          backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
          color: colors.darkText,
        }}
      >
        <div className="flex space-x-4 items-center">
          {/* Always show Home and Lifestyle */}
          <NavLink
            icon={<FaHome />}
            label="Home"
            onClick={() => setPage(PAGES.home)}
            active={page === PAGES.home}
            colors={colors}
          />
          <NavLink
            icon={<FaLeaf />}
            label="Lifestyle"
            onClick={() => setPage(PAGES.healthyLifestyle)}
            active={page === PAGES.healthyLifestyle}
            colors={colors}
          />

          {isAuthenticated ? (
            <>
              {/* Show the user's specific page link */}
              {getUserPageLink()}
              <NavLink
                icon={<FaUser />}
                label="Logout"
                onClick={handleLogout}
                active={false}
                colors={colors}
              />
            </>
          ) : (
            <NavLink
              icon={<FaUser />}
              label="Login"
              onClick={() => setPage(PAGES.auth)}
              active={page === PAGES.auth}
              colors={colors}
            />
          )}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all duration-200 bg-white/10 hover:bg-white/20 text-white"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-blue-500" />
          )}
        </button>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense
              fallback={
                <div className="text-center p-8 text-xl font-medium">
                  🌿 Loading...
                </div>
              }
            >
              {renderPage()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

const NavLink = ({ icon, label, onClick, active, colors }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 p-2 rounded-md font-semibold transition-colors duration-200 ${
      active ? "text-white bg-white/20" : "text-gray-600 hover:text-white"
    }`}
    style={{
      color: active ? "white" : colors.darkText,
      backgroundColor: active ? colors.primaryGreen : "transparent",
      "&:hover": {
        backgroundColor: active
          ? colors.primaryGreen
          : "rgba(0, 0, 0, 0.05)",
      },
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;