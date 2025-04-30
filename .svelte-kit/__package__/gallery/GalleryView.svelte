<script lang="ts">
  import GalleryGrid from './GalleryGrid.svelte';
  import TShirtPreviewModal from './TshirtPreviewModal.svelte';
  import type { Drawing } from './GalleryContainer.svelte';
  
  export let drawings: Drawing[];
  export let loading: boolean;
  export let error: string | null;
  export let selectedDrawing: string | null;
  export let selected3DDrawing: string | null; // New state for 3D preview
  export let onLike: (id: number) => void;
  export let onPreview: (img: string) => void;
  export let on3DPreview: (img: string) => void; // New handler for 3D preview
  export let onClosePreview: () => void;
  export let onClose3DPreview: () => void; // New handler to close 3D preview
</script>

<div class="gallery-view">
  {#if loading}
      <div class="gallery-loading">
          <div class="loading-spinner"></div>
          <p>Loading gallery items...</p>
      </div>
  {:else if error}
      <div class="gallery-error">
          <p>Error: {error}</p>
          <button on:click={() => window.location.reload()}>Retry</button>
      </div>
  {:else if drawings.length === 0}
      <div class="gallery-empty">
          <p>No drawings found. Be the first to create one!</p>
      </div>
  {:else}
      <GalleryGrid
          {drawings}
          onLike={onLike}
          onPreview={onPreview}
          on3DPreview={on3DPreview}
      />
  {/if}
  
  {#if selectedDrawing}
      <div class="preview-modal">
          <div class="preview-modal-content">
              <button class="close-button" on:click={onClosePreview}>×</button>
              <img src={selectedDrawing} alt="Drawing preview" />
          </div>
      </div>
  {/if}
  
  {#if selected3DDrawing}
      <TShirtPreviewModal 
          imageData={selected3DDrawing} 
          on:close={onClose3DPreview} 
      />
  {/if}
</div>

<style>
  .gallery-view {
      position: relative;
  }
  
  .gallery-loading,
  .gallery-error,
  .gallery-empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
  }
  
  .loading-spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #767676;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
  }
  
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  
  .gallery-error button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: #f1f1f1;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
  }
  
  .preview-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 20px;
  }
  
  .preview-modal-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
  }
  
  .preview-modal-content img {
      display: block;
      max-width: 100%;
      max-height: 90vh;
      margin: 0 auto;
      border-radius: 4px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .close-button {
      position: absolute;
      top: -15px;
      right: -15px;
      width: 30px;
      height: 30px;
      background: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
  }
</style>