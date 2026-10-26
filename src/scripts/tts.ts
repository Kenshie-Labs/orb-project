// src/scripts/tts.ts
// Text-to-Speech eksperimental memakai Web Speech API bawaan browser.
// Tidak ada dependensi tambahan. Dukungan suara bergantung pada perangkat dan browser.

export const RATE = { min: 0.8, max: 1.2, step: 0.1, default: 1.0 } as const;

const MAX_CHARS = 180; // batas panjang satu utterance agar tidak terpotong engine suara

type PlayState = "idle" | "playing" | "paused";

const SUPPORTED =
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

const CONTENT_ROOT = "main";
const TEXT_BLOCKS = "h1, h2, h3, h4, h5, h6, p, li, blockquote, dt, dd, td, th";

// Elemen yang tidak dibacakan: navigasi, popup, rumus, diagram, kode, dan embed
const SKIP = [
  "aside", "nav", "dialog", "button", "script", "style", "svg",
  "pre", "figure", "math",
  ".math-block", ".mermaid-block", ".mermaid",
  ".embed-plot", ".embed-chart", ".embed-youtube", ".embed-iframe",
  ".embed-video", ".embed-grid", ".embed-link", ".embed-image",
  ".dock", "[data-tts-panel]",
].join(", ");

// ----- State modul -----
// Modul hanya dimuat sekali, jadi state ini bertahan antar navigasi.
// Sengaja tidak disimpan ke localStorage: pemutaran bersifat sesaat.
let playState: PlayState = "idle";
let queue: string[] = [];
let index = 0;
let rate: number = RATE.default;
let lang = "id";
let session = 0; // penanda sesi: callback dari utterance lama diabaikan
let onState: ((state: PlayState) => void) | null = null;

function setState(next: PlayState) {
  playState = next;
  onState?.(next);
}

// ----- Pengambilan teks -----

// Memecah teks per kalimat. Kalimat yang terlalu panjang dipotong per ±180 karakter.
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  for (const part of text.split(/(?<=[.!?…])\s+/)) {
    const s = part.trim();
    if (!s) continue;
    if (s.length <= MAX_CHARS) {
      out.push(s);
    } else {
      const chunks = s.match(new RegExp(`.{1,${MAX_CHARS}}(?:\\s|$)`, "g")) ?? [s];
      out.push(...chunks.map((c) => c.trim()).filter(Boolean));
    }
  }
  return out;
}

// Mengumpulkan teks dari blok terdalam di dalam <main>, dengan melewati elemen SKIP
export function collectSentences(): string[] {
  const root = document.querySelector<HTMLElement>(CONTENT_ROOT);
  if (!root) return [];

  const sentences: string[] = [];
  root.querySelectorAll<HTMLElement>(TEXT_BLOCKS).forEach((el) => {
    if (el.closest(SKIP)) return;
    if (el.querySelector(TEXT_BLOCKS)) return; // hanya blok yang tidak memuat blok lain
    const text = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (text) sentences.push(...splitSentences(text));
  });
  return sentences;
}

// Bahasa diambil dari #note-content, yang juga dipakai TranslateToggle.
// Default "id" agar tidak jatuh ke lang="en" pada <html>.
function getLang(): string {
  return document.getElementById("note-content")?.lang || "id";
}

// Suara pertama yang cocok dengan awalan bahasa. Jika tidak ada, browser memilih sendiri.
function pickVoice(code: string): SpeechSynthesisVoice | undefined {
  const prefix = code.slice(0, 2).toLowerCase();
  return speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith(prefix));
}

// ----- Pemutaran -----

function speakFrom(start: number) {
  if (start >= queue.length) {
    stop();
    return;
  }

  index = start;
  const mySession = ++session;

  const utterance = new SpeechSynthesisUtterance(queue[start]);
  utterance.rate = rate;
  utterance.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    if (mySession !== session || playState !== "playing") return;
    speakFrom(start + 1);
  };

  utterance.onerror = (event) => {
    if (mySession !== session) return;
    if (event.error === "interrupted" || event.error === "canceled") return;
    console.warn("[tts] gagal membacakan:", event.error);
    stop();
  };

  speechSynthesis.speak(utterance);
}

// Mengembalikan false jika tidak ada teks yang bisa dibacakan
export function play(): boolean {
  if (!SUPPORTED || playState !== "idle") return false;

  queue = collectSentences();
  if (queue.length === 0) return false;

  lang = getLang();
  speechSynthesis.resume(); // jaga-jaga jika engine masih dalam kondisi pause
  setState("playing");
  speakFrom(0);
  return true;
}

export function pause() {
  if (!SUPPORTED || playState !== "playing") return;
  speechSynthesis.pause();
  setState("paused");
}

export function resume() {
  if (!SUPPORTED || playState !== "paused") return;
  speechSynthesis.resume();
  setState("playing");
}

export function stop() {
  session++; // membatalkan semua callback yang masih menunggu
  if (SUPPORTED) speechSynthesis.cancel();
  queue = [];
  index = 0;
  setState("idle");
}

// Kecepatan diterapkan ulang dari kalimat yang sedang dibacakan.
// Kalimat itu dimulai dari awal, dengan kecepatan baru.
export function setRate(value: number): number {
  const stepped = Math.round(value / RATE.step) * RATE.step;
  rate = Math.min(RATE.max, Math.max(RATE.min, Number(stepped.toFixed(1))));

  if (playState === "idle") return rate;

  const wasPaused = playState === "paused";
  session++;
  speechSynthesis.cancel();
  speakFrom(index);
  if (wasPaused) speechSynthesis.pause();
  return rate;
}

// ----- Integrasi UI -----

export function initTts() {
  const panel = document.querySelector<HTMLElement>("[data-tts-panel]");
  if (!panel || panel.dataset.ready === "true") return;
  panel.dataset.ready = "true";

  const find = <T extends HTMLElement>(sel: string) => panel.querySelector<T>(sel);
  const playBtn = find<HTMLButtonElement>('[data-tts="play"]');
  const pauseBtn = find<HTMLButtonElement>('[data-tts="pause"]');
  const resumeBtn = find<HTMLButtonElement>('[data-tts="resume"]');
  const stopBtn = find<HTMLButtonElement>('[data-tts="stop"]');
  const rateInput = find<HTMLInputElement>("[data-tts-rate]");
  const rateOutput = find<HTMLElement>("[data-tts-rate-value]");
  const statusEl = find<HTMLElement>("[data-tts-status]");

  const showMessage = (text: string) => {
    if (statusEl) statusEl.textContent = text;
  };

  if (!SUPPORTED) {
    for (const el of [playBtn, pauseBtn, resumeBtn, stopBtn, rateInput]) {
      if (el) el.disabled = true;
    }
    showMessage("Browser ini tidak mendukung pembacaan suara.");
    return;
  }

  const LABELS: Record<PlayState, string> = {
    idle: "Siap dibacakan.",
    playing: "Sedang membacakan…",
    paused: "Dijeda.",
  };

  const render = (state: PlayState) => {
    if (playBtn) playBtn.disabled = state !== "idle";
    if (pauseBtn) pauseBtn.disabled = state !== "playing";
    if (resumeBtn) resumeBtn.disabled = state !== "paused";
    if (stopBtn) stopBtn.disabled = state === "idle";
    showMessage(LABELS[state]);
  };

  onState = render;

  playBtn?.addEventListener("click", () => {
    if (!play()) showMessage("Tidak ada teks yang bisa dibacakan di halaman ini.");
  });
  pauseBtn?.addEventListener("click", () => pause());
  resumeBtn?.addEventListener("click", () => resume());
  stopBtn?.addEventListener("click", () => stop());

  if (rateInput && rateOutput) {
    rateInput.min = String(RATE.min);
    rateInput.max = String(RATE.max);
    rateInput.step = String(RATE.step);
    rateInput.value = String(rate);
    rateOutput.textContent = rate.toFixed(1);

    rateInput.addEventListener("input", () => {
      rateOutput.textContent = setRate(Number(rateInput.value)).toFixed(1);
    });
  }

  render(playState);
}

// ----- Pembersihan saat navigasi -----
// Modul dimuat sekali, jadi listener ini hanya terpasang sekali.
if (typeof window !== "undefined") {
  document.addEventListener("astro:before-swap", () => stop());
  window.addEventListener("pagehide", () => stop());
}
