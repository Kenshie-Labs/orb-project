![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![npm >= 11](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![Wiki Documentation](https://img.shields.io/badge/Wiki-Devin.ai-blueviolet)](https://app.devin.ai/org/kenshie-labs/wiki/Kenshie-Labs/orb-project?branch=main)


# ORB Knownrie

[**📟 Live Demo**](https://orb.axelkenshi.web.id/)

**Observatory of Research & Brainstorming** - A documentation site for academic notes, exam preparation, or even self thought.

## Overview

ORB Knownrie is a modern documentation website built with Astro, designed to organize academic notes into structured knowledge. It features a clean interface with dark/light mode support, smooth navigation, and a responsive layout optimized for reading and studying.

## Tech Stack

- **Astro** - Modern web framework for content-focused sites
- **Svelte** - Interactive components (navbar, theme toggle)
- **Tailwind CSS** - Utility-first styling with custom theme
- **TypeScript** - Type-safe development
- **Astro Content Collections** - Markdown content management

## Features

- 🌓 **Dark/Light Mode** - Toggle between themes with persistent preference
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🚀 **Fast Navigation** - Client-side routing with smooth transitions
- 📚 **Organized Content** - Hierarchical structure for academic notes
- 🔍 **Table of Contents** - Auto-generated navigation for long pages
- 🌐 **Bilingual Support** - English and Indonesian translations
- 📊 **Scroll Progress** - Visual indicator showing reading progress

## Project Structure

```text
├── public/
│   ├── favicon.svg
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── Navbar.svelte          # Main navigation with theme toggle
│   │   └── ThemeInit.astro        # Prevents FOUC on theme load
│   ├── content/
│   │   └── academics/             # Academic notes by category
│   │       ├── informatika/       # Computer science notes
│   │       ├── matematika/        # Mathematics notes
│   │       └── test.md            # Example content
│   ├── layouts/
│   │   └── DocsLayout.astro       # Documentation layout with sidebars
│   ├── locales/
│   │   └── translations.json      # i18n translations (ID/EN)
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   └── notes/
│   │       ├── index.astro        # Notes listing page
│   │       └── [category]/        # Dynamic category routes
│   ├── styles/
│   │   └── global.css             # Global styles and Tailwind
│   └── content.config.ts          # Content collection configuration
├── astro.config.mjs               # Astro configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js >= 22.12.0

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Building for Production

Build the site for deployment:

```bash
npm run build
```

The output will be in the `./dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
or
npx astro preview
```

## Adding Content

Content is managed through Astro Content Collections. Add markdown files to `src/content/academics/` with the following frontmatter:

```yaml
---
title: "Your Note Title"
excerpt: "Brief description of the content"
date: 2024-01-01
---
```

### Content Organization

- Organize notes by category (e.g., `informatics/`, `business/`)
- Create subdirectories for deeper organization
- The sidebar automatically groups content by directory structure

### The boundries on displaying content subfolder names

Maximum is two levels deep.

more than that will not be considered/included in the left sidebar list, will be ignored for the take down only no matter how deep the folder tree is, in the end it will be considered as part of the second level sub folder.

Example :

```text
│   ├── content/                         # Content directory Collections
│   │   └── academics/                    # As root notes title
│   │       ├── introduction.md           # root markdown (available on left sidebar)
│   │       ├── algebra/                    # subfolder notes title
│   │       │   └── 01-fundamentals.md
│   │       │   └── 02-formula.md             # subfolder markdown (available on left sidebar)
│   │       ├── pythagoras/
│   │       │   └── 01-fundamentals.md   
│   │       │   └── 01-formula.md
│   │       │   └── third-folder/
│   │       │       └── fourth-folder/
│   │       │           └── fifth-folder/
│   │       │               └── silly.md      # (available) but not considered an independent child path 
```

You might find that the path home / note / .. / ... is there (a nested subfolder path) in the breadcrumb, but when you try to click it, it will produce nothing but an astro error from the developer mode testing side.

## Customization

### Theme Colors

Custom colors are defined in the Tailwind configuration. The main theme uses:
- `orb-dark` - Dark color for light mode
- `orb-tan` - Light color for dark mode
- Accent colors: orange and green

### Translations

Edit `src/locales/translations.json` to modify text for both English and Indonesian.

## Performance Optimizations

- CSS inlining for styles under 4KB
- Prefetching on hover for faster navigation
- Code splitting for optimal loading
- Minification with esbuild

## License

See LICENSE file for details.

## TODO List

- [x] Create navbar with svelte
- [x] standardize universal styling to be consistent, e.g dark/light mode
- [x] Create light/dark mode toggle
- [x] Create menu dropdown and scroll progress bar rounded
- [ ] develop the navigation section to be more functional
- [ ] Create a search feature with built-in algorithms on the navbar.
- [ ] perfecting prose with typography for markdown rendering
- [ ] using plugin remark-oembed for embedding media from urls
- [ ] create a copy feature in prose code
- [ ] create a landing page in the main /pages/index.astro
- [ ] create a path-based generator and markdown generator folder via npm commands that rely on native node js parameters
- [ ] (Optional) create a simple i8n from locales which is useful for static id/en buttons to change the specified base language e.g. {..title}
- [ ] (Optional) create a smooth scroll animation when a section (Right: in this guide) is clicked
- [ ] (Optional) create translation id/en button that toggles between languages with google translate engine
- [ ] Frontend: change hover to active pseudo-element when media queries is mobile/tablet in global css
