import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function LoadingSpinner({ colors }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="mb-6"
      >
        <Leaf className="text-8xl" style={{ color: colors.primaryGreen }} />
      </motion.div>
      <motion.p 
        className="text-xl font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading your herbal journey...
      </motion.p>
    </div>
  );
}
