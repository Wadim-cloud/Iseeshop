<script>
  import { createEventDispatcher } from 'svelte';

  export let drawings;
  export let isLoading;

  const dispatch = createEventDispatcher();
</script>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 1000;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
  .modal-content {
    max-height: 400px;
    overflow-y: auto;
    margin-top: 1rem;
  }
  .drawing-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  .drawing-item:hover {
    background: #f5f5f5;
  }
  .drawing-preview {
    width: 80px;
    height: 60px;
    object-fit: cover;
    margin-right: 10px;
    border: 1px solid #ddd;
  }
  .drawing-info {
    flex: 1;
  }
  .modal-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .modal-buttons button {
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }
  .modal-buttons button:active {
    transform: scale(0.95);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>

<div class="modal-overlay" on:click={() => dispatch('close')}></div>
<div class="modal">
  <h2>Select a Drawing</h2>
  <div class="modal-content">
    {#if isLoading}
      <p>Loading drawings...</p>
    {:else if drawings.length === 0}
      <p>No drawings found.</p>
    {:else}
      {#each drawings as drawing}
        <div class="drawing-item" on:click={() => dispatch('selectDrawing', drawing.drawing_id)}>
          {#if drawing.image_data}
            <img src={drawing.image_data} alt="Preview" class="drawing-preview" />
          {:else}
            <div class="drawing-preview" style="display: flex; align-items: center; justify-content: center; background: #eee;">
              No Image
            </div>
          {/if}
          <div class="drawing-info">
            <strong>{drawing.drawing_id}</strong>
            {#if drawing.title}
              <span> - {drawing.title}</span>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
  <div class="modal-buttons">
    <button on:click={() => dispatch('close')}>Close</button>
  </div>
</div>