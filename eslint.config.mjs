import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Disable apostrophe escaping rule - it's overly strict for modern React
      "react/no-unescaped-entities": "off",
      // Allow unused vars that start with underscore
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      // Allow any in utility functions where type flexibility is needed
      "@typescript-eslint/no-explicit-any": ["error", { 
        "ignoreRestArgs": true 
      }],
    },
  },
];

export default eslintConfig;
