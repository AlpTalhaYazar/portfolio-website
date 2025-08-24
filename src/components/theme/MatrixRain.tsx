"use client";

import { useEffect, useRef, memo } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import StructuredData from "@/components/utils/StructuredData";
import {
  usePerformancePreferences,
  useElementVisibility,
} from "@/lib/performance";

const MatrixRain = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { effectiveTheme } = useTheme();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Performance optimizations
  const { shouldAnimate, frameRate, isLowEndDevice } =
    usePerformancePreferences();
  const isVisible = useElementVisibility(canvasRef);

  useEffect(() => {
    if (effectiveTheme !== "matrix" || !shouldAnimate || !isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters
    const matrix = StructuredData.name;
    const matrixArray = matrix.split("");

    // Adjust font size and density based on device performance
    const fontSize = isLowEndDevice ? 14 : 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    // Animation function
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix text
      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text =
          matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Calculate interval based on target frame rate
    const animationInterval = frameRate > 0 ? 1000 / frameRate : 50;
    intervalRef.current = setInterval(draw, animationInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [effectiveTheme, shouldAnimate, isVisible, frameRate, isLowEndDevice]);

  if (effectiveTheme !== "matrix") return null;

  // Show static background if animations are disabled
  if (!shouldAnimate) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          background: "linear-gradient(to bottom, #001100, #000800)",
          mixBlendMode: "screen",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ mixBlendMode: "screen" }}
    />
  );
});

MatrixRain.displayName = "MatrixRain";

export default MatrixRain;
