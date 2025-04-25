<script lang="ts">
  export let currentPage = 1;
  export let totalPages = 1;

  // Emit page change
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch('pageChange', page);
    }
  };

  // Generate unique page numbers for large pagination
  $: pages = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pageSet = new Set<number>();
    // Always include first and last pages
    pageSet.add(1);
    pageSet.add(totalPages);

    // Include current page and neighbors
    if (currentPage > 1) pageSet.add(currentPage - 1);
    pageSet.add(currentPage);
    if (currentPage < totalPages) pageSet.add(currentPage + 1);

    // Convert to sorted array
    return Array.from(pageSet).sort((a, b) => a - b);
  })();
</script>

<nav class="pagination">
  <button
    on:click={() => changePage(currentPage - 1)}
    disabled={currentPage === 1}
    aria-label="Previous Page"
  >
    ◀ Prev
  </button>

  {#if totalPages <= 7}
    {#each Array(totalPages) as _, i}
      <button
        class:selected={i + 1 === currentPage}
        on:click={() => changePage(i + 1)}
      >
        {i + 1}
      </button>
    {/each}
  {:else}
    {#each pages as page, index (index)}
      {#if index > 0 && page - pages[index - 1] > 1}
        <span>…</span>
      {/if}
      <button
        class:selected={page === currentPage}
        on:click={() => changePage(page)}
      >
        {page}
      </button>
    {/each}
  {/if}

  <button
    on:click={() => changePage(currentPage + 1)}
    disabled={currentPage === totalPages}
    aria-label="Next Page"
  >
    Next ▶
  </button>
</nav>

<style>
  .pagination {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.4rem 0.75rem;
    border: 1px solid #d1d5db;
    background-color: #fff;
    color: #374151;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  button:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.selected {
    background-color: #4f46e5;
    color: white;
    font-weight: bold;
  }

  span {
    padding: 0.4rem 0.75rem;
    color: #9ca3af;
  }
</style>