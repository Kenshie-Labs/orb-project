// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkEmbed, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
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
