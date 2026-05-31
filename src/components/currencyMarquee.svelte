<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const BASE_CURRENCY = 'USD'; 
  const TARGET_CURRENCIES = [
    'USD', 'EUR', 'GBP', 'JPY', 'IDR', 'SGD', 'AUD', 'CAD', 'CHF', 'CNY', 
    'HKD', 'NZD', 'SEK', 'KRW', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 
    'BRL', 'TWD', 'DKK', 'PLN', 'THB', 'MYR', 'HUF', 'CZK', 'ILS', 
    'PHP', 'AED', 'SAR', 'HUF', 'ISK', 'VND'
  ];
  
  let ratesData: Array<{ currency: string; current: number; previous: number; isUp: boolean }> = [];
  let isLoading = true;
  
  // Durasi default, akan diupdate setelah data dimuat
  let animationDuration = '30s'; 

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async function fetchRates() {
    try {
      const today = new Date();
      let daysBack = 1;
      if (today.getDay() === 1) daysBack = 3; 
      if (today.getDay() === 0) daysBack = 2; 

      const dateToday = formatDate(today);
      const dateYesterday = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysBack));

      const [resToday, resYesterday] = await Promise.all([
        fetch(`https://api.frankfurter.dev/v1/${dateToday}?base=${BASE_CURRENCY}&symbols=${TARGET_CURRENCIES.join(',')}`),
        fetch(`https://api.frankfurter.dev/v1/${dateYesterday}?base=${BASE_CURRENCY}&symbols=${TARGET_CURRENCIES.join(',')}`)
      ]);

      if (!resToday.ok || !resYesterday.ok) throw new Error('Gagal mengambil data');

      const dataToday = await resToday.json();
      const dataYesterday = await resYesterday.json();

      const todayRates = dataToday.rates;
      const yesterdayRates = dataYesterday.rates;

      ratesData = TARGET_CURRENCIES
        .filter(curr => todayRates[curr] && yesterdayRates[curr])
        .map(curr => ({
          currency: curr,
          current: todayRates[curr],
          previous: yesterdayRates[curr],
          isUp: todayRates[curr] >= yesterdayRates[curr]
        }));
      
      isLoading = false;
      
      // Hitung durasi animasi setelah data dimuat dan dirender
      setTimeout(calculateDuration, 100); 

    } catch (error) {
      console.error("Error:", error);
      isLoading = false;
    }
  }

  function calculateDuration() {
    const container = document.querySelector('.marquee-content');
    if (container) {
      // scrollWidth adalah lebar total konten (termasuk yang tersembunyi)
      const width = container.scrollWidth; 
      // Kecepatan target: 60 pixel per detik (bisa diubah agar lebih cepat/lambat)
      const speed = 200; 
      const duration = width / speed;
      animationDuration = `${duration}s`;
    }
  }

  onMount(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 86400000); 
    onDestroy(() => clearInterval(interval));
  });

  function formatValue(currency: string, value: number) {
    if (['IDR', 'JPY', 'KRW', 'HUF', 'ISK', 'VND'].includes(currency)) return Math.round(value).toLocaleString();
    return value.toFixed(4);
  }
</script>

<div class="w-full overflow-hidden bg-white dark:bg-slate-900 border-y-4 border-black py-1 font-mono text-xs">
  
  <!-- 
    PENTING: 
    1. Class 'marquee-content' digunakan untuk JS menghitung lebar.
    2. Class 'animate-marquee-custom' digunakan untuk animasi.
    3. Style inline '--duration' mengirim nilai dinamis ke CSS.
  -->
  <div 
    class="marquee-content animate-marquee-custom flex whitespace-nowrap gap-4" 
    style="--duration: {animationDuration}"
  >
    
    {#if isLoading}
      <span class="px-2 font-bold animate-pulse w-full text-center">LOADING RATES...</span>
    {:else}
      {#each [1, 2] as iteration}
        {#each ratesData as item}
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="font-bold bg-black text-white dark:bg-white dark:text-black px-1 py-0 text-[10px] leading-none">
              {item.currency}
            </span>
            <span class="leading-none font-semibold {item.isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
              {formatValue(item.currency, item.current)}
            </span>
            <span class="text-[10px] leading-none {item.isUp ? 'text-green-600' : 'text-red-600'}">
              {item.isUp ? '▲' : '▼'}
            </span>
            <span class="text-slate-400 text-[8px] leading-none">|</span>
          </div>
        {/each}
      {/each}
    {/if}
  </div>
</div>

<style>
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-marquee-custom {
    display: flex; /* Wajib ada agar item berbaris ke samping */
    animation: marquee var(--duration, 30s) linear infinite;
  }

  .animate-marquee-custom:hover {
    animation-play-state: paused;
  }
</style>
