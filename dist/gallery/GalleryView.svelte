<script lang="ts">
  import { cartStore, cartActions } from './stores';
  import { likesStore } from './stores';
  import type { Drawing } from './GalleryContainer.svelte';
  import { createEventDispatcher } from 'svelte';

  export let drawing: Drawing;
  export let onLike: (id: string) => void;
  export let onPreview: (imageData: string) => void;
  export let on3DPreview: (imageData: string) => void;
  export let onOpenComments: (drawingId: string, drawingUuid: string) => void;

  const dispatch = createEventDispatcher();
  let likedStates: { [key: string]: boolean } = {};

  function handleLike(drawingId: string) {
    console.log('handleLike called with drawingId:', drawingId);
    likedStates = {
      ...likedStates,
      [drawingId]: !likedStates[drawingId]
    };
    onLike(drawingId);
  }

  function handlePreview(imageData: string) {
    console.log('handlePreview called with imageData:', imageData);
    onPreview(imageData);
  }

  function handle3DPreview(imageData: string) {
    console.log('handle3DPreview called with imageData:', imageData);
    on3DPreview(imageData);
  }

  function handleOpenComments(drawingId: string, drawingUuid: string) {
    console.log('handleOpenComments called with:', { drawingId, drawingUuid });
    onOpenComments(drawingId, drawingUuid);
  }

  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvYWRpbmc8L3RleHQ+PC9zdmc+';

  function isInCart(drawingId: string): boolean {
    return $cartStore.some(item => item.drawingId === drawingId);
  }

  function toggleCartItem(drawing: Drawing): void {
    console.log('toggleCartItem called with drawingId:', drawing.drawing_id);
    if (isInCart(drawing.drawing_id)) {
      cartActions.removeFromCart(drawing.drawing_id);
    } else {
      cartActions.addToCart(drawing);
    }
  }
</script>

<div class="gallery-item">
  <img
    src={placeholder}
    data-src={drawing.image_data}
    alt={`User drawing ${drawing.drawing_id}`}
    class="gallery-image"
    loading="lazy"
    on:click={() => handlePreview(drawing.image_data)}
    on:load={(e) => {
      const img = e.target as HTMLImageElement;
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    }}
  />

  <div class="gallery-meta">
    <div class="gallery-stats">
      <button class="like-button" on:click={() => handleLike(drawing.drawing_id)}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={likedStates[drawing.drawing_id] ? '#ff4757' : 'none'}
          stroke="#333"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>{$likesStore[drawing.drawing_id] || drawing.likes || 0}</span>
      </button>
    </div>
    <div class="drawing-card">
      <h3>{drawing.drawing_id}</h3>
      <p>Created: {new Date(drawing.created_at).toLocaleDateString()}</p>
      <button on:click={() => handleOpenComments(drawing.drawing_id, drawing.id)}>
        View Comments ({(drawing.comments || []).length})
      </button>
    </div>
    <div class="button-group">
      <button class="preview-button" on:click={() => handlePreview(drawing.image_data)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Preview
      </button>
      
      <button class="preview-button preview-3d" on:click={() => handle3DPreview(drawing.image_data)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/>
          <path d="M12 14a2 2 0 100-4 2 2 0 000 4z"/>
        </svg>
        3D View
      </button>
      
      <button 
        class="cart-button {isInCart(drawing.drawing_id) ? 'in-cart' : ''}" 
        on:click={() => toggleCartItem(drawing)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">
          {#if isInCart(drawing.drawing_id)}
            <path d="M9 20a1 1 0 100-2 1 1 0 000 2z" fill="#4CAF50"/>
            <path d="M20 20a1 1 0 100-2 1 1 0 000 2z" fill="#4CAF50"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="#4CAF50"/>
          {:else}
            <path d="M9 20a1 1 0 100-2 1 1 0 000 2z"/>
            <path d="M20 20a1 1 0 100-2 1 1 0 000 2z"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          {/if}
        </svg>
        {isInCart(drawing.drawing_id) ? 'Remove' : 'Add to Cart'}
      </button>

      <button 
        class="preview-button comments-button" 
        on:click={() => handleOpenComments(drawing.drawing_id, drawing.id)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
        </svg>
        Comments ({drawing.comments?.length || 0})
      </button>
    </div>
  </div>
</div>

<style>
  .drawing-card {
    max-width: 150px;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    background: #fff;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
  }

  p {
    margin: 0 0 0.5rem;
    color: #666;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }

  .gallery-item {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .gallery-image {
    width: 100%;
    height: 280px;
    object-fit: contain;
    background: #f8f9fa;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }

  .gallery-meta {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .gallery-stats {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .like-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .like-button:hover {
    background: #f8f9fa;
  }

  .like-button svg {
    transition: all 0.2s ease;
  }

  .like-button:hover svg {
    transform: scale(1.1);
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .preview-button, .cart-button, .comments-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 1px solid #eee;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .preview-button:hover, .cart-button:hover, .comments-button:hover {
    background: #f8f9fa;
    border-color: #ddd;
  }

  .preview-3d {
    background-color: #f1f8ff;
    border-color: #cce5ff;
  }

  .preview-3d:hover {
    background-color: #e1f0ff;
    border-color: #b8daff;
  }

  .comments-button {
    background-color: #fff3e0;
    border-color: #ffccbc;
  }

  .comments-button:hover {
    background-color: #ffe0b2;
    border-color: #ffab91;
  }

  .cart-button {
    background-color: #f5f5f5;
  }

  .cart-button.in-cart {
    background-color: #e8f5e9;
    border-color: #c8e6c9;
    color: #4CAF50;
  }

  .cart-button:hover {
    background-color: #ececec;
  }

  .cart-button.in-cart:hover {
    background-color: #d7ecd8;
  }

  @media (max-width: 768px) {
    .gallery-image {
      height: 200px;
    }

    .button-group {
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;
    }

    .gallery-meta {
      flex-direction: column;
      gap: 0.5rem;
    }

    .preview-button, .cart-button, .comments-button {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .gallery-item {
      width: 100%;
    }
  }
</style>