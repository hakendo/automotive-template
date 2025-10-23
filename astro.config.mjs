// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";  // Para desarrollo local
import sitemapPlugin from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "server", // Habilita SSR para permitir API routes dinámicas
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), react(), sitemapPlugin()],
  adapter: process.env.VERCEL ? vercel() : node({
    mode: "standalone"
  }),
});
