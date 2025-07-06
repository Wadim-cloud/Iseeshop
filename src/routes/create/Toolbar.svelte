<script>
  import { createEventDispatcher } from 'svelte';

  export let drawingId;
  export let brushColor;
  export let brushSize;
  export let brushType;
  export let colors;
  export let brushTypes;

  const dispatch = createEventDispatcher();
</script>

<style>
  .subbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px;
    background: #ffffffcc;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    align-items: center;
    justify-content: center;
  }
  .subbar button,
  .subbar input,
  .subbar select {
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    transition: all 0.2s ease;
  }
  .subbar button:hover {
    background-color: #f0f0f0;
  }
  .subbar button:active {
    transform: scale(0.95);
  }
  .subbar .drawing-id {
    min-width: 140px;
  }
</style>

<div class="subbar">
  <input
    class="drawing-id"
    type="text"
    bind:value={drawingId}
    placeholder="Drawing ID"
    on:input={(e) => dispatch('changeDrawingId', e.target.value)}
  />
  <button on:click={() => dispatch('openGallery')}>🖼️ Gallery</button>
  <button on:click={() => dispatch('loadDrawing')}>🔄 Load</button>
  <button on:click={() => dispatch('saveDrawing')}>💾 Save</button>
  <button on:click={() => dispatch('clearCanvas')}>🗑️ Clear</button>
  <button on:click={() => dispatch('toggleSettings')}>⚙️ Settings</button>
  <label>
    🎨 Color
    <select bind:value={brushColor} on:change={(e) => dispatch('changeBrushColor', e.target.value)}>
      {#each colors as color}
        <option value={color}>{color}</option>
      {/each}
    </select>
  </label>
  <label>
    🖌️ Size
    <input
      type="range"
      bind:value={brushSize}
      min="1"
      max="50"
      on:input={(e) => dispatch('changeBrushSize', +e.target.value)}
    />
  </label>
  <label>
    ✏️ Type
    <select bind:value={brushType} on:change={(e) => dispatch('changeBrushType', e.target.value)}>
      {#each brushTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </label>
</div>