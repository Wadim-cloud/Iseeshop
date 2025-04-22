<script lang="ts">
  import GalleryView from './GalleryView.svelte';
  import GalleryControls from './GalleryControls.svelte';
  import ShoppingCart from './ShoppingCart.svelte';
  import { supabase } from '$lib/supabase';
  import { writable } from 'svelte/store';
  import { likesStore, cartStore, cartSize } from './stores';

  // State management
  const drawings = writable<Drawing[]>([]);
  const error = writable<string | null>(null);
  const loading = writable(false);
  const selectedDrawing = writable<string | null>(null);
  const selected3DDrawing = writable<string | null>(null);
  const showCart = writable(false);
  const pagination = writable({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 40
  });

  // Types
  export type Drawing = {
    id: number;
    image_data: string;
    likes: number;
    created_at: string;
  };

  // Fetch drawings with pagination
  async function fetchDrawings(page: number) {
    loading.set(true);
    error.set(null);
    
    const { currentPage, itemsPerPage } = $pagination;
    const offset = (page - 1) * itemsPerPage;

    try {
      const { data, count, error: fetchError } = await supabase
        .from('drawings')
        .select('id, image_data, likes, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + itemsPerPage - 1);

      if (fetchError) throw fetchError;

      drawings.set(data || []);
      pagination.update(p => ({
        ...p,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / itemsPerPage)
      }));

      // Update likes store
      likesStore.update(current => {
        const newLikes = {...current};
        data?.forEach(drawing => newLikes[drawing.id] = drawing.likes);
        return newLikes;
      });

    } catch (err) {
      error.set(err instanceof Error ? err.message : 'Failed to load drawings');
      console.error('Gallery error:', err);
    } finally {
      loading.set(false);
    }
  }

  // Handle like action
  async function handleLike(drawingId: number) {
    likesStore.update(current => {
      const newLikes = {...current};
      newLikes[drawingId] = (newLikes[drawingId] || 0) + 1;
      return newLikes;
    });

    try {
      await supabase
        .from('drawings')
        .update({ likes: $likesStore[drawingId] })
        .eq('id', drawingId);
    } catch (err) {
      console.error('Like update failed:', err);
      // Rollback like on error
      likesStore.update(current => {
        const newLikes = {...current};
        newLikes[drawingId] = (newLikes[drawingId] || 1) - 1;
        return newLikes;
      });
    }
  }

  // Initial load
  fetchDrawings(1);
</script>

<div class="gallery-container">
  <GalleryView
    drawings={$drawings}
    loading={$loading}
    error={$error}
    selectedDrawing={$selectedDrawing}
    selected3DDrawing={$selected3DDrawing}
    onLike={handleLike}
    onPreview={(img) => selectedDrawing.set(img)}
    on3DPreview={(img) => selected3DDrawing.set(img)}
    onClosePreview={() => selectedDrawing.set(null)}
    onClose3DPreview={() => selected3DDrawing.set(null)}
  />

  <GalleryControls
    currentPage={$pagination.currentPage}
    totalPages={$pagination.totalPages}
    onPageChange={fetchDrawings}
  />
  
  <!-- Shopping Cart Component -->
  <ShoppingCart showCart={$showCart} />
</div>

<style>
  .gallery-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    position: relative;
  }
</style>