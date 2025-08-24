"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface LightsaberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "blue" | "green" | "red" | "purple";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const LightsaberButton = ({
  children,
  onClick,
  href,
  variant = "blue",
  className,
  disabled = false,
  type = "button",
}: LightsaberButtonProps) => {
  const { effectiveTheme } = useTheme();

  const getVariantClasses = () => {
    if (effectiveTheme !== "starwars") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }

    switch (variant) {
      case "blue":
        return "bg-[#4FC3F7] text-black hover:bg-[#29B6F6] shadow-[0_0_20px_rgba(79,195,247,0.4)] hover:shadow-[0_0_30px_rgba(79,195,247,0.6)] border border-[#4FC3F7]/30";
      case "green":
        return "bg-[#66BB6A] text-black hover:bg-[#4CAF50] shadow-[0_0_20px_rgba(102,187,106,0.4)] hover:shadow-[0_0_30px_rgba(102,187,106,0.6)] border border-[#66BB6A]/30";
      case "red":
        return "bg-[#F44336] text-white hover:bg-[#E53935] shadow-[0_0_20px_rgba(244,67,54,0.4)] hover:shadow-[0_0_30px_rgba(244,67,54,0.6)] border border-[#F44336]/30";
      case "purple":
        return "bg-[#9C27B0] text-white hover:bg-[#8E24AA] shadow-[0_0_20px_rgba(156,39,176,0.4)] hover:shadow-[0_0_30px_rgba(156,39,176,0.6)] border border-[#9C27B0]/30";
      default:
        return "bg-[#4FC3F7] text-black hover:bg-[#29B6F6] shadow-[0_0_20px_rgba(79,195,247,0.4)] hover:shadow-[0_0_30px_rgba(79,195,247,0.6)] border border-[#4FC3F7]/30";
    }
  };

  const baseClasses =
    "inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform";

  const lightsaberClasses =
    effectiveTheme === "starwars"
      ? "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
      : "";

  const combinedClasses = cn(
    baseClasses,
    getVariantClasses(),
    lightsaberClasses,
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const MotionComponent = href ? motion.a : motion.button;

  return (
    <MotionComponent
      href={href}
      onClick={!disabled ? onClick : undefined}
      className={combinedClasses}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled}
      type={href ? undefined : type}
      initial={
        effectiveTheme === "starwars"
          ? { boxShadow: "0 0 0px rgba(79,195,247,0)" }
          : {}
      }
      animate={
        effectiveTheme === "starwars"
          ? {
              boxShadow: [
                "0 0 20px rgba(79,195,247,0.4)",
                "0 0 25px rgba(79,195,247,0.5)",
                "0 0 20px rgba(79,195,247,0.4)",
              ],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {effectiveTheme === "starwars" && (
        <>
          {/* Core glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

          {/* Edge highlight */}
          <div className="absolute inset-[1px] rounded-lg bg-gradient-to-b from-white/20 to-transparent" />
        </>
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </MotionComponent>
  );
};

export default LightsaberButton;
