"use client";

import Link from "next/link";

import { useAnalyticsConsent } from "@/components/analytics";
import { buildLocalizedHref } from "@/lib/i18n/routing";
import { siteConfig } from "@/lib/site";

const privacyContent = {
  en: {
    eyebrow: "Privacy",
    title: "How this portfolio handles data",
    intro:
      "This page describes the current application behavior. It is factual product information, not a legal-compliance claim.",
    analyticsTitle: "Optional analytics",
    analyticsBody:
      "Google Analytics is disabled by default. Its script and collection requests are not loaded until you explicitly accept. If enabled, it may process page URLs, interactions, browser/device information, and approximate location to understand portfolio usage. Advertising storage, ad personalization, Google Signals, and user-provided data are not enabled by this site.",
    contactTitle: "Contact form",
    contactBody:
      "When you submit the contact form, the name, email address, subject, and message you provide are validated and sent to the portfolio owner's mailbox through the configured email provider. The application does not write submissions to its own database. Security controls process short-lived request credentials and privacy-minimized rate-limit identifiers. Mailbox retention is controlled outside this repository and should be confirmed with the owner.",
    storageTitle: "Local preferences",
    storageBody:
      "Theme and analytics choices are stored in your browser. The analytics preference contains only the policy version, accepted/rejected choice, and update time. You can change it at any time.",
    controls: "Open analytics preferences",
    contact: "Questions about this page",
    home: "Back to portfolio",
  },
  tr: {
    eyebrow: "Gizlilik",
    title: "Bu portfolyo verileri nasıl işler",
    intro:
      "Bu sayfa uygulamanın mevcut davranışını açıklar. Hukuki uygunluk beyanı değil, doğrulanabilir ürün bilgisidir.",
    analyticsTitle: "İsteğe bağlı analitik",
    analyticsBody:
      "Google Analytics varsayılan olarak kapalıdır. Açıkça kabul etmeden script ve veri toplama istekleri yüklenmez. Etkinleştirildiğinde portfolyo kullanımını anlamak amacıyla sayfa adresleri, etkileşimler, tarayıcı/cihaz bilgileri ve yaklaşık konum işlenebilir. Bu site reklam depolaması, reklam kişiselleştirme, Google Signals veya kullanıcı tarafından sağlanan verileri etkinleştirmez.",
    contactTitle: "İletişim formu",
    contactBody:
      "İletişim formunu gönderdiğinizde sağladığınız ad, e-posta adresi, konu ve mesaj doğrulanarak yapılandırılmış e-posta sağlayıcısı üzerinden portfolyo sahibinin posta kutusuna iletilir. Uygulama gönderimleri kendi veritabanına yazmaz. Güvenlik kontrolleri kısa ömürlü istek kimliklerini ve veri minimizasyonlu hız sınırı tanımlayıcılarını işler. Posta kutusu saklama süresi bu depo dışında yönetilir ve sahibiyle teyit edilmelidir.",
    storageTitle: "Yerel tercihler",
    storageBody:
      "Tema ve analitik tercihleriniz tarayıcınızda saklanır. Analitik tercihi yalnızca politika sürümü, kabul/ret seçimi ve güncelleme zamanını içerir. Tercihinizi istediğiniz zaman değiştirebilirsiniz.",
    controls: "Analitik tercihlerini aç",
    contact: "Bu sayfa hakkında sorular",
    home: "Portfolyoya dön",
  },
} as const;

export function PrivacyPage({ locale }: { locale: "tr" | "en" }) {
  const content = privacyContent[locale];
  const { isAvailable: isAnalyticsAvailable, openPreferences } =
    useAnalyticsConsent();

  return (
    <main id="main-content" className="section-shell min-h-screen">
      <article className="mx-auto max-w-3xl">
        <p className="mono-label text-accent">{content.eyebrow}</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
          {content.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {content.intro}
        </p>

        <div className="mt-12 space-y-8">
          {[
            [content.analyticsTitle, content.analyticsBody],
            [content.contactTitle, content.contactBody],
            [content.storageTitle, content.storageBody],
          ].map(([title, body]) => (
            <section key={title} className="surface-card">
              <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {isAnalyticsAvailable ? (
            <button type="button" className="primary-button" onClick={openPreferences}>
              {content.controls}
            </button>
          ) : null}
          <Link href={buildLocalizedHref(locale, "/")} className="secondary-button">
            {content.home}
          </Link>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          {content.contact}: {" "}
          <a className="underline underline-offset-4" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </p>
      </article>
    </main>
  );
}
