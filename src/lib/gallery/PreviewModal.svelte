<script lang="ts">
  import { fade } from 'svelte/transition';
  
  export let imageData: string;
  export let onClose: () => void;
  
  let zoomLevel = 1;
  let imagePosition = { x: 0, y: 0 };
  let isDragging = false;
  let startPos = { x: 0, y: 0 };
  
  function handleMouseDown(event: MouseEvent) {
    if (zoomLevel > 1) {
      isDragging = true;
      startPos = {
        x: event.clientX - imagePosition.x,
        y: event.clientY - imagePosition.y
      };
    }
  }
  
  function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
      imagePosition = {
        x: event.clientX - startPos.x,
        y: event.clientY - startPos.y
      };
    }
  }
  
  function handleMouseUp() {
    isDragging = false;
  }
  
  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    zoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 3);
  }
  
  function resetZoom() {
    zoomLevel = 1;
    imagePosition = { x: 0, y: 0 };
  }
  
  function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.2, 3);
  }
  
  function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.2, 1);
  }
</script>

<div 
  class="preview-modal"
  transition:fade={{ duration: 300 }}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
  on:wheel={handleWheel}
>
  <div class="modal-content">
    <div class="controls">
      <button on:click={onClose}>✕</button>
      <button on:click={zoomOut}>-</button>
      <button on:click={zoomIn}>+</button>
      <button on:click={resetZoom}>Reset</button>
    </div>
    <div class="image-container">
      <img
        src={imageData}
        alt="Preview"
        draggable="false"
        style="transform: scale({zoomLevel}) translate({imagePosition.x}px, {imagePosition.y}px);"
      />
    </div>
  </div>
</div>

<style>
  .preview-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: grab;
  }

  .modal-content {
    position: relative;
    background: white;
    border-radius: 8px;
    padding: 1rem;
    max-width: 80vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .controls button {
    background: #333;
    color: white;
    border: none;
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  .controls button:hover {
    background: #555;
  }

  .image-container {
    overflow: hidden;
  }
</style>