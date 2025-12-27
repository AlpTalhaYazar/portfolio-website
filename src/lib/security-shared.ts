/**
 * Shared Security Utilities
 *
 * This module contains shared security functions and types that are used by both
 * the Node.js runtime (security.ts) and Edge runtime (security-edge.ts) versions.
 *
 * IMPORTANT: This file should only contain:
 * - Pure functions that don't depend on runtime-specific APIs
 * - Type definitions
 * - Constants
 */

import type { SecurityEvent } from "@/types";

/**
 * Validate honeypot field (invisible to users, should be empty)
 * Pure function - works in any runtime
 */
export function validateHoneypot(
  honeypotValue: string | null | undefined
): boolean {
  return !honeypotValue || honeypotValue.trim() === "";
}

/**
 * Clean and validate input data
 * Pure function - works in any runtime
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .substring(0, 5000); // Limit length
}

/**
 * Check for suspicious patterns in form data
 * Pure function - works in any runtime
 */
export function detectSpam(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): boolean {
  const { name, subject, message } = data;

  // Check for common spam patterns
  const spamKeywords = [
    "viagra",
    "casino",
    "bitcoin",
    "crypto",
    "investment",
    "loan",
    "debt",
    "credit",
    "mortgage",
    "insurance",
    "seo services",
    "web design",
    "marketing services",
  ];

  const content = `${name} ${subject} ${message}`.toLowerCase();

  // Check for spam keywords
  if (spamKeywords.some((keyword) => content.includes(keyword))) {
    return true;
  }

  // Check for excessive links
  const linkCount = (content.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    return true;
  }

  // Check for repeated characters (typical spam pattern)
  if (/(.)\1{10,}/.test(content)) {
    return true;
  }

  // Check for all caps message (typical spam)
  if (message.length > 50 && message === message.toUpperCase()) {
    return true;
  }

  return false;
}

/**
 * Format security event for logging
 * Pure function - works in any runtime
 */
export function formatSecurityEvent(event: Partial<SecurityEvent>): SecurityEvent {
  return {
    type: event.type || "security_success",
    ip: event.ip || "unknown",
    userAgent: event.userAgent,
    timestamp: event.timestamp || new Date().toISOString(),
    details: event.details,
    severity: event.severity || "low",
  };
}
