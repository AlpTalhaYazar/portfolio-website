import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { SECURITY_CONSTANTS } from "@/types";

const TOKEN_VERSION = "v1";
const MINIMUM_SECRET_LENGTH = 32;
const DEVELOPMENT_SECRET =
  "portfolio-development-csrf-secret-not-for-production";

interface CsrfPayload {
  readonly sessionId: string;
  readonly nonce: string;
  readonly issuedAt: number;
  readonly expires: number;
}

export interface CsrfCredential extends CsrfPayload {
  readonly token: string;
  readonly expiresIn: number;
}

export type CsrfVerificationReason =
  | "missing_token"
  | "missing_cookie"
  | "cookie_mismatch"
  | "malformed_token"
  | "unsupported_version"
  | "invalid_signature"
  | "invalid_payload"
  | "token_expired"
  | "token_not_yet_valid"
  | "session_mismatch";

export type CsrfVerificationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: CsrfVerificationReason };

function assertStrongSecret(secret: string): void {
  if (secret.length < MINIMUM_SECRET_LENGTH) {
    throw new Error("CSRF signing secret must be at least 32 characters long");
  }
}

function sign(unsignedToken: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function isCsrfPayload(value: unknown): value is CsrfPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<CsrfPayload>;

  return (
    typeof payload.sessionId === "string" &&
    payload.sessionId.length >= 16 &&
    typeof payload.nonce === "string" &&
    payload.nonce.length >= 16 &&
    typeof payload.issuedAt === "number" &&
    Number.isSafeInteger(payload.issuedAt) &&
    typeof payload.expires === "number" &&
    Number.isSafeInteger(payload.expires) &&
    payload.expires > payload.issuedAt
  );
}

export function issueCsrfCredential({
  secret,
  now = Date.now(),
  ttlMs = SECURITY_CONSTANTS.CSRF_TOKEN_EXPIRY,
}: {
  readonly secret: string;
  readonly now?: number;
  readonly ttlMs?: number;
}): CsrfCredential {
  assertStrongSecret(secret);

  if (!Number.isSafeInteger(now) || !Number.isSafeInteger(ttlMs) || ttlMs <= 0) {
    throw new Error("CSRF token timing values must be positive safe integers");
  }

  const payload: CsrfPayload = {
    sessionId: randomBytes(18).toString("base64url"),
    nonce: randomBytes(24).toString("base64url"),
    issuedAt: now,
    expires: now + ttlMs,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const unsignedToken = `${TOKEN_VERSION}.${encodedPayload}`;
  const token = `${unsignedToken}.${sign(unsignedToken, secret)}`;

  return {
    ...payload,
    token,
    expiresIn: Math.floor(ttlMs / 1_000),
  };
}

export function verifyCsrfCredential({
  secret,
  token,
  cookieToken,
  sessionId,
  now = Date.now(),
}: {
  readonly secret: string;
  readonly token: string | null | undefined;
  readonly cookieToken: string | null | undefined;
  readonly sessionId: string | null | undefined;
  readonly now?: number;
}): CsrfVerificationResult {
  assertStrongSecret(secret);

  if (!token) {
    return { valid: false, reason: "missing_token" };
  }

  if (!cookieToken) {
    return { valid: false, reason: "missing_cookie" };
  }

  if (!safeEqual(token, cookieToken)) {
    return { valid: false, reason: "cookie_mismatch" };
  }

  const segments = token.split(".");
  if (segments.length !== 3) {
    return { valid: false, reason: "malformed_token" };
  }

  const [version, encodedPayload, providedSignature] = segments;
  if (version !== TOKEN_VERSION) {
    return { valid: false, reason: "unsupported_version" };
  }

  const unsignedToken = `${version}.${encodedPayload}`;
  if (!safeEqual(providedSignature, sign(unsignedToken, secret))) {
    return { valid: false, reason: "invalid_signature" };
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );
  } catch {
    return { valid: false, reason: "invalid_payload" };
  }

  if (!isCsrfPayload(parsedPayload)) {
    return { valid: false, reason: "invalid_payload" };
  }

  if (now < parsedPayload.issuedAt) {
    return { valid: false, reason: "token_not_yet_valid" };
  }

  if (now >= parsedPayload.expires) {
    return { valid: false, reason: "token_expired" };
  }

  if (!sessionId || !safeEqual(sessionId, parsedPayload.sessionId)) {
    return { valid: false, reason: "session_mismatch" };
  }

  return { valid: true };
}

export function getCsrfSecret(
  env: Readonly<Record<string, string | undefined>> = process.env
): string {
  const configuredSecret = env.CSRF_SECRET;

  if (configuredSecret) {
    assertStrongSecret(configuredSecret);
    return configuredSecret;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("CSRF_SECRET is required in production");
  }

  return DEVELOPMENT_SECRET;
}

export function getCsrfCookieName(isSecureContext: boolean): string {
  return isSecureContext ? "__Host-portfolio-csrf" : "portfolio-csrf";
}
