import { describe, expect, it } from "vitest";

import { buildPortfolioMetadata } from "./portfolio-metadata";

describe("portfolio metadata", () => {
  it("builds turkish canonical metadata for the root route", () => {
    const metadata = buildPortfolioMetadata("tr");

    expect(metadata.alternates?.canonical).toBe("https://www.alptalha.dev/");
    expect(metadata.alternates?.languages).toEqual({
      en: "https://www.alptalha.dev/en/",
      tr: "https://www.alptalha.dev/",
      "x-default": "https://www.alptalha.dev/",
    });
    expect(metadata.openGraph?.locale).toBe("tr_TR");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://www.alptalha.dev/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alp Talha Yazar portfolyo onizlemesi",
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [
        {
          url: "https://www.alptalha.dev/twitter-image",
          alt: "Alp Talha Yazar portfolyo onizlemesi",
        },
      ],
    });
  });

  it("builds localized canonical metadata for prefixed routes", () => {
    const metadata = buildPortfolioMetadata("en");

    expect(metadata.alternates?.canonical).toBe("https://www.alptalha.dev/en/");
    expect(metadata.openGraph?.locale).toBe("en_US");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://www.alptalha.dev/en/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alp Talha Yazar portfolio preview",
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [
        {
          url: "https://www.alptalha.dev/en/twitter-image",
          alt: "Alp Talha Yazar portfolio preview",
        },
      ],
    });
  });
});
