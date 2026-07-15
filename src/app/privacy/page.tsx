import type { Metadata } from "next";

import { PrivacyPage } from "@/components/portfolio";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik | Alp Talha Yazar",
  description: "Portfolyo sitesinin analitik, iletişim formu ve yerel tercih veri işleme açıklaması.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/privacy/`,
    languages: {
      tr: `${siteConfig.baseUrl}/privacy/`,
      en: `${siteConfig.baseUrl}/en/privacy/`,
      "x-default": `${siteConfig.baseUrl}/privacy/`,
    },
  },
};

export default function TurkishPrivacyPage() {
  return <PrivacyPage locale="tr" />;
}
