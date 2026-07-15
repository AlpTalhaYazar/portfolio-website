import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  createHealthService,
  type DependencyConfigState,
} from "@/lib/health";
import { logger } from "@/lib/logger";

function resolvePairState(
  first: string | undefined,
  second: string | undefined
): DependencyConfigState {
  if (!first && !second) return "unconfigured";
  return first && second ? "configured" : "invalid";
}

const emailState = resolvePairState(
  process.env.GMAIL_USER,
  process.env.GMAIL_APP_PASSWORD
);
const redisState = resolvePairState(
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.UPSTASH_REDIS_REST_TOKEN
);

const healthService = createHealthService({
  emailState,
  redisState,
  probeEmail: async () => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) throw new Error("Email configuration is incomplete");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: true },
      connectionTimeout: 2_500,
      greetingTimeout: 2_500,
      socketTimeout: 3_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });

    try {
      await transporter.verify();
    } finally {
      transporter.close();
    }
  },
  probeRedis: async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) throw new Error("Redis configuration is incomplete");

    await new Redis({ url, token }).ping();
  },
  timeoutMs: 3_000,
  cacheTtlMs: 30_000,
});

export async function GET(request?: NextRequest) {
  const isLiveness = request?.nextUrl.searchParams.get("probe") === "liveness";

  if (isLiveness) {
    return NextResponse.json(
      {
        status: "healthy",
        probe: "liveness",
        timestamp: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const readiness = await healthService.checkReadiness();
  logger.info("health.readiness", readiness);

  return NextResponse.json(
    {
      ...readiness,
      probe: "readiness",
      timestamp: new Date().toISOString(),
    },
    {
      status: readiness.status === "unhealthy" ? 503 : 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        ...(readiness.status === "unhealthy" ? { "Retry-After": "30" } : {}),
      },
    }
  );
}
