// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const content = defineCollection({
  // 1. Definisikan loader untuk menyapu bersih file markdown secara rekursif
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/",
  }),
  // 2. Skema frontmatter untuk validasi data catatan kamu
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    date: z.date().optional(),
  }),
});

export const collections = { content };
