import { ImageResponse } from "next/og";

import { defaultLanguage } from "@/lib/i18n/config";
import { getPortfolioContent } from "@/lib/content/portfolio";
import { siteConfig } from "@/lib/site";
import type { PortfolioLocale } from "@/types/portfolio";

export const socialPreviewSize = {
  width: 1200,
  height: 630,
} as const;

export const socialPreviewContentType = "image/png";

const socialPreviewAlt: Record<PortfolioLocale, string> = {
  en: "Alp Talha Yazar portfolio preview",
  tr: "Alp Talha Yazar portfolyo onizlemesi",
  es: "Vista previa del portafolio de Alp Talha Yazar",
};

export function getSocialPreviewAlt(locale: PortfolioLocale) {
  return socialPreviewAlt[locale];
}

export function getSocialPreviewPath(
  locale: PortfolioLocale,
  kind: "opengraph" | "twitter"
) {
  const prefix = locale === defaultLanguage ? "" : `/${locale}`;
  const slug = kind === "opengraph" ? "opengraph-image" : "twitter-image";

  return `${prefix}/${slug}`;
}

export function getSocialPreviewUrl(
  locale: PortfolioLocale,
  kind: "opengraph" | "twitter"
) {
  return `${siteConfig.baseUrl}${getSocialPreviewPath(locale, kind)}`;
}

export function buildSocialPreviewImage(locale: PortfolioLocale) {
  const content = getPortfolioContent(locale);
  const previewTags = content.hero.techTags.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#080808",
          color: "#f4f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(198,255,109,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(198,255,109,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.3,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 48,
            right: 56,
            height: 180,
            width: 180,
            borderRadius: "999px",
            background:
              "radial-gradient(circle, rgba(198,255,109,0.24) 0%, rgba(198,255,109,0) 70%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px",
            border: "1px solid rgba(198,255,109,0.24)",
            margin: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: 20,
                letterSpacing: "0.28em",
                color: "#c6ff6d",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 1,
                  background: "#c6ff6d",
                }}
              />
              <span>{content.hero.eyebrow}</span>
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 16px",
                border: "1px solid rgba(244,241,234,0.18)",
                fontSize: 18,
                color: "#f4f1ea",
              }}
            >
              {content.hero.availability}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "880px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 28,
                letterSpacing: "0.24em",
                color: "#9b9688",
              }}
            >
              {siteConfig.fullName.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 68,
                lineHeight: 1.03,
                fontWeight: 700,
                letterSpacing: "-0.05em",
              }}
            >
              {content.hero.headline}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.4,
                color: "#c8c3b6",
                maxWidth: "820px",
              }}
            >
              {content.hero.supportingText}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                maxWidth: "820px",
              }}
            >
              {previewTags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    padding: "12px 18px",
                    border: "1px solid rgba(244,241,234,0.16)",
                    background: "rgba(13,13,13,0.72)",
                    fontSize: 18,
                    color: "#f4f1ea",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "10px",
                color: "#9b9688",
                fontSize: 18,
              }}
            >
              <div style={{ display: "flex", color: "#c6ff6d", letterSpacing: "0.18em" }}>
                PRODUCTION PORTFOLIO
              </div>
              <div style={{ display: "flex" }}>
                {siteConfig.baseUrl.replace(/^https?:\/\//, "")}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    socialPreviewSize
  );
}
