"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone, Send, Shield, AlertTriangle } from "lucide-react";
import { socialLinks } from "@/lib/data";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "@/lib/i18n";
import LightsaberButton from "@/components/ui/LightsaberButton";
import HologramCard from "@/components/ui/HologramCard";
import { useTheme } from "@/components/theme/ThemeProvider";

// Security and API response interfaces
interface CSRFTokenResponse {
  success: boolean;
  token: string;
  sessionId: string;
  expires: number;
  expiresIn: number;
}

interface SecurityError {
  error: string;
  blocked?: boolean;
  escalationLevel?: number;
}

const Contact = () => {
  // Form state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Security state
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tokenExpires, setTokenExpires] = useState<number | null>(null);
  const [isSecurityLoading, setIsSecurityLoading] = useState(true);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState<{
    escalationLevel?: number;
  } | null>(null);

  // Refs for cleanup
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

  // CSRF Token Management
  const fetchCSRFToken = useCallback(async (): Promise<boolean> => {
    try {
      setIsSecurityLoading(true);
      setSecurityError(null);

      const headers: Record<string, string> = {};
      if (sessionId) {
        headers["x-session-id"] = sessionId;
      }

      const response = await fetch("/api/csrf-token", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get security token");
      }

      const data: CSRFTokenResponse = await response.json();

      setCsrfToken(data.token);
      setSessionId(data.sessionId);
      setTokenExpires(data.expires);
      setIsSecurityLoading(false);

      return true;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      setSecurityError(
        error instanceof Error
          ? error.message
          : "Security initialization failed"
      );
      setIsSecurityLoading(false);
      return false;
    }
  }, [sessionId]);

  // Check if token needs refresh
  const isTokenExpired = useCallback(() => {
    if (!tokenExpires) return true;
    return Date.now() >= tokenExpires - 5 * 60 * 1000; // Refresh 5 minutes before expiry
  }, [tokenExpires]);

  // Initialize security on component mount
  useEffect(() => {
    fetchCSRFToken();
  }, [fetchCSRFToken]);

  // Auto-refresh token when needed
  useEffect(() => {
    if (!isSecurityLoading && isTokenExpired()) {
      fetchCSRFToken();
    }
  }, [isSecurityLoading, isTokenExpired, fetchCSRFToken]);

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
      setSecurityError(null);
      setIsBlocked(false);

      // Ensure we have a valid CSRF token
      if (!csrfToken || !sessionId || isTokenExpired()) {
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

      console.log("Email sent successfully:", result);
      setIsSubmitted(true);
      reset();

      // Clear previous success timeout and set new one
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error sending email:", error);
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        );
      case "Linkedin":
        return (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case "Mail":
        return <Mail size={20} />;
      default:
        return null;
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      title: t.contact.contactInfo.email,
      content: "alptalhayazar@gmail.com",
      href: "mailto:alptalhayazar@gmail.com",
    },
    {
      icon: <MapPin size={20} />,
      title: t.contact.contactInfo.location,
      content: "Turkey",
      href: null,
    },
    {
      icon: <Phone size={20} />,
      title: t.contact.contactInfo.phone,
      content: "+90 555 067 35 96",
      href: "tel:+905550673596",
    },
  ];

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {t.contact.conversationTitle}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {t.contact.conversationDescription}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {info.title}
                      </h4>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-muted-foreground hover:text-primary transition-colors duration-200"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">
                  {t.contact.connectTitle}
                </h4>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      aria-label={link.name}
                    >
                      {getIcon(link.icon)}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

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
                            Security Level: {blockInfo.escalationLevel}/4
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
