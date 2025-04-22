<!-- src/lib/gallery/GalleryItem.svelte -->
<script lang="ts">
    import { likesStore } from './GalleryContainer.svelte';
    import LikeButton from '$lib/ui/LikeButton.svelte';
    import PreviewButton from '$lib/ui/PreviewButton.svelte';
    
    export let drawing: {
      id: number;
      image_data: string;
      likes: number;
      created_at: string;
    };
    export let onLike: () => void;
    export let onPreview: () => void;
  </script>
  
  <div class="gallery-item">
    <img
      src={drawing.image_data}
      alt={`Drawing ${drawing.id}`}
      class="gallery-image"
      on:click={onPreview}
    />
    
    <div class="gallery-actions">
      <LikeButton 
        count={$likesStore[drawing.id] || drawing.likes} 
        onLike={onLike}
      />
      <PreviewButton onPreview={onPreview} />
    </div>
  </div>
  
  <style>
    .gallery-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
      background: white;
    }
  
    .gallery-item:hover {
      transform: translateY(-4px);
    }
  
    .gallery-image {
      width: 100%;
      height: 240px;
      object-fit: cover;
      cursor: pointer;
      display: block;
    }
  
    .gallery-actions {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: white;
    }
  
    @media (max-width: 768px) {
      .gallery-image {
        height: 180px;
      }
    }
  </style>