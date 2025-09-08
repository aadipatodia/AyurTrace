import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaHome, FaSeedling, FaLeaf, FaSun, FaMoon } from "react-icons/fa";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const HerbForm = lazy(() => import("./pages/HerbForm"));
const HealthyLifestyle = lazy(() => import("./pages/HealthyLifestyle"));

const PAGES = {
  home: "home",
  herbForm: "herb-form",
  healthyLifestyle: "healthy-lifestyle",
};

function App() {
  const [page, setPage] = useState(PAGES.home);
  const [darkMode, setDarkMode] = useState(false);

  // Theme persistence
  useEffect(() => {
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

  const navigateTo = (newPage) => setPage(newPage);

  const colors = {
    primaryGreen: "#4a7c59",
    secondaryGreen: "#6c8c7c",
    darkCharcoal: "#1c2125",
    lightGrey: "#f0f4f7",
    goldTan: "#a87f4c",
    darkText: "#222",
    lightText: "#f0f0f0",
  };

  const renderPage = () => {
    switch (page) {
      case PAGES.herbForm:
        return <HerbForm colors={colors} />;
      case PAGES.healthyLifestyle:
        return <HealthyLifestyle colors={colors} />;
      case PAGES.home:
      default:
        return <Home colors={colors} navigateTo={navigateTo} PAGES={PAGES} />;
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500 flex flex-col"
      style={{
        backgroundColor: darkMode ? colors.darkCharcoal : colors.lightGrey,
        color: darkMode ? colors.lightText : colors.darkText,
      }}
    >
      <nav
        className="flex justify-between items-center p-4 shadow-lg sticky top-0 z-50"
        style={{ backgroundColor: colors.primaryGreen }}
      >
        <h1 className="text-2xl font-bold text-white tracking-wide">
          <span style={{ color: colors.goldTan }}>Herbal</span> Wellness
        </h1>
        <div className="flex space-x-6 items-center">
          <NavLink
            icon={<FaHome />}
            label="Home"
            onClick={() => navigateTo(PAGES.home)}
            active={page === PAGES.home}
            colors={colors}
          />
          <NavLink
            icon={<FaSeedling />}
            label="Herb Form"
            onClick={() => navigateTo(PAGES.herbForm)}
            active={page === PAGES.herbForm}
            colors={colors}
          />
          <NavLink
            icon={<FaLeaf />}
            label="Lifestyle"
            onClick={() => navigateTo(PAGES.healthyLifestyle)}
            active={page === PAGES.healthyLifestyle}
            colors={colors}
          />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all duration-200 bg-white/10 hover:bg-white/20 text-white"
          aria-label="Toggle Theme"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-500" />}
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
    className={`flex items-center space-x-2 p-2 rounded-md font-semibold transition-colors duration-200
      ${active ? 'text-white bg-white/20' : 'text-gray-200 hover:text-white'}
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
