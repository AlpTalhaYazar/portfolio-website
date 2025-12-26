"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Shield, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import LightsaberButton from "@/components/ui/LightsaberButton";
import HologramCard from "@/components/ui/HologramCard";
import { SECURITY_CONSTANTS } from "@/types";
import {
  type ContactFormData,
  type UseCSRFSecurityReturn,
  type UseContactSubmissionReturn,
} from "@/hooks";

interface ContactFormProps {
  security: UseCSRFSecurityReturn;
  submission: UseContactSubmissionReturn;
  onSubmit: (data: ContactFormData) => Promise<void>;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  security,
  submission,
  onSubmit,
  className = "",
}) => {
  const { t } = useTranslation();

  // Form validation schema
  const contactFormSchema = z.object({
    name: z
      .string()
      .min(2, t.contact.validation.nameRequired)
      .max(100, t.contact.validation.nameTooLong),
    email: z
      .string()
      .email(t.contact.validation.emailInvalid)
      .max(255, t.contact.validation.emailTooLong),
    subject: z
      .string()
      .min(5, t.contact.validation.subjectRequired)
      .max(200, t.contact.validation.subjectTooLong),
    message: z
      .string()
      .min(10, t.contact.validation.messageMinLength)
      .max(5000, t.contact.validation.messageTooLong),
    honeypot: z.string().optional(), // Hidden field for bot detection
    csrfToken: z.string().optional(), // Will be populated automatically
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  // Handle form submission with reset
  const handleFormSubmit = async (data: ContactFormData) => {
    await onSubmit(data);
    if (!submission.submitError) {
      reset();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={className}
    >
      <HologramCard variant="bordered" animate={false}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={errors.name ? true : undefined}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder={t.contact.form.placeholders.name}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-1 text-sm text-red-500">
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
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={errors.email ? true : undefined}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder={t.contact.form.placeholders.email}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1 text-sm text-red-500">
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
              aria-describedby={errors.subject ? "subject-error" : undefined}
              aria-invalid={errors.subject ? true : undefined}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              placeholder={t.contact.form.placeholders.subject}
            />
            {errors.subject && (
              <p id="subject-error" role="alert" className="mt-1 text-sm text-red-500">
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
              aria-describedby={errors.message ? "message-error" : undefined}
              aria-invalid={errors.message ? true : undefined}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-vertical"
              placeholder={t.contact.form.placeholders.message}
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-1 text-sm text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Security Status Indicator */}
          {security.isSecurityLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              {t.contact.security.initializing}
            </div>
          )}

          {security.securityError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              <AlertTriangle size={16} />
              {security.securityError}
            </div>
          )}

          {security.csrfToken && !security.securityError && (
            <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
              <Shield size={16} />
              {t.contact.security.secured}
            </div>
          )}

          <LightsaberButton
            variant="blue"
            disabled={
              isSubmitting ||
              security.isSecurityLoading ||
              !security.csrfToken ||
              submission.isBlocked
            }
            className="w-full"
            type="submit"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {t.contact.form.sending}
              </>
            ) : security.isSecurityLoading ? (
              <>
                <Shield size={18} />
                {t.contact.security.securing}
              </>
            ) : submission.isBlocked ? (
              <>
                <AlertTriangle size={18} />
                {t.contact.security.temporarilyBlocked}
              </>
            ) : (
              <>
                <Send size={18} />
                {t.contact.form.send}
              </>
            )}
          </LightsaberButton>

          {submission.isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            >
              ✅ {t.contact.success}
            </motion.div>
          )}

          {submission.submitError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border rounded-lg text-sm ${
                submission.isBlocked
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-start gap-2">
                {submission.isBlocked ? (
                  <AlertTriangle size={16} className="mt-0.5" />
                ) : (
                  <span>❌</span>
                )}
                <div>
                  <div>{submission.submitError}</div>
                  {submission.isBlocked &&
                    submission.blockInfo?.escalationLevel && (
                      <div className="mt-2 text-xs opacity-75">
                        {t.contact.security.securityLevel}: {submission.blockInfo.escalationLevel}/
                        {Object.keys(SECURITY_CONSTANTS.BLOCK_DURATIONS).length}
                        {submission.blockInfo.escalationLevel >= 3 &&
                          ` - ${t.contact.security.extendedRestrictions}`}
                      </div>
                    )}
                  {submission.isBlocked && (
                    <div className="mt-2 text-xs opacity-75">
                      {t.contact.security.temporaryMeasure}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </form>
      </HologramCard>
    </motion.div>
  );
};

export default ContactForm;
