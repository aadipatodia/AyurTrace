import { motion } from "framer-motion";
import { 
  Heart,
  Activity,
  Droplets,
  Moon,
  Apple,
  Dumbbell,
  Brain,
  Sun,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Leaf
} from "lucide-react";

export default function HealthyLifestyle({ colors }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const tips = [
    {
      title: "Balanced Nutrition",
      shortDesc: "Fuel your body right",
      description: "Embrace a diverse palette of fruits, vegetables, whole grains, and lean proteins. Focus on colorful, nutrient-dense whole foods that provide sustained energy and support optimal cellular function.",
      icon: Apple,
      color: colors.primaryGreen,
      gradient: "from-green-500 to-emerald-600",
      benefits: ["Increased Energy", "Better Immunity", "Healthy Weight"],
      time: "Daily commitment"
    },
    {
      title: "Active Movement",
      shortDesc: "Keep your body in motion",
      description: "Incorporate at least 30 minutes of purposeful movement daily. Whether it's brisk walking, strength training, or dancing, find activities that bring you joy while strengthening your cardiovascular system.",
      icon: Dumbbell,
      color: colors.accent,
      gradient: "from-purple-500 to-indigo-600",
      benefits: ["Stronger Heart", "Better Mood", "Enhanced Strength"],
      time: "30+ minutes daily"
    },
    {
      title: "Optimal Hydration",
      shortDesc: "Your body's essential fuel",
      description: "Maintain proper hydration throughout the day with clean, filtered water. Adequate hydration supports every bodily function, from digestion and circulation to temperature regulation and toxin elimination.",
      icon: Droplets,
      color: colors.secondaryGreen,
      gradient: "from-cyan-500 to-blue-600",
      benefits: ["Glowing Skin", "Better Digestion", "Mental Clarity"],
      time: "Throughout the day"
    },
    {
      title: "Restorative Sleep",
      shortDesc: "Recharge and rebuild",
      description: "Prioritize 7-9 hours of quality sleep each night. Create a calming bedtime routine, optimize your sleep environment, and allow your body the time it needs for cellular repair and memory consolidation.",
      icon: Moon,
      color: colors.goldTan,
      gradient: "from-indigo-500 to-purple-600",
      benefits: ["Better Recovery", "Enhanced Memory", "Mood Balance"],
      time: "7-9 hours nightly"
    },
    {
      title: "Mindful Wellness",
      shortDesc: "Nurture your mental health",
      description: "Integrate mindfulness practices such as meditation, deep breathing, or yoga into your routine. These practices reduce stress, improve focus, and create a deeper connection with your inner wisdom.",
      icon: Brain,
      color: colors.accent,
      gradient: "from-pink-500 to-rose-600",
      benefits: ["Reduced Stress", "Better Focus", "Emotional Balance"],
      time: "10-20 minutes daily"
    },
    {
      title: "Natural Sunlight",
      shortDesc: "Vitamin D and vitality",
      description: "Spend time outdoors in natural sunlight daily. Sunlight exposure helps regulate circadian rhythms, supports vitamin D production, and naturally boosts mood and energy levels.",
      icon: Sun,
      color: colors.goldTan,
      gradient: "from-yellow-500 to-orange-600",
      benefits: ["Vitamin D", "Better Sleep", "Mood Enhancement"],
      time: "15-30 minutes daily"
    }
  ];

  const wellnessStats = [
    { label: "Daily Energy Boost", value: "85%", icon: Activity },
    { label: "Better Sleep Quality", value: "92%", icon: Moon },
    { label: "Improved Mood", value: "78%", icon: Heart },
    { label: "Enhanced Focus", value: "89%", icon: Target }
  ];

  return (
    <motion.div 
      className="min-h-screen relative"
      style={{ backgroundColor: colors.background }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{ background: `linear-gradient(135deg, ${colors.primaryGreen}, ${colors.secondaryGreen})` }}
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
            className="absolute bottom-10 left-10 w-64 h-64 rounded-full blur-3xl opacity-8"
            style={{ background: `linear-gradient(135deg, ${colors.goldTan}, ${colors.accent})` }}
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

          {/* Floating wellness icons */}
          {[Heart, Leaf, Star, Activity].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${20 + (i * 20)}%`,
                top: `${15 + (i * 15)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              <Icon size={40 + i * 10} style={{ color: colors.primaryGreen }} />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Enhanced Title */}
            <motion.div 
              className="flex items-center justify-center mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Heart 
                    className="text-8xl mr-4"
                    style={{ color: colors.primaryGreen }}
                  />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Star 
                    className="text-3xl"
                    style={{ color: colors.goldTan }}
                  />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Nourish
              </span>{" "}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Your Life
              </span>
            </h1>

            <motion.p 
              className="text-2xl md:text-3xl mb-12 leading-relaxed font-medium max-w-5xl mx-auto"
              style={{ color: colors.darkText }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Cultivating a vibrant, healthy lifestyle is a transformative journey. 
              Discover evidence-based practices that will{" "}
              <span className="font-bold" style={{ color: colors.primaryGreen }}>
                energize your body
              </span>, {" "}
              <span className="font-bold" style={{ color: colors.accent }}>
                sharpen your mind
              </span>, and{" "}
              <span className="font-bold" style={{ color: colors.goldTan }}>
                elevate your spirit
              </span>.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <motion.section className="py-16 relative" variants={itemVariants}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            style={{ color: colors.darkText }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Proven Wellness Benefits
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {wellnessStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 mx-auto"
                  style={{ backgroundColor: `${colors.primaryGreen}20` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon
                    className="text-2xl group-hover:scale-110 transition-transform duration-300"
                    style={{ color: colors.primaryGreen }}
                  />
                </motion.div>
                <p className="text-4xl font-black mb-2" style={{ color: colors.darkText }}>
                  {stat.value}
                </p>
                <p className="text-sm font-semibold opacity-80" style={{ color: colors.darkText }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Tips Section */}
      <motion.section className="py-20" variants={containerVariants}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6" style={{ color: colors.darkText }}>
              Your Wellness Roadmap
            </h2>
            <p className="text-xl opacity-80 max-w-3xl mx-auto" style={{ color: colors.darkText }}>
              Six foundational pillars for transforming your health and vitality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                className="group relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-500 cursor-pointer border"
                style={{ backgroundColor: colors.cardBackground }}
                variants={itemVariants}
                custom={index}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  rotateY: 2
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {/* Animated gradient background */}
                <motion.div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-br ${tip.gradient}`}
                />

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-50"
                      style={{ 
                        backgroundColor: tip.color,
                        left: `${25 + i * 20}%`,
                        top: `${30 + i * 15}%`,
                      }}
                      animate={{
                        y: [0, -25, 0],
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>

                <div className="p-8 relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className="flex items-center justify-center w-16 h-16 rounded-2xl"
                      style={{ backgroundColor: `${tip.color}20` }}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <tip.icon 
                        className="text-3xl group-hover:animate-pulse"
                        style={{ color: tip.color }}
                      />
                    </motion.div>
                    <div 
                      className="flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        backgroundColor: `${tip.color}15`,
                        color: tip.color
                      }}
                    >
                      <Clock size={14} />
                      <span>{tip.time}</span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 
                    className="text-3xl font-black mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
                    style={{ 
                      color: colors.darkText,
                      backgroundImage: `linear-gradient(135deg, ${tip.color}, ${colors.primaryGreen})`
                    }}
                  >
                    {tip.title}
                  </h3>
                  
                  <p className="text-sm font-semibold mb-4 opacity-80" style={{ color: tip.color }}>
                    {tip.shortDesc}
                  </p>

                  <p 
                    className="leading-relaxed text-base mb-6"
                    style={{ color: colors.darkText }}
                  >
                    {tip.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-6">
                    <h4 className="text-sm font-bold opacity-80" style={{ color: colors.darkText }}>
                      Key Benefits:
                    </h4>
                    {tip.benefits.map((benefit, benefitIndex) => (
                      <motion.div
                        key={benefit}
                        className="flex items-center space-x-2 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + benefitIndex * 0.1 }}
                      >
                        <CheckCircle size={16} style={{ color: tip.color }} />
                        <span style={{ color: colors.darkText }}>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <motion.div
                    className="flex items-center justify-between"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span 
                      className="text-sm font-bold"
                      style={{ color: tip.color }}
                    >
                      Start Today
                    </span>
                    <ArrowRight 
                      size={20} 
                      style={{ color: tip.color }}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section 
        className="py-20 relative"
        style={{ backgroundColor: `${colors.primaryGreen}05` }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-4xl font-black mb-6" style={{ color: colors.darkText }}>
              Ready to Transform Your Wellness?
            </h3>
            <p className="text-xl mb-8 opacity-80" style={{ color: colors.darkText }}>
              Join thousands who have already started their journey to optimal health and vitality.
            </p>
            <motion.button
              className="group flex items-center space-x-4 px-10 py-5 rounded-2xl font-bold text-xl text-white shadow-2xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)",
                y: -3
              }} 
              whileTap={{ scale: 0.98 }}
            >
              <Heart className="group-hover:animate-pulse" size={28} />
              <span>Begin Your Journey</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}