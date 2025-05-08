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
  <div class="image-container">
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
    <button class="like-button-overlay" on:click|stopPropagation={() => handleLike(drawing.drawing_id)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={likedStates[drawing.drawing_id] ? '#ff4757' : 'none'}
        stroke={likedStates[drawing.drawing_id] ? '#ff4757' : '#ffffff'}
        stroke-width="2"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span class="like-count">{$likesStore[drawing.drawing_id] || drawing.likes || 0}</span>
    </button>
  </div>

  <div class="gallery-content">
    <div class="drawing-info">
      <h3 class="drawing-title">{drawing.drawing_id}</h3>
      <p class="drawing-date">Created: {new Date(drawing.created_at).toLocaleDateString()}</p>
    </div>
    
    <div class="action-buttons">
      <div class="button-row">
        <button class="action-button preview-button" on:click={() => handlePreview(drawing.image_data)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Preview</span>
        </button>
        
        <button class="action-button preview-3d" on:click={() => handle3DPreview(drawing.image_data)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/>
            <path d="M12 14a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
          <span>3D View</span>
        </button>
      </div>
      
      <div class="button-row">
        <button 
          class="action-button comments-button" 
          on:click={() => handleOpenComments(drawing.drawing_id, drawing.id)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
          <span>Comments ({drawing.comments?.length || 0})</span>
        </button>
        
        <button 
          class="action-button cart-button {isInCart(drawing.drawing_id) ? 'in-cart' : ''}" 
          on:click={() => toggleCartItem(drawing)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 20a1 1 0 100-2 1 1 0 000 2z"/>
            <path d="M20 20a1 1 0 100-2 1 1 0 000 2z"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          <span>{isInCart(drawing.drawing_id) ? 'Remove from Cart' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .gallery-item {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  .image-container {
    position: relative;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
  }

  .gallery-image {
    width: 100%;
    height: 280px;
    object-fit: contain;
    background: #f8f9fa;
    cursor: pointer;
    transition: transform 0.3s ease;
    display: block;
  }

  .gallery-image:hover {
    transform: scale(1.03);
  }

  .like-button-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 20px;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 2;
    color: white;
  }

  .like-button-overlay:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.05);
  }

  .like-count {
    font-weight: 600;
    font-size: 14px;
  }

  .gallery-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }

  .drawing-info {
    flex: 1;
  }

  .drawing-title {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .drawing-date {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button-row {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .button-row .action-button {
    flex: 1;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: #ffffff;
    color: #555;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .action-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  .preview-button {
    background-color: #f8f9fa;
    border-color: #e2e8f0;
    color: #4a5568;
  }

  .preview-button:hover {
    background-color: #edf2f7;
    border-color: #cbd5e0;
  }

  .preview-3d {
    background-color: #ebf8ff;
    border-color: #bee3f8;
    color: #3182ce;
  }

  .preview-3d:hover {
    background-color: #d6ebfd;
    border-color: #90cdf4;
  }

  .comments-button {
    background-color: #fffaf0;
    border-color: #feebc8;
    color: #dd6b20;
  }

  .comments-button:hover {
    background-color: #fef0e1;
    border-color: #fbd38d;
  }

  .cart-button {
    background-color: #f7fafc;
    border-color: #e2e8f0;
    color: #4a5568;
  }

  .cart-button:hover {
    background-color: #edf2f7;
    border-color: #cbd5e0;
  }

  .cart-button.in-cart {
    background-color: #4CAF50;
    border-color: #43a047;
    color: white;
  }

  .cart-button.in-cart:hover {
    background-color: #43a047;
    border-color: #388e3c;
  }

  @media (max-width: 768px) {
    .button-row {
      flex-direction: column;
    }

    .gallery-image {
      height: 220px;
    }
  }

  @media (max-width: 480px) {
    .gallery-item {
      border-radius: 8px;
    }

    .image-container {
      border-radius: 8px 8px 0 0;
    }

    .gallery-content {
      padding: 12px;
    }

    .action-button {
      padding: 8px;
      font-size: 13px;
    }

    .like-button-overlay {
      top: 8px;
      right: 8px;
      padding: 4px 8px;
    }
  }
</style>