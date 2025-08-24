import { useState, useEffect } from "react";

/**
 * Hook to detect user's motion preferences and performance capabilities
 */
export function usePerformancePreferences() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [frameRate, setFrameRate] = useState(60);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Detect low-end device based on available cores and memory
    const cores = navigator.hardwareConcurrency || 1;
    const memory =
      (navigator as unknown as { deviceMemory?: number }).deviceMemory || 1; // GB, not available in all browsers

    // Consider device low-end if it has <= 2 cores or <= 2GB RAM
    const isLowEnd = cores <= 2 || memory <= 2;
    setIsLowEndDevice(isLowEnd);

    // Set appropriate frame rate based on performance
    if (reducedMotion) {
      setFrameRate(0); // No animation
    } else if (isLowEnd) {
      setFrameRate(30); // Lower frame rate for low-end devices
    } else {
      setFrameRate(60); // Full frame rate for capable devices
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [reducedMotion]);

  return {
    reducedMotion,
    isLowEndDevice,
    frameRate,
    // Calculated performance settings
    shouldAnimate: !reducedMotion,
    animationQuality: reducedMotion ? "none" : isLowEndDevice ? "low" : "high",
    particleCount: reducedMotion ? 0 : isLowEndDevice ? 100 : 300,
  };
}

/**
 * Throttle animation frames to target FPS
 */
export function useThrottledAnimationFrame(
  callback: () => void,
  targetFps: number,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || targetFps === 0) return;

    let animationId: number;
    let lastTime = 0;
    const interval = 1000 / targetFps;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= interval) {
        callback();
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [callback, targetFps, enabled]);
}

/**
 * Check if element is visible in viewport (for performance optimization)
 */
export function useElementVisibility<T extends HTMLElement>(
  elementRef: React.RefObject<T | null>
) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return isVisible;
}
