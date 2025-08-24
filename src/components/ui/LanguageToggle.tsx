"use client";

import { useState, useEffect, useMemo, memo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

const LanguageToggle = memo(() => {
  const { language, setLanguage, languages, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get array of supported languages
  const supportedLanguages = useMemo(
    () => Object.entries(languages).map(([_, config]) => config),
    [languages]
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
          setFocusedIndex((prev) => (prev + 1) % supportedLanguages.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex(
            (prev) =>
              (prev - 1 + supportedLanguages.length) % supportedLanguages.length
          );
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIndex >= 0) {
            setLanguage(supportedLanguages[focusedIndex].code);
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
    [isOpen, focusedIndex, supportedLanguages, setLanguage]
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

  // Get current language config
  const currentLanguage = useMemo(
    () => supportedLanguages.find((lang) => lang.code === language),
    [supportedLanguages, language]
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
        className="language-toggle flex items-center justify-center gap-1 px-3 h-10 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t.language.toggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        <span className="text-lg" aria-hidden="true">
          {currentLanguage?.flag}
        </span>
        <ChevronDown
          size={14}
          className={`text-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
        <span className="sr-only">
          {t.language.current}: {currentLanguage?.name}
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
              className="absolute right-0 top-12 z-50 min-w-[160px] bg-background border border-border rounded-lg shadow-lg py-2"
              role="listbox"
              aria-label={t.language.select}
            >
              {supportedLanguages.map((lang, index) => {
                const isSelected = language === lang.code;
                const isFocused = focusedIndex === index;

                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
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
                    aria-label={`${lang.name}${
                      isSelected ? ` (${t.language.current})` : ""
                    }`}
                    tabIndex={-1}
                  >
                    <span className="text-lg" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {isSelected && (
                      <motion.div
                        layoutId="language-indicator"
                        className="ml-auto w-2 h-2 bg-primary rounded-full"
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="sr-only">
                      {isSelected ? t.language.current : t.language.select}
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

LanguageToggle.displayName = "LanguageToggle";

export default LanguageToggle;
