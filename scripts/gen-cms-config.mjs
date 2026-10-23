// scripts/gen-cms-config.mjs
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";

const CONTENT_DIR = "content";
const OUT_FILE = "public/admin/config.yml";

// IMPORTANT
// Tambahkan akar pohon di sini saja. Urutan array menentukan urutan di dashboard.
// PASTIKAN TIDAK ADA TYPO, JIKA BERBEDA DARI PENAMAAN DI STRUKTUR POHON TIDAK AKAN TERDETEKSI
const ROOTS = [
  { folder: "academics", label: "Academics" },
  { folder: "Tryout-TKA", label: "Tryout TKA" },
  { folder: "Software-Development", label: "Software Development" },
];

// Field bersama, ditulis sekali
const FIELDS = [
  { label: "Title", name: "title", widget: "string" },
  { label: "Excerpt", name: "excerpt", widget: "text", required: false },
  { label: "Date", name: "date", widget: "datetime", date_format: "YYYY-MM-DD", time_format: false, required: false },
  { label: "Is Locked", name: "isLocked", widget: "boolean", default: false, required: false },
  { label: "Question", name: "question", widget: "string", required: false },
  { label: "Hint System Log", name: "hintSystemLog", widget: "string", required: false },
  {
    label: "Content",
    name: "body",
    widget: "markdown",
    required: false,
    editor_components: [
      "table", "callout", "youtube", "cdn-image", "cdn-grid", "link-card",
      "code-file", "terminal", "details", "code-diff", "cdn-video",
      "iframe-embed", "math", "mermaid", "plot-2d", "chart-bar", "chart-donut", "chart-line", "chart-heatmap",
    ],
  },
];

// Pengaturan global, sama seperti config.yml sebelumnya
const BASE = {
  backend: { name: "github", repo: "Kenshie-Labs/orb-project", branch: "main" },
  media_folder: "public/media",
  public_folder: "/media",
  logo: { src: "/favicon.svg", show_in_header: true },
  slug: {
    encoding: "ascii",
    clean_accents: true,
    lowercase: false,
    trim: true,
    sanitize_replacement: "_",
  },
};

// Cari semua folder yang berisi .md, termasuk subfolder di kedalaman berapa pun
function collectDirs(dir, acc = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  if (entries.some((e) => e.isFile() && e.name.endsWith(".md"))) acc.push(dir);
  for (const e of entries) {
    if (e.isDirectory()) collectDirs(join(dir, e.name), acc);
  }
  return acc;
}

const titleCase = (s) =>
  s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const collections = [];

for (const root of ROOTS) {
  const rootPath = join(CONTENT_DIR, root.folder);

  for (const dir of collectDirs(rootPath)) {
    const rel = relative(rootPath, dir).split(sep).filter(Boolean);
    const parts = rel.map(titleCase);
    const id = [root.folder, ...rel].join("--");

    collections.push({
      name: `content-${id}`,
      label: [root.label, ...parts].join(" / "),
      label_singular: parts.at(-1) ?? root.label,
      folder: dir.split(sep).join("/"),
      extension: "md",
      format: "frontmatter",
      create: true,
      slug: { editable: ["create"] },
      fields: FIELDS,
    });
  }
}

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(
  OUT_FILE,
  "# AUTO-GENERATED oleh scripts/gen-cms-config.mjs. Jangan edit manual.\n" +
    JSON.stringify({ ...BASE, collections }, null, 2) +
    "\n"
);

console.log(`✔ config.yml dibuat dengan ${collections.length} koleksi`);
