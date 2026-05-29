<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  // 'slide' digunakan sebagai Svelte transition directive di template (transition:slide)
  // Warning Vite adalah false positive — Svelte compiler menangani ini secara internal
  void slide;
  import { Grid3x3, Sun, Moon, X } from "@lucide/svelte";

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

      // Re-sync dark mode from localStorage on page load to ensure consistency
      try {
        const storedTheme = localStorage.getItem("orb-theme");
        if (storedTheme === "dark") {
          document.documentElement.classList.add("dark");
          isDark = true;
        } else {
          // If storedTheme is 'light' or null/undefined, ensure 'dark' class is removed
          document.documentElement.classList.remove("dark");
          isDark = false;
        }
      } catch (e) {
        // Fallback in case localStorage is not available (e.g., security restrictions)
        console.error("Error accessing localStorage for theme:", e);
        isDark = document.documentElement.classList.contains("dark"); // Revert to DOM check as fallback
      }
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
      <img src="/favicon.svg" alt="Orb logo" width="28" height="28" class="w-7 h-7" />
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
          <Sun size={13} strokeWidth={2} />
        </span>
        <!-- Moon (active in dark) -->
        <span
          class="w-6 h-6 rounded-full flex items-center justify-center transition-colors
                 {isDark
            ? 'bg-orb-tan text-orb-dark'
            : 'text-orb-dark/40 dark:text-orb-tan/30'}"
        >
          <Moon size={13} strokeWidth={2} />
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
            <X size={16} strokeWidth={2} />
          {:else}
            <Grid3x3 size={16} strokeWidth={2} />
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
          href="/"
          data-astro-prefetch
          onclick={closeMenu}
          class="px-4 py-2 text-sm font-medium border-2
                 border-orb-dark text-orb-dark
                 dark:border-orb-tan dark:text-orb-tan
                 hover:bg-orb-dark hover:text-orb-tan
                 dark:hover:bg-orb-tan dark:hover:text-orb-dark
                 active:bg-orb-dark active:text-orb-tan
                 dark:active:bg-orb-tan dark:active:text-orb-dark
                 transition-colors"
        >
          → Home
        </a>
        <a
          href="/notes"
          data-astro-prefetch
          onclick={closeMenu}
          class="px-4 py-2 text-sm font-medium border-2
                 border-orb-dark text-orb-dark
                 dark:border-orb-tan dark:text-orb-tan
                 hover:bg-orb-dark hover:text-orb-tan
                 dark:hover:bg-orb-tan dark:hover:text-orb-dark
                 active:bg-orb-dark active:text-orb-tan
                 dark:active:bg-orb-tan dark:active:text-orb-dark
                 transition-colors"
        >
          → Notes
        </a>
      </nav>
    </div>
  {/if}
</header>
