<script lang="ts">
  import Pagination from '$lib/ui/Pagination.svelte';

  export let currentPage: number;
  export let totalPages: number;
  export let onPageChange: (page: number) => void;
</script>

{#if totalPages > 1}
  <div class="gallery-controls">
    <Pagination
      {currentPage}
      {totalPages}
      on:pageChange={(e) => onPageChange(e.detail)}
    />
  </div>
{/if}

<style>
  .gallery-controls {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }
</style>
