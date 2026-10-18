import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        id: "/",
        name: "Rhyme Hero",
        short_name: "RhymeHero",
        description: "Train your rhyming super-skills. You write the lines - we coach.",
        lang: "en",
        categories: ["education", "music"],
        theme_color: "#e3262e",
        background_color: "#ffd400",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          // Separate artwork with the logo inside the safe zone, so Android's icon mask doesn't crop it.
          { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        screenshots: [
          {
            src: "screenshots/narrow.png",
            sizes: "750x1332",
            type: "image/png",
            form_factor: "narrow",
            label: "Word bank for a target word",
          },
          {
            src: "screenshots/wide.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide",
            label: "Word bank for a target word",
          },
        ],
      },
      workbox: {
        // Never cache engine responses - the UI must always ask the live API.
        // Real pages and Android's asset links file must not be answered with the app shell.
        navigateFallbackDenylist: [/^\/api/, /^\/privacy/, /^\/\.well-known\//],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy.html"),
      },
    },
  },
  server: { port: 5173 },
});
