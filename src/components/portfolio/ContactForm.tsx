"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle, Shield, Send } from "lucide-react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type ContactFormData, SECURITY_CONSTANTS } from "@/types";
import { useCSRFSecurity, useContactSubmission } from "@/hooks";
import type { PortfolioContactContent } from "@/types/portfolio";

interface ContactFormProps {
  content: PortfolioContactContent["form"];
}

export function ContactForm({ content }: ContactFormProps) {
  const security = useCSRFSecurity();
  const submission = useContactSubmission(security);

  const schema = z.object({
    name: z.string().min(2, content.validation.nameRequired),
    email: z.string().email(content.validation.emailInvalid),
    subject: z.string().min(3, content.validation.subjectRequired),
    message: z.string().min(10, content.validation.messageMinLength),
    honeypot: z.string().optional(),
    csrfToken: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await submission.onSubmit(data);
    if (!submission.submitError) {
      reset();
    }
  });

  const isDisabled =
    isSubmitting ||
    security.isSecurityLoading ||
    !security.csrfToken ||
    submission.isBlocked;

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-6">
      <input
        {...register("honeypot")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label={content.nameLabel}
          error={errors.name?.message}
        >
          <input
            {...register("name")}
            placeholder={content.placeholders.name}
            aria-invalid={errors.name ? true : undefined}
            className="input-shell"
          />
        </Field>

        <Field
          label={content.emailLabel}
          error={errors.email?.message}
        >
          <input
            {...register("email")}
            type="email"
            placeholder={content.placeholders.email}
            aria-invalid={errors.email ? true : undefined}
            className="input-shell"
          />
        </Field>
      </div>

      <Field
        label={content.subjectLabel}
        error={errors.subject?.message}
      >
        <input
          {...register("subject")}
          placeholder={content.placeholders.subject}
          aria-invalid={errors.subject ? true : undefined}
          className="input-shell"
        />
      </Field>

      <Field
        label={content.messageLabel}
        error={errors.message?.message}
      >
        <textarea
          {...register("message")}
          rows={6}
          placeholder={content.placeholders.message}
          aria-invalid={errors.message ? true : undefined}
          className="input-shell min-h-40 resize-y"
        />
      </Field>

      <div className="space-y-3">
        {security.isSecurityLoading ? (
          <StatusLine icon={<Shield size={15} />} text={content.securityLoading} />
        ) : null}
        {!security.isSecurityLoading && security.csrfToken && !security.securityError ? (
          <StatusLine icon={<Shield size={15} />} text={content.secured} success />
        ) : null}
        {security.securityError ? (
          <Banner
            icon={<AlertTriangle size={16} />}
            text={security.securityError}
            tone="error"
          />
        ) : null}
        {submission.submitError ? (
          <Banner
            icon={<AlertTriangle size={16} />}
            text={submission.submitError}
            tone={submission.isBlocked ? "warning" : "error"}
            meta={
              submission.isBlocked && submission.blockInfo?.escalationLevel
                ? `Level ${submission.blockInfo.escalationLevel}/${Object.keys(
                    SECURITY_CONSTANTS.BLOCK_DURATIONS
                  ).length}`
                : undefined
            }
          />
        ) : null}
        {submission.isSubmitted ? (
          <Banner
            icon={<CheckCircle size={16} />}
            text={content.success}
            tone="success"
          />
        ) : null}
      </div>

      <button type="submit" disabled={isDisabled} className="primary-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? (
          <span>{content.submittingLabel}</span>
        ) : submission.isBlocked ? (
          <>
            <AlertTriangle size={16} />
            <span>{content.blocked}</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>{content.submitLabel}</span>
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="mono-label text-muted-foreground">{label}</span>
      {children}
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </label>
  );
}

function StatusLine({
  icon,
  text,
  success = false,
}: {
  icon: ReactNode;
  text: string;
  success?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-sm ${
        success ? "text-accent" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Banner({
  icon,
  text,
  tone,
  meta,
}: {
  icon: ReactNode;
  text: string;
  tone: "success" | "warning" | "error";
  meta?: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-accent/30 bg-accent/10 text-foreground"
      : tone === "warning"
      ? "border-orange-400/25 bg-orange-400/10 text-foreground"
      : "border-error/30 bg-error/10 text-foreground";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="space-y-1">
          <p className="text-sm leading-6">{text}</p>
          {meta ? <p className="mono-label text-faint">{meta}</p> : null}
        </div>
      </div>
    </div>
  );
}
