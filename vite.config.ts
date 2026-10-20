import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// One static build: `vite build` -> dist/. No server runtime.
// BASE_PATH is set by the GitHub Actions workflow; the default matches this repository's Pages URL.
export default defineConfig({
  base: process.env["BASE_PATH"] ?? "/portfolio.jkt/",
  resolve: { tsconfigPaths: true },
  plugins: [
    // Generates src/routeTree.gen.ts from src/routes/. Must come before the React plugin.
    tanstackRouter({ target: "react", autoCodeSplitting: false }),
    react(),
    tailwindcss(),
  ],
  build: { outDir: "dist", sourcemap: false },
});
