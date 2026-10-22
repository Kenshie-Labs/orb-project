// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import expressiveCode from 'astro-expressive-code';
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import pwa from "@vite-pwa/astro";

function remarkCleanInlineCode() {
  return (tree) => {
    visit(tree, 'inlineCode', (node) => {
      // Kita ubah tipe node agar di-render sebagai HTML custom
      // Ini akan menghilangkan backtick dan membungkusnya dalam tag custom
      node.type = 'html';
      node.value = `<span class="inline-code">${node.value}</span>`;
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://orb.axelkenshi.web.id",
  // Konfigurasi server development
  server: {
    port: 2999, // Ganti dengan port yang Anda inginkan (misal: 3000, 5000, dll)
    host: true, // (Opsional) Agar bisa diakses juga via IP lokal / network
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: 'shiki', // Pastikan menggunakan shiki
    shikiConfig: {
      theme: 'vitesse-dark', // atau theme pilihan Anda
      wrap: false, // kode yang terlalu panjang akan dibungkus
    },
    remarkPlugins: [remarkDirective, remarkCleanInlineCode],
  },
  integrations: [
    sitemap(),
    svelte(),
    expressiveCode({
    themes: ['github-dark'],
    }),
    pwa({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Orb Project",
        short_name: "Orb",
        theme_color: "#edeadf",
        background_color: "#edeadf",
        display: "standalone",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Jangan precache CMS dan library mermaid yang besar
        globIgnores: ["**/admin/**", "**/vendor/mermaid/**"],
        navigateFallbackDenylist: [/^\/admin/],
        // navigateFallback: "/index.html",
        // Ambil alih cache external
        runtimeCaching: [
          // Mermaid: cache saat pertama dipakai (CacheFirst)
          {
            urlPattern: /\/vendor\/mermaid\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "mermaid-vendor-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // unsplash CDN
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "unsplash-images-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 3 * 24 * 60 * 60, // TEPAT 3 HARI (259.200 detik)
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Tenor CDN
          {
            urlPattern: /^https:\/\/media\.tenor\.com\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "tenor-media-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 3 * 24 * 60 * 60, // TEPAT 3 HARI (259.200 detik)
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cloudinary: gambar hasil transformasi
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\.(?:png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Pixeldrain: hanya gambar, bukan video atau file besar
          {
            urlPattern: /^https:\/\/pixeldrain\.com\/api\/file\/.*\.(?:png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "pixeldrain-images-cache",
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Video Cloudinary atau Pixeldrain: jangan di-cache, selalu dari jaringan
          {
            urlPattern: /^https:\/\/(res\.cloudinary\.com|pixeldrain\.com)\/.*\.(?:mp4|webm|ogg|mov|m4v|mp3|wav)(\?.*)?$/i,
            handler: "NetworkOnly",
          },
        ],
      },
      devOptions: {
        enabled: process.env.SW_DEV === 'true',
      },
    }),
  ],
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
