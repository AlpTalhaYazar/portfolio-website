import type { PortfolioLocale } from "@/types/portfolio";

export const analyticsConsentCopy = {
  en: {
    title: "Analytics preferences",
    description:
      "Optional, privacy-minimized analytics helps improve this portfolio. No analytics request is sent unless you accept.",
    accept: "Accept analytics",
    reject: "Reject analytics",
    close: "Close preferences",
    privacy: "Read privacy information",
    settings: "Privacy choices",
  },
  tr: {
    title: "Analitik tercihleri",
    description:
      "İsteğe bağlı ve veri minimizasyonlu analitik, bu portfolyoyu geliştirmeye yardımcı olur. Kabul etmediğiniz sürece analitik isteği gönderilmez.",
    accept: "Analitiği kabul et",
    reject: "Analitiği reddet",
    close: "Tercihleri kapat",
    privacy: "Gizlilik bilgisini oku",
    settings: "Gizlilik tercihleri",
  },
} as const satisfies Record<PortfolioLocale, Record<string, string>>;
