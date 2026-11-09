/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin } from "vite";

function siteMetadata(siteUrl: string | undefined): Plugin {
  return {
    name: "blocknroll-site-metadata",
    transformIndexHtml(html) {
      if (!siteUrl) return;
      const origin = new URL(siteUrl);
      if (origin.protocol !== "https:" && origin.protocol !== "http:") {
        throw new Error("VITE_SITE_URL must be an HTTP or HTTPS URL.");
      }
      const pageUrl = origin.origin + "/";
      return {
        html: html.replaceAll('content="/club-social.jpg"', 'content="' + pageUrl + 'club-social.jpg"'),
        tags: [
          { tag: "link", attrs: { rel: "canonical", href: pageUrl } },
          { tag: "meta", attrs: { property: "og:url", content: pageUrl } },
        ],
      };
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), siteMetadata(loadEnv(mode, ".", "VITE_").VITE_SITE_URL)],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@layouts": "/src/layouts",
      "@hooks": "/src/hooks",
      "@types": "/src/types",
      "@utils": "/src/utils",
      "@constants": "/src/constants",
      "@assets": "/src/assets",
      "@i18n": "/src/i18n",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/vitest-setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
        // Exclude files that don't need test coverage
        "src/main.tsx", // App entry point
        "src/App.tsx", // Simple app wrapper
        "src/i18n/**", // Internationalization config
        "src/types/**", // Type definitions
        "src/assets/**", // Static assets
        "src/components/index.ts", // Re-export file
        "src/components/ui/index.ts", // Re-export file
        "src/vite-env.d.ts", // Vite type definitions
      ],
      // Set coverage thresholds
      thresholds: {
        global: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
      },
    },
    // Ensure JSDOM environment is properly configured
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
  },
}));
