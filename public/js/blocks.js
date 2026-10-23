// public/js/blocks.js
// Merender blok rumus (KaTeX) dan diagram (Mermaid) di browser.
// Dijalankan ulang setiap navigasi ClientRouter (astro:page-load).
(() => {
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (window.katex) return resolve();
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Gagal memuat ${src}`)), { once: true });
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Gagal memuat ${src}`));
      document.head.appendChild(s);
    });

  const loadStyle = (href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  const b64decode = (s) => {
    const bin = atob(s);
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  };

  // Hanya elemen yang belum diproses (tanpa data-rendered)
  async function renderMath() {
    const els = document.querySelectorAll('.math-block[data-tex-b64]:not([data-rendered])');
    if (!els.length) return;

    loadStyle('/vendor/katex/katex.min.css');
    await loadScript('/vendor/katex/katex.min.js');

    els.forEach((el) => {
      try {
        const tex = b64decode(el.dataset.texB64);
        window.katex.render(tex, el, { displayMode: true, throwOnError: false });
        el.dataset.rendered = 'true';
      } catch (err) {
        console.error('[math] gagal render:', err);
      }
    });
  }

  let mermaidPromise = null;
  const getMermaid = () => {
    mermaidPromise ??= import('/vendor/mermaid/mermaid.esm.min.mjs').then((m) => {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      m.default.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: dark ? 'dark' : 'default',
      });
      return m.default;
    });
    return mermaidPromise;
  };

  async function renderMermaid() {
    const blocks = document.querySelectorAll('.mermaid-block[data-src-b64]:not([data-rendered])');
    if (!blocks.length) return;

    const mermaid = await getMermaid();

    const nodes = Array.from(blocks, (block) => {
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.dataset.rendered = 'true';
      div.textContent = b64decode(block.dataset.srcB64);
      block.replaceWith(div);
      return div;
    });

    await mermaid.run({ nodes });
  }

  const run = () => {
    renderMath().catch((err) => console.error('[math]', err));
    renderMermaid().catch((err) => console.error('[mermaid]', err));
  };

  run();
  document.addEventListener('astro:page-load', run);
})();
