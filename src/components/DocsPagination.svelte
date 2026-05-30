<script lang="ts">
  export let currentPage: { title: string; url: string };
  export let prevPage: { title: string; url: string } | null;
  export let nextPage: { title: string; url: string } | null;
</script>

<nav class="flex justify-between items-start py-8"> <!-- Changed items-center to items-start -->
  {#if prevPage}
    <a href={prevPage.url} class="flex items-start text-primary-500
      hover:text-orange-500 active:text-orange-500
      transition-colors duration-200 max-w-[48%] group text-left">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mr-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <div class="flex flex-col flex-1 min-w-0">
        <span class="text-xs text-gray-500 dark:text-gray-400">Previous</span>
        <span class="font-semibold leading-tight">{prevPage.title}</span>
      </div>
    </a>
  {:else}
    <span />
  {/if}

  {#if nextPage}
    <a href={nextPage.url} class="flex items-start justify-end text-primary-500
      hover:text-orange-500 active:text-orange-500
      transition-colors duration-200 max-w-[48%] group text-right">
      <div class="flex flex-col flex-1 min-w-0">
        <span class="text-xs text-gray-500 dark:text-gray-400">Next</span>
        <span class="font-semibold leading-tight">{nextPage.title}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 ml-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </a>
  {:else}
    <span />
  {/if}
</nav>

<style>
  /* You can add specific styles for this component here if needed */
</style>
