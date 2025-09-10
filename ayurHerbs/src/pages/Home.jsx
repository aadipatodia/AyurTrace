import { motion } from "framer-motion";

export default function Home({ colors = {}, navigateTo, PAGES }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const darkText = colors.darkText || "#222";
  const goldTan = colors.goldTan || "#a87f4c";

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-4" style={{ color: primaryGreen }}>
          Welcome to <span style={{ color: goldTan }}>Herbal Wellness</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg mb-8" style={{ color: darkText }}>
          Your digital companion for exploring the world of herbs and cultivating a healthier life. Contribute to our botanical database and discover tips for a natural lifestyle.
        </p>
      </motion.div>

      <motion.div
        className="w-full relative rounded-2xl overflow-hidden shadow-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ backgroundColor: colors.lightGrey }}
      >
        <h2 className="text-4xl font-bold mb-6" style={{ color: primaryGreen }}>
          Explore and Contribute
        </h2>
        <div className="flex space-x-6 justify-center">
          <motion.button
            onClick={() => navigateTo(PAGES.herbForm)}
            className="px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: primaryGreen }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add a Herb Entry 🌿
          </motion.button>
          <motion.button
            onClick={() => navigateTo(PAGES.healthyLifestyle)}
            className="px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: goldTan }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Lifestyle Tips 🌱
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}