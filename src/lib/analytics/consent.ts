export const ANALYTICS_CONSENT_POLICY_VERSION = 1;
export const ANALYTICS_CONSENT_STORAGE_KEY = "aty-analytics-consent";

export type AnalyticsConsentDecision = "accepted" | "rejected";

export interface AnalyticsConsentPreference {
  readonly version: number;
  readonly decision: AnalyticsConsentDecision;
  readonly updatedAt: string;
}

export function readAnalyticsConsent(
  storage: Pick<Storage, "getItem"> = window.localStorage
): AnalyticsConsentPreference | null {
  try {
    const value = storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (!value) return null;

    const parsed = JSON.parse(value) as Partial<AnalyticsConsentPreference>;
    if (
      parsed.version !== ANALYTICS_CONSENT_POLICY_VERSION ||
      (parsed.decision !== "accepted" && parsed.decision !== "rejected") ||
      typeof parsed.updatedAt !== "string" ||
      Number.isNaN(Date.parse(parsed.updatedAt))
    ) {
      return null;
    }

    return parsed as AnalyticsConsentPreference;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(
  decision: AnalyticsConsentDecision,
  storage: Pick<Storage, "setItem"> = window.localStorage,
  now = new Date()
): AnalyticsConsentPreference {
  const preference: AnalyticsConsentPreference = {
    version: ANALYTICS_CONSENT_POLICY_VERSION,
    decision,
    updatedAt: now.toISOString(),
  };

  try {
    storage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // A hardened browser may block storage. The in-memory decision still applies.
  }

  return preference;
}
