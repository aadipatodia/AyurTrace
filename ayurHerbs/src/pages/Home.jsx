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
          icon: Leaf,
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
                Ayur
              </span>{" "}
              <span 
                className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
              >
                Trace
              </span>
            </h1>

            <p 
              className="text-xl md:text-2xl mb-12 leading-relaxed"
              style={{ color: colors.darkText }}
            >
              Your comprehensive platform for herbal discovery and supply chain traceability. 
              Join thousands in building the future of natural health.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {roleInfo && (
                <motion.button onClick={roleInfo.action} className="group flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-all duration-300" style={{ backgroundColor: roleInfo.color }} whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.95 }} >
                  <roleInfo.icon className="group-hover:animate-pulse" size={24} />
                  <span>{roleInfo.title.split(' ')[0]}</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              )}
              {userRole === ROLES.customer && (
                <motion.button onClick={() => navigateTo(PAGES.healthyLifestyle)} className="group flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-all duration-300" style={{ backgroundColor: colors.primaryGreen }} whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.95 }}>
                  <Sparkles className="group-hover:animate-spin" size={24} />
                  <span>Explore Lifestyle</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section className="py-16" variants={itemVariants} >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-center"
                style={{ backgroundColor: colors.cardBackground }}
                variants={itemVariants}
                custom={index}
              >
                <stat.icon
                  className="text-4xl mx-auto mb-3"
                  style={{ color: colors.primaryGreen }}
                />
                <p className="text-3xl font-bold mb-1" style={{ color: colors.darkText }}>
                  {stat.value}
                </p>
                <p className="text-sm font-semibold uppercase" style={{ color: colors.darkText }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Feature Section */}
      <motion.section className="py-16" variants={containerVariants}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-12" style={{ color: colors.darkText }}>
            Our Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Assurance",
                description: "Leverage blockchain technology to ensure the authenticity and quality of every herb from farm to table.",
                icon: Award,
                color: colors.accent
              },
              {
                title: "Transparent Supply Chain",
                description: "Trace every step of the journey, giving you peace of mind and building trust in the products you use.",
                icon: TrendingUp,
                color: colors.secondaryGreen
              },
              {
                title: "Community & Knowledge",
                description: "Join a vibrant network of growers, processors, and health enthusiasts",
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