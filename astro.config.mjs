// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",  // download HTML saat user hover link
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
