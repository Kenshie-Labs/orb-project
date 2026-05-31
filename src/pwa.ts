// src/pwa.ts
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.log('🚀 Orb Project siap diakses offline 100%!');
    },
    onNeedRefresh() {
      console.log('Ada konten baru, memperbarui cache...');
    }
  });
}