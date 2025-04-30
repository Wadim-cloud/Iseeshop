<script lang="ts">
  import { likesStore } from './stores';
  import type { Drawing } from './GalleryContainer.svelte';
  
  export let drawings: Drawing[];
  export let onLike: (id: number) => void;
  export let onPreview: (imageData: string) => void;
  export let on3DPreview: (imageData: string) => void; // New prop for 3D preview

  // Thumbnail placeholder for loading images
  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvYWRpbmc8L3RleHQ+PC9zdmc+';
</script>

<div class="gallery-grid">
{#each drawings as drawing (drawing.id)}
  <div class="gallery-item">
    <!-- Image with lazy loading -->
    <img
      src={placeholder}
      data-src={drawing.image_data}
      alt={`User drawing ${drawing.id}`}
      class="gallery-image"
      loading="lazy"
      on:click={() => onPreview(drawing.image_data)}
      on:load={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      }}
    />

    <!-- Drawing metadata -->
    <div class="gallery-meta">
      <div class="gallery-stats">
        <button class="like-button" on:click={() => onLike(drawing.id)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={$likesStore[drawing.id] ? '#ff4757' : 'none'} stroke="#333">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>{$likesStore[drawing.id] || drawing.likes}</span>
        </button>
      </div>

      <div class="button-group">
        <button class="preview-button" on:click={() => onPreview(drawing.image_data)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </button>
        
        <!-- New 3D Preview Button -->
        <button class="preview-button preview-3d" on:click={() => on3DPreview(drawing.image_data)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/>
            <path d="M12 14a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
          3D View
        </button>
      </div>
    </div>
  </div>
{/each}
</div>

<style>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
  width: 100%;
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
}

.preview-button {
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

.preview-button:hover {
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

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

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
  
  .preview-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>