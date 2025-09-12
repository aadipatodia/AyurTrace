import { motion } from "framer-motion";
import { 
  User,  
  Factory, 
  Leaf, 
  TrendingUp, 
  Users, 
  Database,
  Award,
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Zap,
  Globe,
  Star,
  ChevronDown,
  Activity,
  Target,
  Layers,
  Lightbulb
} from "lucide-react";

export default function Home({ colors, navigateTo, PAGES, userRole, ROLES, currentUser, isDarkMode }) {
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

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 30,
        duration: 0.8
      }
    }
  };

  const stats = [
    { 
      label: "Herbs Catalogued", 
      value: "2,450+", 
      icon: Database, 
      color: colors.primaryGreen,
      description: "Comprehensive herbal database",
      gradient: "from-emerald-500 to-green-600"
    },
    { 
      label: "Health Tips", 
      value: "890+", 
      icon: Lightbulb, 
      color: colors.accent,
      description: "Expert wellness guidance",
      gradient: "from-purple-500 to-indigo-600"
    },
    { 
      label: "Quality Approved", 
      value: "98.5%", 
      icon: Award, 
      color: colors.goldTan,
      description: "Certified excellence rate",
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  const getRoleInfo = () => {
    switch (userRole) {
      case ROLES.customer:
        return {
          title: "Consumer Dashboard",
          subtitle: "Your Wellness Hub",
          description: "Track herb origins, verify quality, access personalized recommendations, and discover wellness insights tailored just for you",
          icon: User,
          action: () => navigateTo(PAGES.customer),
          color: colors.accent,
          gradient: "from-purple-500 to-indigo-600",
          features: ["Quality Tracking", "Personal Insights", "Wellness Tips"]
        };
      case ROLES.herbContributor:
        return {
          title: "Producer Hub",
          subtitle: "Growth & Innovation",
          description: "Add new herbs, manage your inventory, contribute to our growing database, and connect with processors worldwide",
          icon: Leaf,
          action: () => navigateTo(PAGES.herbForm),
          color: colors.secondaryGreen,
          gradient: "from-green-500 to-emerald-600",
          features: ["Herb Management", "Inventory Control", "Market Access"]
        };
      case ROLES.processor:
        return {
          title: "Processor Central",
          subtitle: "Quality & Distribution",
          description: "Process batches efficiently, manage complex supply chains, ensure quality standards, and optimize distribution networks",
          icon: Factory,
          action: () => navigateTo(PAGES.processor),
          color: colors.goldTan,
          gradient: "from-amber-500 to-orange-600",
          features: ["Batch Processing", "Quality Control", "Supply Chain"]
        };
      default:
        return null;
    }
  };

  const roleInfo = getRoleInfo();

  const features = [
    {
      title: "Blockchain Security",
      description: "Leverage advanced blockchain technology to ensure complete authenticity and immutable quality records for every herb from farm to consumer.",
      icon: Shield,
      color: colors.accent,
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      title: "Global Traceability",
      description: "Trace every step of the herbal supply chain with precision, providing complete transparency and building unshakeable trust.",
      icon: Globe,
      color: colors.secondaryGreen,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "AI-Powered Analytics",
      description: "Get intelligent recommendations, quality predictions, and market insights using cutting-edge machine learning algorithms.",
      icon: Zap,
      color: colors.goldTan,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Expert Community",
      description: "Join a vibrant ecosystem of growers, processors, researchers, and health enthusiasts sharing knowledge and best practices.",
      icon: Users,
      color: colors.primaryGreen,
      gradient: "from-green-600 to-teal-600",
    },
    {
      title: "Real-time Insights",
      description: "Access comprehensive analytics about herb quality, supply chain efficiency, market trends, and consumer preferences.",
      icon: TrendingUp,
      color: colors.accent,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Quality Assurance",
      description: "Multi-layered quality control systems ensuring every product meets the highest standards of purity and potency.",
      icon: Target,
      color: colors.secondaryGreen,
      gradient: "from-emerald-500 to-teal-600",
    }
  ];

  return (
    <motion.div 
      className="min-h-screen relative"
      style={{ backgroundColor: colors.background }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Hero Section with Parallax Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Sophisticated Background Elements */}
        <div className="absolute inset-0">
          {/* Primary gradient orbs */}
          <motion.div 
            className="absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: `linear-gradient(135deg, ${colors.primaryGreen}, ${colors.secondaryGreen})` }}
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360],
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl opacity-8"
            style={{ background: `linear-gradient(135deg, ${colors.goldTan}, ${colors.accent})` }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 0],
              x: [0, -80, 0],
              y: [0, 60, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-5"
            style={{ background: `linear-gradient(45deg, ${colors.accent}, ${colors.primaryGreen})` }}
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.05, 0.15, 0.05],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating decorative elements */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-5"
              style={{
                left: `${10 + (i * 8)}%`,
                top: `${15 + (i * 6)}%`,
              }}
              animate={{
                y: [0, -40, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              {i % 4 === 0 ? (
                <Leaf size={30 + i * 2} style={{ color: colors.primaryGreen }} />
              ) : i % 4 === 1 ? (
                <Star size={25 + i * 2} style={{ color: colors.goldTan }} />
              ) : i % 4 === 2 ? (
                <Sparkles size={28 + i * 2} style={{ color: colors.accent }} />
              ) : (
                <Heart size={26 + i * 2} style={{ color: colors.secondaryGreen }} />
              )}
            </motion.div>
          ))}

          {/* Mesh gradient overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, ${colors.primaryGreen}20 2px, transparent 0),
                radial-gradient(circle at 75% 75%, ${colors.goldTan}20 1px, transparent 0),
                radial-gradient(circle at 25% 75%, ${colors.accent}20 1.5px, transparent 0),
                radial-gradient(circle at 75% 25%, ${colors.secondaryGreen}20 1px, transparent 0)
              `,
              backgroundSize: '100px 100px, 80px 80px, 120px 120px, 90px 90px'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 z-10">
          <motion.div 
            className="text-center max-w-6xl mx-auto"
            variants={heroVariants}
          >
            {/* Enhanced Welcome Message */}
            {currentUser && (
              <motion.div
                className="mb-8 inline-block"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <div 
                  className="px-8 py-4 rounded-full shadow-xl backdrop-blur-xl border"
                  style={{ 
                    backgroundColor: `${colors.primaryGreen}10`,
                    borderColor: `${colors.primaryGreen}20`,
                    boxShadow: `0 8px 32px ${colors.primaryGreen}20`
                  }}
                >
                  <p className="text-base font-bold flex items-center" 
                     style={{ color: colors.primaryGreen }}>
                    <Sparkles className="mr-3" size={20} />
                    Welcome back, {currentUser.email.split('@')[0]}! 
                    <motion.span
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                      className="ml-2"
                    >
                      👋
                    </motion.span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Enhanced Brand Logo Animation */}
            <motion.div 
              className="flex items-center justify-center mb-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="relative">
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <Leaf 
                    className="text-9xl"
                    style={{ color: colors.primaryGreen }}
                  />
                  {/* Orbiting sparkles */}
                  {[0, 120, 240].map((rotation, index) => (
                    <motion.div
                      key={index}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        transformOrigin: '0 0',
                      }}
                      animate={{ 
                        rotate: rotation + 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Sparkles 
                        className="text-3xl -translate-x-16 -translate-y-1/2"
                        style={{ color: colors.goldTan }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Main Title */}
            <motion.h1 
              className="text-7xl md:text-9xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block">
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Ayur
                </span>
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent ml-4">
                  Trace
                </span>
              </span>
              <motion.span 
                className="block text-3xl md:text-4xl font-medium mt-4 opacity-80"
                style={{ color: colors.darkText }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.6 }}
              >
                The Future of Herbal Wellness
              </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl mb-12 leading-relaxed font-medium max-w-4xl mx-auto"
              style={{ color: colors.darkText }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Revolutionizing herbal discovery and supply chain transparency through 
              <span className="font-bold" style={{ color: colors.primaryGreen }}> blockchain technology</span>, 
              <span className="font-bold" style={{ color: colors.accent }}> AI-powered insights</span>, and 
              <span className="font-bold" style={{ color: colors.goldTan }}> community wisdom</span>.
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {roleInfo && (
                <motion.button 
                  onClick={roleInfo.action} 
                  className={`group relative flex items-center space-x-4 px-10 py-5 rounded-2xl font-bold text-xl text-white shadow-2xl transition-all duration-300 bg-gradient-to-r ${roleInfo.gradient} overflow-hidden`}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: `0 25px 50px ${roleInfo.color}40`,
                    y: -3
                  }} 
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button background animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <roleInfo.icon className="group-hover:animate-pulse relative z-10" size={28} />
                  <span className="relative z-10">
                    Access {roleInfo.title.split(' ')[0]} Hub
                  </span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform relative z-10" size={24} />
                </motion.button>
              )}
              
              {userRole === ROLES.customer && (
                <motion.button 
                  onClick={() => navigateTo(PAGES.healthyLifestyle)} 
                  className="group relative flex items-center space-x-4 px-10 py-5 rounded-2xl font-bold text-xl text-white shadow-2xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)",
                    y: -3
                  }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <Heart className="group-hover:animate-pulse relative z-10" size={28} />
                  <span className="relative z-10">Explore Wellness</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform relative z-10" size={24} />
                </motion.button>
              )}
            </motion.div>

            {/* Role-specific dashboard preview */}
            {roleInfo && (
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div 
                  className="p-8 rounded-3xl shadow-2xl backdrop-blur-xl border"
                  style={{ 
                    backgroundColor: `${colors.cardBackground}90`,
                    borderColor: `${roleInfo.color}30`
                  }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: colors.darkText }}>
                      {roleInfo.subtitle}
                    </h3>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto" style={{ color: colors.darkText }}>
                      {roleInfo.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {roleInfo.features.map((feature, index) => (
                      <motion.span
                        key={feature}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ 
                          backgroundColor: `${roleInfo.color}20`,
                          color: roleInfo.color
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown 
            size={32} 
            style={{ color: colors.primaryGreen }}
            className="opacity-60"
          />
        </motion.div>
      </section>

      {/* Enhanced Stats Section */}
      <motion.section 
        className="py-24 relative"
        variants={itemVariants}
      >
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(45deg, ${colors.primaryGreen}20 25%, transparent 25%), linear-gradient(-45deg, ${colors.goldTan}20 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${colors.accent}20 75%), linear-gradient(-45deg, transparent 75%, ${colors.secondaryGreen}20 75%)`,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-black mb-6" style={{ color: colors.darkText }}>
              Transforming Herbal Wellness
            </h2>
            <p className="text-xl opacity-80 max-w-3xl mx-auto" style={{ color: colors.darkText }}>
              Real impact through cutting-edge technology and community collaboration
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-sm border transition-all duration-500 cursor-pointer"
                style={{ backgroundColor: colors.cardBackground }}
                variants={itemVariants}
                custom={index}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  rotateY: 5
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Gradient background on hover */}
                <motion.div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${stat.gradient}`}
                />
                
                <div className="p-8 relative z-10">
                  <motion.div
                    className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
                    style={{ backgroundColor: `${stat.color}20` }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon
                      className="text-2xl group-hover:scale-110 transition-transform duration-300"
                      style={{ color: stat.color }}
                    />
                  </motion.div>
                  
                  <motion.p 
                    className="text-4xl font-black mb-2 text-center group-hover:scale-105 transition-transform duration-300" 
                    style={{ color: colors.darkText }}
                  >
                    {stat.value}
                  </motion.p>
                  
                  <p className="text-sm font-bold uppercase text-center mb-2 opacity-80" 
                     style={{ color: colors.darkText }}>
                    {stat.label}
                  </p>
                  
                  <p className="text-xs text-center opacity-60" 
                     style={{ color: colors.darkText }}>
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <motion.section 
        className="py-24 relative"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-20">
            <h2 className="text-6xl font-black mb-8" style={{ color: colors.darkText }}>
              Revolutionary Features
            </h2>
            <p className="text-2xl opacity-80 max-w-4xl mx-auto leading-relaxed" 
               style={{ color: colors.darkText }}>
              Discover the cutting-edge technology and innovative solutions that make AyurTrace 
              the world's leading platform for herbal traceability and wellness management.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-500 cursor-pointer border"
                style={{ backgroundColor: colors.cardBackground }}
                whileHover={{ 
                  scale: 1.03,
                  y: -10,
                  rotateX: 5,
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
              >
                {/* Animated gradient background */}
                <motion.div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`}
                />
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-40"
                      style={{ 
                        backgroundColor: feature.color,
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 15}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0, 0.4, 0],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.8,
                      }}
                    />
                  ))}
                </div>

                <div className="p-10 relative z-10">
                  <motion.div
                    className="flex items-center justify-between mb-8"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <feature.icon 
                      className="text-6xl group-hover:animate-pulse"
                      style={{ color: feature.color }}
                    />
                  </motion.div>
                  
                  <h3 
                    className="text-3xl font-black mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
                    style={{ 
                      color: colors.darkText,
                      backgroundImage: `linear-gradient(135deg, ${feature.color}, ${colors.primaryGreen})`
                    }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="leading-relaxed text-lg"
                    style={{ color: colors.darkText }}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}