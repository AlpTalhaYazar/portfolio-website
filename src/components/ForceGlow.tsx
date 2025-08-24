"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ForceGlowProps {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  color?: "blue" | "green" | "red" | "purple" | "white";
  className?: string;
  animate?: boolean;
}

const ForceGlow = ({
  children,
  intensity = "medium",
  color = "blue",
  className,
  animate = true,
}: ForceGlowProps) => {
  const { effectiveTheme } = useTheme();

  const getGlowClasses = () => {
    const colors = {
      blue: "rgba(79, 195, 247, 0.8)",
      green: "rgba(102, 187, 106, 0.8)",
      red: "rgba(244, 67, 54, 0.8)",
      purple: "rgba(156, 39, 176, 0.8)",
      white: "rgba(255, 255, 255, 0.8)",
    };

    const intensityMap = {
      subtle: "0 0 10px",
      medium: "0 0 20px",
      strong: "0 0 30px",
    };

    if (effectiveTheme !== "starwars") {
      return {
        textShadow: "none",
        color: "inherit",
      };
    }

    return {
      textShadow: `${intensityMap[intensity]} ${colors[color]}, ${intensityMap[intensity]} ${colors[color]}`,
      color: colors[color].replace("0.8", "1"),
    };
  };

  const pulseAnimation =
    animate && effectiveTheme === "starwars"
      ? {
          textShadow: [
            `0 0 10px ${getGlowClasses().color?.replace(
              "1)",
              "0.4)"
            )}, 0 0 20px ${getGlowClasses().color?.replace("1)", "0.2)")}`,
            `0 0 20px ${getGlowClasses().color?.replace(
              "1)",
              "0.6)"
            )}, 0 0 30px ${getGlowClasses().color?.replace("1)", "0.3)")}`,
            `0 0 10px ${getGlowClasses().color?.replace(
              "1)",
              "0.4)"
            )}, 0 0 20px ${getGlowClasses().color?.replace("1)", "0.2)")}`,
          ],
        }
      : {};

  if (effectiveTheme !== "starwars") {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      style={getGlowClasses()}
      animate={pulseAnimation}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}

      {/* Additional glow layers for stronger effect */}
      {intensity === "strong" && (
        <>
          <span
            className="absolute inset-0 opacity-50 blur-sm"
            style={getGlowClasses()}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 opacity-30 blur-md"
            style={getGlowClasses()}
          >
            {children}
          </span>
        </>
      )}
    </motion.span>
  );
};

export default ForceGlow;
