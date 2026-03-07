import { describe, expect, it } from "vitest";

import { buildPortfolioMetadata } from "./portfolio-metadata";

describe("portfolio metadata", () => {
  it("builds english canonical metadata for the root route", () => {
    const metadata = buildPortfolioMetadata("en");

    expect(metadata.alternates?.canonical).toBe("https://www.alptalha.dev/");
    expect(metadata.alternates?.languages).toEqual({
      en: "https://www.alptalha.dev/",
      tr: "https://www.alptalha.dev/tr/",
      "x-default": "https://www.alptalha.dev/",
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://www.alptalha.dev/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alp Talha Yazar portfolio preview",
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [
        {
          url: "https://www.alptalha.dev/twitter-image",
          alt: "Alp Talha Yazar portfolio preview",
        },
      ],
    });
  });

  it("builds localized canonical metadata for prefixed routes", () => {
    const metadata = buildPortfolioMetadata("tr");

    expect(metadata.alternates?.canonical).toBe("https://www.alptalha.dev/tr/");
    expect(metadata.openGraph?.locale).toBe("tr_TR");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://www.alptalha.dev/tr/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alp Talha Yazar portfolyo onizlemesi",
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [
        {
          url: "https://www.alptalha.dev/tr/twitter-image",
          alt: "Alp Talha Yazar portfolyo onizlemesi",
        },
      ],
    });
  });
});
