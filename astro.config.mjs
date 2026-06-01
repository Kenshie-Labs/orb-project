// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import pwa from "@vite-pwa/astro";

function remarkEmbed() {
  return (tree) => {
    visit(tree, (node) => {
      // HANYA tangani video, biarkan gambar dilewati
      if (node.name === "embed" && node.attributes.url?.includes("youtu")) {
        const url = node.attributes.url;
        const videoId = url
          .split(/v=|youtu\.be\/|\/embed\//)[1]
          ?.split(/[?&]/)[0];

        node.type = "html";
        node.value = `
                  <div>
                    <iframe
                      src="https://www.youtube.com/embed/${videoId}"
                      class="w-full aspect-video block"
                      frameborder="0"
                      allowfullscreen>
                    </iframe>
                  </div>`;
      }
    });
  };
}

function remarkCustomBlocks() {
  return (tree) => {
    visit(tree, (node) => {
      // Memeriksa jika node adalah container directive (:::name)
      if (
        node.type === 'containerDirective' &&
        ['note', 'tip', 'important', 'dangerous'].includes(node.name)
      ) {
        const data = node.data || (node.data = {});
        const tagName = 'div';
        
        data.hName = tagName;
        data.hProperties = {
          class: `custom-block ${node.name}`,
        };
      }
    });
  };
}

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
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: 'shiki', // Pastikan menggunakan shiki
    shikiConfig: {
      theme: 'vitesse-dark', // atau theme pilihan Anda
      wrap: true,
    },
    remarkPlugins: [remarkDirective, remarkEmbed, remarkMath, remarkCustomBlocks, remarkCleanInlineCode],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    svelte(),
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
        // navigateFallback: "/index.html",
        // Ambil alih cache external
        runtimeCaching: [
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
