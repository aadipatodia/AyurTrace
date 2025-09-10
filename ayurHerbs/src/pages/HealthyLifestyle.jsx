import { motion } from "framer-motion";

export default function HealthyLifestyle({ colors }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const lightGrey = colors.lightGrey || "#f0f4f7";
  const goldTan = colors.goldTan || "#a87f4c";
  const darkText = colors.darkText || "#222";

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      },
    }),
  };

  const tips = [
    {
      title: "Balanced Diet",
      description: "Eat a variety of fruits, vegetables, whole grains, and lean proteins to get all the nutrients your body needs. Focus on fresh, whole foods to fuel your body and mind.",
    },
    {
      title: "Regular Exercise",
      description: "Aim for at least 30 minutes of moderate-intensity exercise most days of the week. This improves cardiovascular health, boosts mood, and enhances overall energy levels.",
    },
    {
      title: "Hydration",
      description: "Drinking plenty of water throughout the day is crucial. Staying hydrated supports all bodily functions, helps with digestion, and keeps your skin healthy and glowing.",
    },
    {
      title: "Mindfulness & Sleep",
      description: "Incorporate mindfulness practices like meditation or deep breathing. Ensure you get 7-9 hours of quality sleep each night to allow your body to repair and rejuvenate.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[70vh]">
      <h1 className="text-5xl font-extrabold mb-8 text-center" style={{ color: primaryGreen }}>
        Nourish Your Body
      </h1>
      <p className="max-w-2xl text-center text-lg mb-12" style={{ color: darkText }}>
        Cultivating a healthy lifestyle is a journey. Here are some fundamental tips to help you thrive.
      </p>
      <motion.ul
        className="w-full max-w-4xl space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {tips.map((tip, index) => (
          <motion.li
            key={tip.title}
            className="p-8 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
            style={{ backgroundColor: lightGrey }}
            variants={itemVariants}
            custom={index}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ color: goldTan }}>
              {tip.title}
            </h3>
            <p className="text-gray-700">{tip.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}