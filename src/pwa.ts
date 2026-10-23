// src/pwa.ts
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Versi baru sudah terpasang dan siap. Terapkan sekarang.
      updateSW(true);
    },
    onOfflineReady() {
      console.log('Orb Project is ready for offline access.');
    },
  });

  // Cek update secara berkala, misalnya tiap 60 detik, dan saat tab kembali aktif
  setInterval(() => navigator.serviceWorker.getRegistration()?.then((r) => r?.update()), 60_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.getRegistration()?.then((r) => r?.update());
    }
  });
}
