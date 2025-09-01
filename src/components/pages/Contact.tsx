"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Shield, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n";
import LightsaberButton from "@/components/ui/LightsaberButton";
import HologramCard from "@/components/ui/HologramCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { SECURITY_CONSTANTS } from "@/types";
import { logger } from "@/lib/logger";
import { useCSRFSecurity, type SecurityError } from "@/hooks";
import ContactInfo from "./ContactInfo";

// Note: SecurityError interface is now imported from @/hooks

const Contact = () => {
  // Form state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState<{
    escalationLevel?: number;
  } | null>(null);

  // Security state - using custom hook
  const {
    csrfToken,
    sessionId,
    tokenExpires,
    isSecurityLoading,
    securityError,
    fetchCSRFToken,
    clearSecurityError,
    isTokenExpired,
    isTokenValid,
  } = useCSRFSecurity();

  // Refs for cleanup and state management
  const submitErrorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { effectiveTheme } = useTheme();
  const { t } = useTranslation();

  const contactFormSchema = z.object({
    name: z
      .string()
      .min(2, t.contact.validation.nameRequired)
      .max(100, "Name too long"),
    email: z
      .string()
      .email(t.contact.validation.emailInvalid)
      .max(255, "Email too long"),
    subject: z
      .string()
      .min(5, t.contact.validation.subjectRequired)
      .max(200, "Subject too long"),
    message: z
      .string()
      .min(10, t.contact.validation.messageMinLength)
      .max(5000, "Message too long"),
    honeypot: z.string().optional(), // Hidden field for bot detection
    csrfToken: z.string().optional(), // Will be populated automatically
  });

  type ContactFormData = z.infer<typeof contactFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  // Note: CSRF token management is now handled by useCSRFSecurity hook

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (submitErrorTimeoutRef.current) {
        clearTimeout(submitErrorTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError(null);
      clearSecurityError();
      setIsBlocked(false);

      // Ensure we have a valid CSRF token
      if (!isTokenValid()) {
        logger.dev.log("Refreshing CSRF token before form submission", {
          hasToken: !!csrfToken,
          hasSession: !!sessionId,
          isExpired: isTokenExpired(),
          tokenExpires: tokenExpires ? new Date(tokenExpires) : null,
        });

        const tokenRefreshed = await fetchCSRFToken();

        if (!tokenRefreshed) {
          throw new Error(
            "Security validation failed. Please refresh the page."
          );
        }
      }

      // Prepare submission data with security token
      const submissionData = {
        ...data,
        csrfToken: csrfToken!,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (sessionId) {
        headers["x-session-id"] = sessionId;
      }

      const response = await fetch("/api/contact/", {
        method: "POST",
        headers,
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle enhanced rate limiting responses
        if (response.status === 429) {
          const securityResult = result as SecurityError;

          if (securityResult.blocked) {
            setIsBlocked(true);
            setBlockInfo({ escalationLevel: securityResult.escalationLevel });
          }

          const retryAfter = response.headers.get("retry-after");
          const minutes = retryAfter
            ? Math.ceil(parseInt(retryAfter) / 60)
            : 15;

          const escalationMessage = securityResult.escalationLevel
            ? ` (Level ${securityResult.escalationLevel})`
            : "";

          throw new Error(
            `Too many requests${escalationMessage}. Please wait ${minutes} minutes before trying again.`
          );
        }

        // Handle CSRF or other security errors
        if (response.status === 403) {
          // Try to refresh CSRF token for the next attempt
          await fetchCSRFToken();

          throw new Error(
            result.error || "Security validation failed. Please try again."
          );
        }

        throw new Error(result.error || "Failed to send message");
      }

      logger.dev.log("Email sent successfully:", result);

      setIsSubmitted(true);

      reset();

      // Clear previous success timeout and set new one
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      logger.error("Error sending email:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );

      // Clear previous error timeout and set new one (10 seconds for security errors)
      if (submitErrorTimeoutRef.current) {
        clearTimeout(submitErrorTimeoutRef.current);
      }
      submitErrorTimeoutRef.current = setTimeout(
        () => setSubmitError(null),
        10000
      );
    }
  };

  // Note: Contact info and icon rendering moved to ContactInfo component

  return (
    <section
      id="contact"
      className={`py-20 ${
        effectiveTheme === "starwars" ? "bg-transparent" : "bg-muted/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.contact.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.contact.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <ContactInfo />

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <HologramCard variant="bordered" animate={false}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Honeypot field - hidden from users, should remain empty */}
                <input
                  {...register("honeypot")}
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t.contact.form.name} *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                      placeholder={t.contact.form.placeholders.name}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t.contact.form.email} *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                      placeholder={t.contact.form.placeholders.email}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t.contact.form.subject} *
                  </label>
                  <input
                    {...register("subject")}
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder={t.contact.form.placeholders.subject}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t.contact.form.message} *
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-vertical"
                    placeholder={t.contact.form.placeholders.message}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Security Status Indicator */}
                {isSecurityLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Initializing security...
                  </div>
                )}

                {securityError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
                    <AlertTriangle size={16} />
                    {securityError}
                  </div>
                )}

                {csrfToken && !securityError && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                    <Shield size={16} />
                    Form secured
                  </div>
                )}

                <LightsaberButton
                  variant="blue"
                  disabled={
                    isSubmitting || isSecurityLoading || !csrfToken || isBlocked
                  }
                  className="w-full"
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      {t.contact.form.sending}
                    </>
                  ) : isSecurityLoading ? (
                    <>
                      <Shield size={18} />
                      Securing...
                    </>
                  ) : isBlocked ? (
                    <>
                      <AlertTriangle size={18} />
                      Temporarily Blocked
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t.contact.form.send}
                    </>
                  )}
                </LightsaberButton>

                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                  >
                    ✅ {t.contact.success}
                  </motion.div>
                )}

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg text-sm ${
                      isBlocked
                        ? "bg-orange-50 border-orange-200 text-orange-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isBlocked ? (
                        <AlertTriangle size={16} className="mt-0.5" />
                      ) : (
                        <span>❌</span>
                      )}
                      <div>
                        <div>{submitError}</div>
                        {isBlocked && blockInfo?.escalationLevel && (
                          <div className="mt-2 text-xs opacity-75">
                            Security Level: {blockInfo.escalationLevel}/
                            {
                              Object.keys(SECURITY_CONSTANTS.BLOCK_DURATIONS)
                                .length
                            }
                            {blockInfo.escalationLevel >= 3 &&
                              " - Extended restrictions in effect"}
                          </div>
                        )}
                        {isBlocked && (
                          <div className="mt-2 text-xs opacity-75">
                            This is a temporary security measure. Please wait
                            before trying again.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </HologramCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
