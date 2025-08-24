"use client";

import { useState, useEffect, useMemo, memo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor, Terminal, Zap } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize static themes array to prevent recreation on every render
  const themes = useMemo(
    () =>
      [
        { id: "light", label: "Light", icon: Sun },
        { id: "dark", label: "Dark", icon: Moon },
        { id: "matrix", label: "Matrix", icon: Terminal },
        { id: "starwars", label: "Star Wars", icon: Zap },
        { id: "system", label: "System", icon: Monitor },
      ] as const,
    []
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % themes.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + themes.length) % themes.length);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIndex >= 0) {
            setTheme(themes[focusedIndex].id);
            setIsOpen(false);
            setFocusedIndex(-1);
            triggerRef.current?.focus();
          }
          break;
        case "Tab":
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    },
    [isOpen, focusedIndex, themes, setTheme]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Memoize current theme calculation
  const currentTheme = useMemo(
    () => themes.find((t) => t.id === theme),
    [themes, theme]
  );

  const CurrentIcon = useMemo(
    () => currentTheme?.icon || Monitor,
    [currentTheme]
  );

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-secondary animate-pulse"></div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="theme-toggle flex items-center justify-center w-10 h-10 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Current theme: ${
          currentTheme?.label || "Unknown"
        }. Click to open theme menu.`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        <CurrentIcon size={18} className="text-foreground" />
        <span className="sr-only">
          Current theme: {currentTheme?.label || "Unknown"}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 min-w-[140px] bg-background border border-border rounded-lg shadow-lg py-2"
              role="listbox"
              aria-label="Theme options"
            >
              {themes.map((themeOption, index) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.id;
                const isFocused = focusedIndex === index;

                return (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setIsOpen(false);
                      setFocusedIndex(-1);
                      triggerRef.current?.focus();
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors duration-200 keyboard-focus ${
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    } ${
                      isFocused
                        ? "bg-accent text-accent-foreground ring-2 ring-primary ring-inset"
                        : ""
                    }`}
                    role="option"
                    aria-selected={isSelected}
                    aria-label={`${themeOption.label} theme${
                      isSelected ? " (current)" : ""
                    }`}
                    tabIndex={-1}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span className="text-sm font-medium">
                      {themeOption.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="theme-indicator"
                        className="ml-auto w-2 h-2 bg-primary rounded-full"
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="sr-only">
                      {isSelected ? "Current theme" : "Select theme"}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
