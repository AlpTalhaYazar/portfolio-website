"use client";

import { useEffect, useRef, memo } from "react";
import { useTheme } from "./ThemeProvider";
import {
  usePerformancePreferences,
  useElementVisibility,
} from "@/lib/performance";

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  age: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  speed: number;
  color: string;
  colorName: string;
  trail: TrailPoint[];
}

const StarField = memo(() => {
  const { effectiveTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const lastFrameTimeRef = useRef(0);

  // Performance optimizations
  const { shouldAnimate, particleCount, frameRate } =
    usePerformancePreferences();
  const isVisible = useElementVisibility(canvasRef);

  useEffect(() => {
    if (effectiveTheme !== "starwars" || !shouldAnimate || !isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      const stars: Star[] = [];

      // Star Wars color palette
      const starColors = [
        { name: "lightsaber-blue", color: "79, 195, 247" }, // Blue lightsaber
        { name: "lightsaber-green", color: "102, 187, 106" }, // Green lightsaber
        { name: "lightsaber-red", color: "244, 67, 54" }, // Red lightsaber
        { name: "lightsaber-purple", color: "156, 39, 176" }, // Purple lightsaber
        { name: "hologram-blue", color: "0, 188, 212" }, // Hologram blue
        { name: "golden-amber", color: "255, 193, 7" }, // Golden amber
        { name: "white", color: "255, 255, 255" }, // Classic white stars
        { name: "ice-blue", color: "173, 216, 230" }, // Ice planet blue
      ];

      for (let i = 0; i < particleCount; i++) {
        // Random color from palette
        const colorData =
          starColors[Math.floor(Math.random() * starColors.length)];

        // Varied speeds: faster stars for dramatic effect, slower for depth
        const speed = Math.random() * 4 + 0.5; // Speed between 0.5 and 4.5

        stars.push({
          x: Math.random() * 1600 - 800,
          y: Math.random() * 900 - 450,
          z: Math.random() * 1000,
          px: 0,
          py: 0,
          speed: speed,
          color: colorData.color,
          colorName: colorData.name,
          trail: [],
        });
      }
      starsRef.current = stars;
    };

    const moveStars = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"; // Slightly lighter fade for more vibrant trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // Use individual star speed
        star.z -= star.speed;

        if (star.z <= 0) {
          // Reassign new properties for variety
          const starColors = [
            { name: "lightsaber-blue", color: "79, 195, 247" },
            { name: "lightsaber-green", color: "102, 187, 106" },
            { name: "lightsaber-red", color: "244, 67, 54" },
            { name: "lightsaber-purple", color: "156, 39, 176" },
            { name: "hologram-blue", color: "0, 188, 212" },
            { name: "golden-amber", color: "255, 193, 7" },
            { name: "white", color: "255, 255, 255" },
            { name: "ice-blue", color: "173, 216, 230" },
          ];
          const colorData =
            starColors[Math.floor(Math.random() * starColors.length)];

          star.x = Math.random() * 1600 - 800;
          star.y = Math.random() * 900 - 450;
          star.z = 1000;
          star.speed = Math.random() * 4 + 0.5; // New random speed
          star.color = colorData.color; // New random color
          star.colorName = colorData.name;
          // Reset trail
          star.px = 0;
          star.py = 0;
          star.trail = []; // Clear trail history
        }

        const x = (star.x / star.z) * centerX + centerX;
        const y = (star.y / star.z) * centerY + centerY;

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          const size = Math.max((1 - star.z / 1000) * 2.5, 0.5);
          const opacity = Math.max(1 - star.z / 1000, 0.1);

          // Add current position to trail if star has moved significantly
          if (star.px !== 0 && star.py !== 0) {
            const distance = Math.sqrt((x - star.px) ** 2 + (y - star.py) ** 2);
            if (distance > 2) {
              // Only add trail point if movement is significant
              star.trail.push({
                x: star.px,
                y: star.py,
                opacity: opacity * 0.8,
                age: 0,
              });
            }
          }

          // Age and fade trail points
          star.trail = star.trail
            .map((point) => ({
              ...point,
              age: point.age + 1,
              opacity: point.opacity * 0.92, // Gradual fade
            }))
            .filter((point) => point.opacity > 0.01 && point.age < 30); // Remove very faded or old points

          // Draw fading trail segments
          if (star.trail.length > 1) {
            for (let i = 0; i < star.trail.length - 1; i++) {
              const currentPoint = star.trail[i];
              const nextPoint = star.trail[i + 1];

              const trailOpacity = Math.min(
                currentPoint.opacity,
                nextPoint.opacity
              );
              const trailSize = Math.max(
                size * (trailOpacity / opacity) * 0.8,
                0.5
              );

              // Main trail segment
              ctx.strokeStyle = `rgba(${star.color}, ${trailOpacity})`;
              ctx.lineWidth = trailSize;
              ctx.beginPath();
              ctx.moveTo(currentPoint.x, currentPoint.y);
              ctx.lineTo(nextPoint.x, nextPoint.y);
              ctx.stroke();

              // Bright core trail
              ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity * 0.5})`;
              ctx.lineWidth = trailSize * 0.3;
              ctx.beginPath();
              ctx.moveTo(currentPoint.x, currentPoint.y);
              ctx.lineTo(nextPoint.x, nextPoint.y);
              ctx.stroke();
            }

            // Connect last trail point to current position
            const lastPoint = star.trail[star.trail.length - 1];
            if (lastPoint) {
              const trailOpacity = lastPoint.opacity;
              const trailSize = Math.max(
                size * (trailOpacity / opacity) * 0.8,
                0.5
              );

              // Main trail segment to current position
              ctx.strokeStyle = `rgba(${star.color}, ${trailOpacity})`;
              ctx.lineWidth = trailSize;
              ctx.beginPath();
              ctx.moveTo(lastPoint.x, lastPoint.y);
              ctx.lineTo(x, y);
              ctx.stroke();

              // Bright core trail to current position
              ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity * 0.5})`;
              ctx.lineWidth = trailSize * 0.3;
              ctx.beginPath();
              ctx.moveTo(lastPoint.x, lastPoint.y);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          }

          // Enhanced star glow effect
          const glowSize = size * 2;

          // Outer glow
          ctx.fillStyle = `rgba(${star.color}, ${opacity * 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, glowSize, 0, Math.PI * 2);
          ctx.fill();

          // Main star
          ctx.fillStyle = `rgba(${star.color}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Core bright spot
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
          ctx.fill();

          star.px = x;
          star.py = y;
        }
      });
    };

    const animate = (currentTime: number) => {
      // Throttle to target frame rate
      if (currentTime - lastFrameTimeRef.current >= 1000 / frameRate) {
        moveStars();
        lastFrameTimeRef.current = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    initStars();
    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effectiveTheme, shouldAnimate, isVisible, particleCount, frameRate]);

  if (effectiveTheme !== "starwars") return null;

  // Show static background if animations are disabled
  if (!shouldAnimate) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #001122 0%, #000000 70%)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background:
          "radial-gradient(ellipse at center, #001122 0%, #000000 70%)",
      }}
    />
  );
});

StarField.displayName = "StarField";

export default StarField;
