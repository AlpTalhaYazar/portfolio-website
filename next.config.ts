import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    // Remove unoptimized for Vercel deployment (Vercel can optimize images)
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Security headers now handled by middleware.ts
};

export default withBundleAnalyzer(nextConfig);
