<script lang="ts">
  export let currentPage: { title: string; url: string };
  export let prevPage: { title: string; url: string } | null;
  export let nextPage: { title: string; url: string } | null;
</script>

<nav class="flex justify-between items-center py-8">
  {#if prevPage}
    <a href={prevPage.url} class="flex items-center space-x-2 text-primary-500 hover:text-primary-700 transition-colors duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <span>{prevPage.title}</span>
    </a>
  {:else}
    <span />
  {/if}

  {#if nextPage}
    <a href={nextPage.url} class="flex items-center space-x-2 text-primary-500 hover:text-primary-700 transition-colors duration-200">
      <span>{nextPage.title}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
