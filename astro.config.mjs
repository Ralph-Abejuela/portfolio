// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://ralph-abejuela.pages.dev",
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.pi/**', '**/.pi-glla/**'],
      },
    },
  },

  integrations: [icon(), sitemap()],
});
