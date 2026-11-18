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
      // Run the same server parser locally. A local file is an explicit dev-only preview override.
      server.middlewares.use("/api/clubs-league", async (req, res) => {
        try {
          if (process.env.CLUBS_LEAGUE_FILE) {
            const { readFile } = await import("node:fs/promises");
            const { parseLeagueWorkbook } = await server.ssrLoadModule("/lib/league-workbook.js");
            const { fixtures, standings } = await parseLeagueWorkbook(await readFile(process.env.CLUBS_LEAGUE_FILE));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ fixtures, standings, season: { startsOn: null, endsOn: null } }));
          } else {
            const env = loadEnv(server.config.mode, server.config.root, ["GLOBAL_CONFIG", "EDGE_CONFIG"]);
            for (const [key, value] of Object.entries(env)) process.env[key] ??= value;
            const { default: handler } = await server.ssrLoadModule("/api/clubs-league.js");
            const response = {
              setHeader: (name: string, value: string) => res.setHeader(name, value),
              status: (code: number) => { res.statusCode = code; return response; },
              json: (body: unknown) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(body)); },
              end: () => res.end(),
            };
            await handler({ method: req.method }, response);
          }
        } catch {
          res.statusCode = 503;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "League information unavailable" }));
        }
      });
    },
    async transformIndexHtml(html, context) {
      if (!context.server) return;
      const path = context.originalUrl?.split("?")[0].replace(/\/$/, "") || "/";
      const { renderPage, languageFromPath, pageFromPath } = await context.server.ssrLoadModule("/src/entry-server.tsx");
      const language = languageFromPath(path) ?? "es";
      const kind = pageFromPath(path);
      const page = await renderPage(language, !kind, kind ?? "home");
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
