<script lang="ts">
    import type { Writable } from 'svelte/store';
  
    export let onSave: (canvas: HTMLCanvasElement) => void;
    export let onMenuToggle: () => void;
    export let canvasStore: Writable<{ canvas: HTMLCanvasElement | null }>;
  
    let canvas: HTMLCanvasElement | null = null;
  
    canvasStore.subscribe(state => {
      canvas = state.canvas;
      console.log('Canvas updated in DrawingControls:', !!canvas);
    });
  
    function handleSave() {
      if (canvas) {
        onSave(canvas);
      } else {
        console.error('Canvas not available');
      }
    }
  </script>
  
  <div class="controls">
    <button class="control-button" on:click={onMenuToggle} aria-label="Toggle menu">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    </button>
  
    <button class="control-button" on:click={handleSave} aria-label="Save drawing">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    </button>
  
    <button class="control-button" on:click={() => window.history.back()} aria-label="Go back">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    </button>
  </div>
  
  <style>
    .controls {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}
  
    .control-button {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: white;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
  
    .control-button:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .control-button:active {
      transform: translateY(0);
    }
  
    .control-button svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  
    @media (max-width: 768px) {
      .controls {
        top: 3rem;
        left: 9rem;
      }
  
      .control-button {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  </style>