import { fileURLToPath, URL } from "node:url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { inspectAttr } from "kimi-plugin-inspect-react"

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [inspectAttr(), react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        // GSAP + ScrollTrigger is the bulk of the JS and never changes between
        // content edits — splitting it out keeps it cached across deploys.
        // Vite 8 runs Rolldown, so this is codeSplitting rather than the
        // Rollup-era manualChunks map.
        codeSplitting: {
          groups: [{ name: "gsap", test: /[\\/]node_modules[\\/]gsap[\\/]/ }],
        },
      },
    },
  },
})
