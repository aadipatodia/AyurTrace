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
  Sparkles
} from "lucide-react";

export default function Home({ colors, navigateTo, PAGES, userRole, ROLES }) {
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

  const stats = [
    { label: "Herbs Catalogued", value: "2,450+", icon: Database },
    { label: "Active Users", value: "12,800+", icon: Users },
    { label: "Health Tips", value: "890+", icon: TrendingUp },
    { label: "Quality Approved", value: "98.5%", icon: Award },
  ];

  const getRoleInfo = () => {
    switch (userRole) {
      case ROLES.customer:
        return {
          title: "Consumer Dashboard",
          description: "Track herb origins, verify quality, and discover wellness insights",
          icon: User,
          action: () => navigateTo(PAGES.customer),
          color: colors.accent
        };
      case ROLES.herbContributor:
        return {
          title: "Producer Hub",
          description: "Add new herbs, manage inventory, and contribute to our database",
          icon: Leaf,  // ✅ Changed from Seedling to Leaf
          action: () => navigateTo(PAGES.herbForm),
          color: colors.secondaryGreen
        };
      case ROLES.processor:
        return {
          title: "Processor Central",
          description: "Process batches, manage supply chain, and ensure quality",
          icon: Factory,
          action: () => navigateTo(PAGES.processor),
          color: colors.goldTan
        };
      default:
        return null;
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <motion.div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full"
               style={{ backgroundColor: colors.primaryGreen }} />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full"
               style={{ backgroundColor: colors.goldTan }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
               style={{ backgroundColor: colors.accent }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative">
                <Leaf 
                  className="text-8xl mr-4"
                  style={{ color: colors.primaryGreen }}
                />
                <Sparkles 
                  className="absolute -top-2 -right-2 text-4xl animate-pulse"
                  style={{ color: colors.goldTan }}
                />
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span 
                className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
              >
                Herbal
              </span>{" "}
              <span 
                className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
              >
                Wellness
              </span>
            </h1>

            <p 
              className="text-xl md:text-2xl mb-12 leading-relaxed"
              style={{ color: colors.darkText }}
            >
              Your comprehensive platform for herbal discovery, quality assurance, and wellness guidance. 
              Join thousands in building the future of natural health.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => navigateTo(PAGES.healthyLifestyle)}
                className="group flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-all duration-300"
                style={{ backgroundColor: colors.primaryGreen }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Leaf className="group-hover:animate-bounce" size={24} />
                <span>Explore Wellness</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>

              {roleInfo && (
                <motion.button
                  onClick={roleInfo.action}
                  className="group flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-all duration-300"
                  style={{ backgroundColor: roleInfo.color }}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <roleInfo.icon className="group-hover:animate-pulse" size={24} />
                  <span>{roleInfo.title.split(' ')[0]}</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-16"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl shadow-lg backdrop-blur-sm"
                style={{ backgroundColor: colors.cardBackground }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.1)"
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon 
                  className="mx-auto mb-3 text-4xl"
                  style={{ color: colors.primaryGreen }}
                />
                <h3 
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors.primaryGreen }}
                >
                  {stat.value}
                </h3>
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors.darkText }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Role-Specific Dashboard */}
      {roleInfo && (
        <motion.section 
          className="py-16"
          variants={itemVariants}
        >
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl p-12 text-center"
              style={{ backgroundColor: colors.cardBackground }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full transform translate-x-32 -translate-y-32"
                     style={{ backgroundColor: roleInfo.color }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full transform -translate-x-24 translate-y-24"
                     style={{ backgroundColor: colors.primaryGreen }} />
              </div>

              <div className="relative z-10">
                <motion.div
                  className="inline-block p-6 rounded-full mb-6"
                  style={{ backgroundColor: `${roleInfo.color}20` }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <roleInfo.icon 
                    className="text-6xl"
                    style={{ color: roleInfo.color }}
                  />
                </motion.div>

                <h2 
                  className="text-4xl font-bold mb-4"
                  style={{ color: colors.primaryGreen }}
                >
                  {roleInfo.title}
                </h2>
                <p 
                  className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
                  style={{ color: colors.darkText }}
                >
                  {roleInfo.description}
                </p>

                <motion.button
                  onClick={roleInfo.action}
                  className="group inline-flex items-center space-x-3 px-10 py-4 rounded-full font-bold text-xl text-white shadow-xl transition-all duration-300"
                  style={{ backgroundColor: roleInfo.color }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.15)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Enter {roleInfo.title.split(' ')[0]}</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Features Preview */}
      <motion.section 
        className="py-16"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            style={{ color: colors.primaryGreen }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Discover What's Possible
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
              title: "Quality Traceability",
              description: "Track every herb from farm to shelf with blockchain-verified authenticity",
              icon: Database,
              color: colors.primaryGreen
            },{
              title: "Wellness Insights",
              description: "Get personalized health recommendations based on your preferences",
              icon: TrendingUp,
              color: colors.accent
            },{
              title: "Community Driven",
              description: "Join a network of growers, processors, and health enthusiasts",
              icon: Users,
              color: colors.goldTan
            }].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group p-8 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl cursor-pointer"
                style={{ backgroundColor: colors.cardBackground }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <feature.icon 
                  className="text-5xl mb-4 group-hover:animate-pulse"
                  style={{ color: feature.color }}
                />
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{ color: colors.primaryGreen }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="leading-relaxed"
                  style={{ color: colors.darkText }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
