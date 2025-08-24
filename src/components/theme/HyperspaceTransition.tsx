"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface HyperspaceTransitionProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const HyperspaceTransition = ({
  isVisible,
  onComplete,
}: HyperspaceTransitionProps) => {
  const { effectiveTheme } = useTheme();

  if (effectiveTheme !== "starwars") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          {/* Star streaks */}
          {Array.from({ length: 200 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
              }}
              animate={{
                scaleX: [1, 50, 100],
                scaleY: [1, 1, 1],
                opacity: [1, 0.8, 0],
                x: [0, Math.random() * 500 - 250, Math.random() * 1000 - 500],
                y: [0, Math.random() * 300 - 150, Math.random() * 600 - 300],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Central bright flash */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-white via-blue-100 to-transparent"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2, 4] }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Blue hyperspace tunnel effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-transparent via-blue-500/20 to-blue-900/40"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 3], rotate: [0, 180, 360] }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HyperspaceTransition;
