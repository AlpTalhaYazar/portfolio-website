import { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteConfig.baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.baseUrl}/en/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
