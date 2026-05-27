<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  // 'slide' digunakan sebagai Svelte transition directive di template (transition:slide)
  // Warning Vite adalah false positive — Svelte compiler menangani ini secara internal
  void slide;
  import { IconGridDots, IconSun, IconMoon, IconX } from "@tabler/icons-svelte";

  // --- State (Svelte 5 runes) ---
  let isDark = $state(false);
  let isMenuOpen = $state(false);
  let scrollProgress = $state(0);

  // --- Scroll progress ring math ---
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  let strokeOffset = $derived(circumference * (1 - scrollProgress));

  // --- Handlers ---
  function handleScroll() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
  }

  function toggleDark() {
    isDark = !isDark;
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("orb-theme", isDark ? "dark" : "light");
    } catch (_) {}
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }

  onMount(() => {
    // Baca state dark dari DOM (sudah di-set oleh ThemeInit sebelum hydrate)
    isDark = document.documentElement.classList.contains("dark");

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // inisialisasi nilai awal

    // ── View Transitions: jalankan setiap halaman baru selesai load ──
    // Karena Navbar di-persist (tidak di-destroy), onMount tidak jalan ulang.
    // astro:page-load menggantikan perannya untuk reset state per-halaman.
    const onPageLoad = () => {
      // Reset scroll ring ke 0 (halaman baru selalu mulai dari atas)
      handleScroll();
      // Tutup dropdown menu saat navigasi ke halaman lain
      isMenuOpen = false;
      // Re-sync dark mode (kalau ada halaman yang mengubah class html)
      isDark = document.documentElement.classList.contains("dark");
    };

    document.addEventListener("astro:page-load", onPageLoad);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("astro:page-load", onPageLoad);
    };
  });
</script>

<!-- ─────────────────────────── HEADER ─────────────────────────── -->
<header
  class="sticky top-0 z-50 border-b-2 border-orb-dark bg-orb-tan
         dark:border-orb-tan dark:bg-orb-dark"
>
  <div
    class="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between"
  >

    <!-- Logo + Brand -->
    <a
      href="/"
      class="flex items-center gap-2 font-petrona font-bold text-lg tracking-wide
             text-orb-dark dark:text-orb-tan"
    >
      <img src="/favicon.svg" alt="Orb logo" class="w-7 h-7" />
      ORB Knownrie
    </a>

    <!-- Right controls -->
    <div class="flex items-center gap-3">

      <!-- ── Dark/Light Toggle Pill ── -->
      <button
        onclick={toggleDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        class="flex items-center gap-1 p-1 rounded-full border-2 transition-colors
               border-orb-dark bg-orb-tan
               dark:border-orb-tan dark:bg-orb-dark"
      >
        <!-- Sun (active in light) -->
        <span
          class="w-6 h-6 rounded-full flex items-center justify-center transition-colors
                 {isDark
            ? 'text-orb-dark/40 dark:text-orb-tan/30'
            : 'bg-orb-dark text-orb-tan'}"
        >
          <IconSun size={13} />
        </span>
        <!-- Moon (active in dark) -->
        <span
          class="w-6 h-6 rounded-full flex items-center justify-center transition-colors
                 {isDark
            ? 'bg-orb-tan text-orb-dark'
            : 'text-orb-dark/40 dark:text-orb-tan/30'}"
        >
          <IconMoon size={13} />
        </span>
      </button>

      <!-- ── Menu Button + Scroll Ring ── -->
      <button
        onclick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        class="flex flex-col items-center leading-none
               text-orb-dark dark:text-orb-tan"
      >
        <!-- Ring container -->
        <div class="relative w-11 h-11 flex items-center justify-center">
          <!-- SVG progress ring — rotated -90° agar start dari atas -->
          <svg
            class="absolute inset-0 w-full h-full"
            viewBox="0 0 44 44"
            aria-hidden="true"
          >
            <!-- Track (background circle) -->
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="opacity-20"
              transform="rotate(-90 22 22)"
            />
            <!-- Progress circle -->
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-dasharray={circumference}
              stroke-dashoffset={strokeOffset}
              transform="rotate(-90 22 22)"
              style="transition: stroke-dashoffset 80ms linear;"
            />
          </svg>

          <!-- Icon: grid atau X -->
          {#if isMenuOpen}
            <IconX size={16} />
          {:else}
            <IconGridDots size={16} />
          {/if}
        </div>

        <!-- Label -->
        <span class="text-[9px] tracking-[0.18em] uppercase -mt-0.5 font-medium">
          menu
        </span>
      </button>

    </div>
  </div>

  <!-- ── Dropdown Menu ── -->
  {#if isMenuOpen}
    <div
      transition:slide={{ duration: 180 }}
      class="border-t-2 border-orb-dark dark:border-orb-tan
             bg-orb-tan dark:bg-orb-dark"
    >
      <nav
        class="max-w-screen-xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-2"
      >
        <a
          href="/notes"
          data-astro-prefetch
          onclick={closeMenu}
          class="px-4 py-2 text-sm font-medium border-2
                 border-orb-dark text-orb-dark
                 dark:border-orb-tan dark:text-orb-tan
                 hover:bg-orb-dark hover:text-orb-tan
                 dark:hover:bg-orb-tan dark:hover:text-orb-dark
                 transition-colors"
        >
          → Notes
        </a>
        <a
          href="/"
          data-astro-prefetch
          onclick={closeMenu}
          class="px-4 py-2 text-sm font-medium border-2
                 border-orb-dark text-orb-dark
                 dark:border-orb-tan dark:text-orb-tan
                 hover:bg-orb-dark hover:text-orb-tan
                 dark:hover:bg-orb-tan dark:hover:text-orb-dark
                 transition-colors"
        >
          → Home
        </a>
      </nav>
    </div>
  {/if}
</header>
