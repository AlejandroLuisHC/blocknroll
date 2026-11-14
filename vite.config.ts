/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin } from "vite";

function localPages(): Plugin {
  return {
    name: "blocknroll-local-pages",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.originalUrl?.split("?")[0];
        if (path !== "/es" && path !== "/es/") return next();
        res.statusCode = 308;
        res.setHeader("Location", "/");
        res.end();
      });
      // The standalone Vite server has no Vercel Functions runtime.
      server.middlewares.use("/api/club-season", (_req, res) => {
        res.statusCode = 204;
        res.end();
      });
    },
    async transformIndexHtml(html, context) {
      if (!context.server) return;
      const path = context.originalUrl?.split("?")[0].replace(/\/$/, "") || "/";
      const language = path === "/ca" ? "ca" : path === "/en" ? "en" : "es";
      const { renderPage } = await context.server.ssrLoadModule("/src/entry-server.tsx");
      const page = await renderPage(language, !["/", "/ca", "/en"].includes(path));
      return html.replace('<html lang="es">', '<html lang="' + language + '">')
        .replace("<!--seo-head-->", page.head)
        .replace('<div id="root"></div>', '<div id="root">' + page.body + '</div>');
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), localPages()],
  // Resolve React Router's ESM exports consistently in development and prerendering.
  ssr: {
    noExternal: ["react-router-dom", "react-router"],
    resolve: { conditions: ["module", "module-sync", "node", "development|production"] },
  },
  define: {
    "import.meta.env.VITE_NOINDEX": JSON.stringify(
      loadEnv(mode, ".", "VERCEL_").VERCEL_ENV === "preview" || loadEnv(mode, ".", "VITE_").VITE_NOINDEX === "true" ? "true" : "false"
    ),
  },
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
