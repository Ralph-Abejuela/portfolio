// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://ralphabejuela.com",
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/.pi/**", "**/.pi-glla/**"],
      },
    },
  },

  integrations: [icon(), sitemap(), react()],
});
