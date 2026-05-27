// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  prefetch: {
    prefetchAll: false, // Hanya prefetch link dengan data-astro-prefetch
    defaultStrategy: "hover", // download HTML saat user hover link
  },
  build: {
    inlineStylesheets: "always", // Inline CSS < 4KB untuk eliminate render-blocking
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: "esbuild",
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "assets/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      },
    },
  },
});
