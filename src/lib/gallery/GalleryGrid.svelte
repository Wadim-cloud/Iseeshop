<script lang="ts">
  import GalleryView from './GalleryView.svelte';
  import PreviewModal from './PreviewModal.svelte';
  import TshirtPreviewModal from './TshirtPreviewModal.svelte';
  import CommentsModal from './CommentsModal.svelte';
  import type { Drawing } from './GalleryContainer.svelte';
  import { writable } from 'svelte/store';

  export let drawings: Drawing[];
  export let loading: boolean;
  export let error: string | null;
  export let onLike: (id: string) => void;
  export let onPreview: (img: string) => void;
  export let onOpenComments: (drawingId: string, drawingUuid: string) => void;
  export let onPageChange: (page: number) => void;

  // Modal states
  const selectedDrawing = writable<string | null>(null);
  const selected3DDrawing = writable<string | null>(null);
  let selectedDrawingId: string | null = null;
  let selectedDrawingPublicId: string | null = null;

  function handlePreview(img: string) {
    console.log('GalleryGrid handlePreview setting selectedDrawing:', img);
    selectedDrawing.set(img);
  }

  function handleClosePreview() {
    console.log('GalleryGrid handleClosePreview resetting selectedDrawing');
    selectedDrawing.set(null);
  }

  function handle3DPreview(img: string) {
    console.log('GalleryGrid handle3DPreview setting selected3DDrawing:', img);
    selected3DDrawing.set(img);
  }

  function handleClose3DPreview() {
    console.log('GalleryGrid handleClose3DPreview resetting selected3DDrawing');
    selected3DDrawing.set(null);
  }

  function handleOpenComments(drawingId: string, drawingUuid: string) {
    console.log('GalleryGrid handleOpenComments setting IDs:', { drawingId, drawingUuid });
    selectedDrawingId = drawingUuid;
    selectedDrawingPublicId = drawingId;
  }

  function handleCloseComments() {
    console.log('GalleryGrid handleCloseComments resetting IDs');
    selectedDrawingId = null;
    selectedDrawingPublicId = null;
  }
</script>

<div class="gallery-wrapper">
  {#if loading}
    <div class="loading">Loading gallery...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if drawings.length === 0}
    <div class="no-content">No drawings available.</div>
  {:else}
    <div class="gallery-grid">
      {#each drawings as drawing (drawing.id)}
        <GalleryView
          drawing={drawing}
          onLike={onLike}
          onPreview={handlePreview}
          on3DPreview={handle3DPreview}
          onOpenComments={handleOpenComments}
        />
      {/each}
    </div>
  {/if}

  {#if $selectedDrawing}
    <PreviewModal imageData={$selectedDrawing} onClose={handleClosePreview} />
  {/if}

  {#if $selected3DDrawing}
    <TshirtPreviewModal imageData={$selected3DDrawing} onClose={handleClose3DPreview} />
  {/if}

  {#if selectedDrawingId && selectedDrawingPublicId}
    <CommentsModal
      id={selectedDrawingId}
      drawing_id={selectedDrawingPublicId}
      onClose={handleCloseComments}
    />
  {/if}
</div>

<style>
  .gallery-wrapper {
    position: relative;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    padding: 1rem 0;
    width: 100%;
  }

  .loading, .error, .no-content {
    padding: 2rem;
    text-align: center;
    width: 100%;
  }

  .error {
    color: #e74c3c;
  }

  @media (max-width: 768px) {
    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .gallery-grid {
      grid-template-columns: 1fr;
    }
  }
</style>