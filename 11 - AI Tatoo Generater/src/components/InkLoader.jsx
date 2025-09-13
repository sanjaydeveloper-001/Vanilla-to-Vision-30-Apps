import { motion } from "framer-motion";

const dots = [0, 1, 2];

export default function InkLoader({ size = 20 }) {
  return (
    <div
      role="status"
      aria-label="Generating tattoo"
      className="flex items-center gap-4"
    >
      {/* Ink drop (left) */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: [0.9, 1.05, 0.95, 1], opacity: [0.8, 1, 0.9, 0.95] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center"
      >
        
      </motion.div>

      {/* Rising dots */}
      <div className="flex items-end gap-3 h-6">
        {dots.map((i) => (
          <motion.span
            key={i}
            className="block w-3 h-3 rounded-full bg-gray-700"
            animate={{
              y: [0, -8, 0],
              opacity: [0.6, 1, 0.7],
              scale: [1, 1.15, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
