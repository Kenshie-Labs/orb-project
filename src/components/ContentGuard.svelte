<script lang="ts">
  import { onMount } from 'svelte';
  export let isLocked = false;
  export let question = '';
  export let correctAnswer = '';

  let userInput = '';
  let isUnlocked = !isLocked;
  let isShaking = false;

  function handleUnlock() {
    if (userInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      isUnlocked = true;
    } else {
      isShaking = true;
      setTimeout(() => isShaking = false, 500);
    }
  }
</script>

{#if !isUnlocked}
  <div class="my-10 p-8 border-4 border-orb-dark dark:border-orb-tan shadow-brutal dark:shadow-brutal-onDarkMode bg-white dark:bg-orb-dark/80 flex flex-col items-center text-center">
    <h3 class="font-petrona text-2xl mb-4">⚠️ Failed: unexpected error</h3>
    <p class="mb-6 font-source-sans">{question}</p>
    
    <div class="w-full max-w-sm flex flex-col gap-4">
      <input 
        type="text" 
        bind:value={userInput}
        placeholder="Responses..."
        class="w-full p-3 border-2 border-orb-dark dark:border-orb-tan bg-transparent font-mono {isShaking ? 'animate-shake' : ''}"
        on:keydown={(e) => e.key === 'Enter' && handleUnlock()}
      />
      <button 
        on:click={handleUnlock}
        class="w-full px-6 py-3 bg-orb-dark text-orb-tan dark:bg-orb-tan dark:text-orb-dark font-bold border-2 border-orb-dark hover:translate-x-1 hover:translate-y-1 transition-transform"
      >
        Retry
      </button>
      <p>* If the page still won't load, there's an internal server error.</p>
    </div>
  </div>
{:else}
  <div class="content-wrapper">
    <slot />
  </div>
{/if}

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  .animate-shake { animation: shake 0.3s linear; }
</style>
