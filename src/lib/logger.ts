import type { SecurityEvent } from "@/types";

type LogLevel = "debug" | "info" | "warn" | "error" | "security";

const SENSITIVE_KEY_PATTERN =
  /(token|password|passphrase|secret|credential|authorization|auth|cookie|session|csrf|email|mailaddress|ipaddress|clientip|useragent|message|body|content)/i;
const EMAIL_PATTERN = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;
const IP_PATTERN = /^(?:\d{1,3}\.){3}\d{1,3}$|^[a-f0-9:]{3,}$/i;
const MAX_DEPTH = 6;

function redactValue(
  value: unknown,
  key: string | undefined,
  depth: number,
  seen: WeakSet<object>
): unknown {
  if (key && SENSITIVE_KEY_PATTERN.test(key)) {
    return "[REDACTED]";
  }

  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "string") {
    if (EMAIL_PATTERN.test(value) || IP_PATTERN.test(value)) {
      return "[REDACTED]";
    }
    return value.length > 1_000 ? `${value.slice(0, 1_000)}…[TRUNCATED]` : value;
  }

  if (typeof value === "undefined") {
    return undefined;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "function" || typeof value === "symbol") {
    return `[${typeof value}]`;
  }

  if (value instanceof Error) {
    return { name: value.name || "Error" };
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (depth >= MAX_DEPTH) {
    return "[MAX_DEPTH]";
  }

  if (typeof value === "object") {
    if (seen.has(value)) {
      return "[CIRCULAR]";
    }
    seen.add(value);

    if (Array.isArray(value)) {
      return value.map((item) => redactValue(item, undefined, depth + 1, seen));
    }

    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        redactValue(childValue, childKey, depth + 1, seen),
      ])
    );
  }

  return String(value);
}

export function redactLogValue(value: unknown): unknown {
  return redactValue(value, undefined, 0, new WeakSet());
}

function writeLog(level: LogLevel, event: string, data: unknown[]): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(data.length === 0
      ? {}
      : { data: redactLogValue(data.length === 1 ? data[0] : data) }),
  };
  const output = JSON.stringify(entry);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn" || level === "security") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  dev: {
    log: (event: string, ...data: unknown[]) => {
      if (isDevelopment) writeLog("debug", event, data);
    },
    warn: (event: string, ...data: unknown[]) => {
      if (isDevelopment) writeLog("warn", event, data);
    },
    error: (event: string, ...data: unknown[]) => {
      if (isDevelopment) writeLog("error", event, data);
    },
  },
  info: (event: string, ...data: unknown[]) => writeLog("info", event, data),
  warn: (event: string, ...data: unknown[]) => writeLog("warn", event, data),
  error: (event: string, ...data: unknown[]) => writeLog("error", event, data),
  security: (
    event: string,
    data?: Record<string, unknown> | SecurityEvent
  ) => writeLog("security", event, data === undefined ? [] : [data]),
};

export default logger;
