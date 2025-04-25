<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte'; // Ensure this import is present
  // Fallback for IconButton if missing
  // import IconButton from '$lib/ui/IconButton.svelte';
  // import { close } from '$lib/ui/icon.js';

  export let imageData: string;
  export let onClose: () => void;

  let modalElement: HTMLElement;
  let closeButton: HTMLButtonElement;
  let zoomLevel = 1;

  onMount(() => {
      console.log('PreviewModal mounted with imageData:', imageData);
      if (modalElement) {
          closeButton?.focus();

          const focusableElements = modalElement.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusable = focusableElements[0] as HTMLElement;
          const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

          const trapFocus = (e: KeyboardEvent) => {
              if (e.key === 'Tab') {
                  if (e.shiftKey && document.activeElement === firstFocusable) {
                      e.preventDefault();
                      lastFocusable.focus();
                  } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                      e.preventDefault();
                      firstFocusable.focus();
                  }
              }
          };

          modalElement.addEventListener('keydown', trapFocus);
          return () => modalElement.removeEventListener('keydown', trapFocus);
      }
  });

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
          onClose();
      }
  }

  function zoomIn() {
      zoomLevel = Math.min(zoomLevel + 0.2, 3);
  }

  function zoomOut() {
      zoomLevel = Math.max(zoomLevel - 0.2, 1);
  }

  function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      zoomLevel = Math.min(Math.max(zoomLevel + delta, 1), 3);
  }
</script>

{#if imageData}
  <div
      class="preview-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Drawing preview"
      bind:this={modalElement}
      on:keydown={handleKeydown}
      on:wheel={handleWheel}
      transition:fade={{ duration: 200 }}
  >
      <div class="preview-content">
          <!-- Fallback close button if IconButton is missing -->
          <button
              class="close-button"
              on:click={onClose}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
              aria-label="Close preview"
              bind:this={closeButton}
          >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
          </button>
          <!-- Original IconButton (uncomment if confirmed working) -->
          <!--
          <IconButton
              icon={close}
              on:click={onClose}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
              class="close-button"
              ariaLabel="Close preview"
              bind:element={closeButton}
          />
          -->
          <div class="controls">
              <button
                  on:click={zoomOut}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && zoomOut()}
                  aria-label="Zoom out"
              >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="7" y1="11" x2="15" y2="11" />
                  </svg>
              </button>
              <button
                  on:click={zoomIn}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && zoomIn()}
                  aria-label="Zoom in"
              >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="11" y1="7" x2="11" y2="15" />
                      <line x1="7" y1="11" x2="15" y2="11" />
                  </svg>
              </button>
          </div>
          <div class="image-container">
              <img
                  src={imageData}
                  alt="Drawing preview"
                  style="transform: scale({zoomLevel});"
                  transition:fade={{ duration: 100 }}
                  on:error={() => console.error('Image load error:', imageData)}
              />
          </div>
      </div>
  </div>
{/if}

<style>
  .preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000; /* Increased to avoid conflicts */
      overflow: auto;
  }

  .preview-content {
      position: relative;
      width: 90vw;
      height: 90vh;
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
  }

  .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
  }

  .image-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.2s ease;
  }

  .close-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background: white;
      border-radius: 4px;
      padding: 4px;
      border: none;
      cursor: pointer;
      z-index: 10001;
  }

  .controls {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      gap: 8px;
      z-index: 10001;
  }

  .controls button {
      background: white;
      border: none;
      border-radius: 4px;
      padding: 4px;
      cursor: pointer;
  }

  .controls button:hover,
  .close-button:hover {
      background: #f0f0f0;
  }
</style>