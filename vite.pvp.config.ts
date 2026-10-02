import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Standalone guest trial: never reads account credentials or publishes learning media.
export default defineConfig({
  plugins: [react(), tailwindcss()], envDir: false, envPrefix: [], publicDir: false,
  build: { outDir: "output/pvp-trial/dist", emptyOutDir: true, sourcemap: false,
    rolldownOptions: { input: resolve(import.meta.dirname, "index-pvp.html") } },
});
