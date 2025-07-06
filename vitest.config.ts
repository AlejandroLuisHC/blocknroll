/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "src/test/vitest-setup.ts")],
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
        // Exclude simple UI components with no business logic
        "src/components/ui/GalleryImage.tsx", // Simple image component
        "src/components/ui/StatCard.tsx", // Simple display component
        "src/components/ui/FeatureCard.tsx", // Simple display component
        "src/components/ui/IconButton.tsx", // Simple button wrapper
        "src/components/ui/PricingCard.tsx", // Simple display component
        "src/components/ui/SocialLink.tsx", // Simple link component
        "src/components/services/**", // Service components (no business logic)
        "src/components/Gallery.tsx", // Simple image gallery with no business logic
      ],
      // Set coverage thresholds for remaining files
      thresholds: {
        global: {
          statements: 90,
          branches: 85,
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
});
