export type DependencyConfigState =
  | "configured"
  | "unconfigured"
  | "invalid";
export type DependencyHealth = "ok" | "disabled" | "error";
export type ReadinessStatus = "healthy" | "degraded" | "unhealthy";

export interface ReadinessResult {
  readonly status: ReadinessStatus;
  readonly checks: {
    readonly email: DependencyHealth;
    readonly redis: DependencyHealth;
  };
}

interface HealthServiceOptions {
  readonly emailState: DependencyConfigState;
  readonly redisState: DependencyConfigState;
  readonly probeEmail: () => Promise<unknown>;
  readonly probeRedis: () => Promise<unknown>;
  readonly timeoutMs?: number;
  readonly cacheTtlMs?: number;
  readonly now?: () => number;
}

export interface HealthService {
  readonly checkReadiness: () => Promise<ReadinessResult>;
}

async function runProbe(
  probe: () => Promise<unknown>,
  timeoutMs: number
): Promise<DependencyHealth> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      probe(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Dependency probe timed out")),
          timeoutMs
        );
      }),
    ]);
    return "ok";
  } catch {
    return "error";
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export function createHealthService({
  emailState,
  redisState,
  probeEmail,
  probeRedis,
  timeoutMs = 3_000,
  cacheTtlMs = 30_000,
  now = Date.now,
}: HealthServiceOptions): HealthService {
  let cached:
    | { readonly result: ReadinessResult; readonly expiresAt: number }
    | undefined;

  async function checkReadiness(): Promise<ReadinessResult> {
    const currentTime = now();
    if (cached && currentTime < cached.expiresAt) {
      return cached.result;
    }

    const [email, redis] = await Promise.all([
      emailState === "configured"
        ? runProbe(probeEmail, timeoutMs)
        : Promise.resolve<DependencyHealth>("error"),
      redisState === "configured"
        ? runProbe(probeRedis, timeoutMs)
        : Promise.resolve<DependencyHealth>(
            redisState === "unconfigured" ? "disabled" : "error"
          ),
    ]);

    const status: ReadinessStatus =
      email === "error" || redis === "error"
        ? "unhealthy"
        : redis === "disabled"
        ? "degraded"
        : "healthy";
    const result: ReadinessResult = {
      status,
      checks: { email, redis },
    };

    cached = { result, expiresAt: currentTime + cacheTtlMs };
    return result;
  }

  return { checkReadiness };
}
