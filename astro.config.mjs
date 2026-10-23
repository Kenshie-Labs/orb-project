// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import expressiveCode from 'astro-expressive-code';
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import pwa from "@vite-pwa/astro";
import { unified } from "@astrojs/markdown-remark"; // 1. Import unified dari markdown-remark

function remarkCleanInlineCode() {
  return (tree) => {
    visit(tree, 'inlineCode', (node) => {
      // Kita ubah tipe node agar di-render sebagai HTML custom
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
    port: 2999,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: false,
    },
    // 2. Gunakan processor unified() untuk menampung remarkPlugins Anda
    processor: unified({
      remarkPlugins: [remarkDirective, remarkCleanInlineCode],
    }),
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
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        globIgnores: ["**/admin/**", "**/vendor/mermaid/**"],
        navigateFallbackDenylist: [/^\/admin/],
        runtimeCaching: [
          {
            urlPattern: /\/vendor\/katex\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "katex-vendor-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "unsplash-images-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 3 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/media\.tenor\.com\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "tenor-media-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 3 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\.(?:png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/pixeldrain\.com\/api\/file\/.*\.(?:png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "pixeldrain-images-cache",
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
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
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  build: {
    inlineStylesheets: "always",
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
