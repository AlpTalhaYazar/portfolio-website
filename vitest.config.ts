/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "node_modules",
      "**/node_modules/**",
      ".next",
      "out",
      "build",
      ".worktrees/**",
      "worktrees/**",
      ".pnpm-store/**",
      "e2e/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}", "scripts/**/*.ts"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/vitest.setup.ts",
        "**/*.test.*",
        "**/*.spec.*",
      ],
      thresholds: {
        statements: 60,
        branches: 55,
        functions: 55,
        lines: 60,
        "src/lib/csrf.ts": {
          statements: 80,
          branches: 75,
          functions: 90,
          lines: 80,
        },
        "src/app/api/contact/route.ts": {
          statements: 70,
          branches: 60,
          functions: 80,
          lines: 70,
        },
        "src/lib/redis-rate-limit.ts": {
          statements: 50,
          branches: 45,
          functions: 50,
          lines: 50,
        },
        "src/lib/analytics/consent.ts": {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
