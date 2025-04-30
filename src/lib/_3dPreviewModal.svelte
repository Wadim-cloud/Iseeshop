<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import IconButton from '$lib/ui/IconButton.svelte';
  import { close } from '$lib/ui/icon.js';
  import TshirtModel from '$lib/models/tshirt.svelte';

  export let imageData: string;
  export let onClose: () => void;

  let modalElement: HTMLElement;
  let closeButton: HTMLButtonElement;
  let isFullScreen = false;

  onMount(() => {
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

  function toggleFullScreen() {
    isFullScreen = !isFullScreen;
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
    transition:fade={{ duration: 200 }}
    class:full-screen={isFullScreen}
  >
    <div class="preview-content">
      <IconButton
        icon={close}
        on:click={onClose}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
        class="close-button"
        ariaLabel="Close preview"
        bind:element={closeButton}
      />
      <button
        class="fullscreen-button"
        on:click={toggleFullScreen}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFullScreen()}
        aria-label={isFullScreen ? 'Exit full-screen' : 'Enter full-screen'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
          {#if isFullScreen}
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          {:else}
            <path d="M8 3H3v5m13-5h5v5m0 11v5h-5m-11 0H3v-5" />
          {/if}
        </svg>
      </button>
      <div class="tshirt-container">
        <TshirtModel imageTexture={imageData} />
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
    z-index: 1000;
    overflow: auto;
  }

  .preview-content {
    position: relative;
    width: 180px;
    height: 180px;
    background-color: white;
    border-radius: 10px;
    padding: 0.5rem;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview-modal.full-screen .preview-content {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
    padding: 0;
    background: none;
  }

  .tshirt-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview-modal.full-screen .tshirt-container {
    height: 100%;
    width: 100%;
  }

  .close-button {
    position: absolute;
    top: 4px;
    right: 4px;
    background: white;
    border-radius: 4px;
    padding: 2px;
    z-index: 1001;
  }

  .fullscreen-button {
    position: absolute;
    top: 4px;
    right: 30px;
    background: white;
    border: none;
    border-radius: 4px;
    padding: 2px;
    cursor: pointer;
    z-index: 1001;
  }

  .fullscreen-button:hover,
  .close-button:hover {
    background: #f0f0f0;
  }
</style>
