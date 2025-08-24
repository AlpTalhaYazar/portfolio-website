"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { useMemo, memo } from "react";

interface HologramCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "glowing";
  animate?: boolean;
}

const HologramCard = memo(
  ({
    children,
    className,
    variant = "default",
    animate = true,
  }: HologramCardProps) => {
    const { effectiveTheme } = useTheme();

    // Memoize expensive variant class calculation
    const variantClasses = useMemo(() => {
      if (effectiveTheme !== "starwars") {
        return "bg-card text-card-foreground border border-border";
      }

      const baseStarWars =
        "bg-gradient-to-br from-[#0a0a0f]/90 via-[#0a0a0f]/80 to-[#0a0a0f]/90 text-white backdrop-blur-sm";

      switch (variant) {
        case "bordered":
          return `${baseStarWars} border border-[#00BCD4]/30 shadow-[0_0_20px_rgba(0,188,212,0.1)] hover:shadow-[0_0_30px_rgba(0,188,212,0.2)]`;
        case "glowing":
          return `${baseStarWars} border border-[#4FC3F7]/40 shadow-[0_0_25px_rgba(79,195,247,0.15)] hover:shadow-[0_0_40px_rgba(79,195,247,0.25)]`;
        default:
          return `${baseStarWars} border border-[#455A64]/30 shadow-[0_0_15px_rgba(0,188,212,0.05)]`;
      }
    }, [effectiveTheme, variant]);

    // Memoize hologram effect calculation
    const hologramEffect = useMemo(
      () =>
        effectiveTheme === "starwars"
          ? "relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00BCD4]/5 before:to-transparent before:animate-pulse"
          : "",
      [effectiveTheme]
    );

    // Memoize combined classes
    const combinedClasses = useMemo(
      () =>
        cn(
          "rounded-lg p-6 transition-all duration-300",
          variantClasses,
          hologramEffect,
          className
        ),
      [variantClasses, hologramEffect, className]
    );

    if (!animate) {
      return (
        <div className={combinedClasses}>
          {effectiveTheme === "starwars" && (
            <>
              {/* Scanning line effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="absolute -top-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BCD4]/50 to-transparent animate-ping" />
              </div>

              {/* Corner highlights */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00BCD4]/60 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00BCD4]/60 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00BCD4]/60 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00BCD4]/60 rounded-br-lg" />
            </>
          )}

          <div className="relative z-10">{children}</div>
        </div>
      );
    }

    return (
      <motion.div
        className={combinedClasses}
        whileHover={
          effectiveTheme === "starwars"
            ? {
                scale: 1.02,
                boxShadow:
                  variant === "glowing"
                    ? "0 0 50px rgba(79,195,247,0.3)"
                    : "0 0 30px rgba(0,188,212,0.2)",
              }
            : { scale: 1.02 }
        }
        initial={
          effectiveTheme === "starwars"
            ? {
                opacity: 0.8,
                y: 10,
              }
            : { opacity: 0, y: 20 }
        }
        animate={
          effectiveTheme === "starwars"
            ? {
                opacity: 1,
                y: 0,
              }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {effectiveTheme === "starwars" && (
          <>
            {/* Scanning line effect */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <motion.div
                className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BCD4]/70 to-transparent"
                animate={{
                  y: [0, 100, 200, 300, 400, 500],
                  opacity: [0, 1, 1, 1, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2,
                }}
              />
            </div>

            {/* Corner highlights */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00BCD4]/60 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00BCD4]/60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00BCD4]/60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00BCD4]/60 rounded-br-lg" />

            {/* Hologram flicker */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-[#00BCD4]/5 to-transparent rounded-lg"
              animate={{ opacity: [0.3, 0.5, 0.3, 0.7, 0.3] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </>
        )}

        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

HologramCard.displayName = "HologramCard";

export default HologramCard;
