<script lang="ts">
  import GalleryGrid from './GalleryGrid.svelte';
  import GalleryControls from './GalleryControls.svelte';
  import ShoppingCart from './ShoppingCart.svelte';
  import { supabase } from '$lib/supabase';
  import { writable } from 'svelte/store';
  import { likesStore, cartStore, cartSize } from './stores';
  import { onMount } from 'svelte';

  // State management
  const drawings = writable<Drawing[]>([]);
  const error = writable<string | null>(null);
  const loading = writable(false);
  const showCart = writable(false);
  const pagination = writable({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 42
  });

  // Types
  export type Drawing = {
    id: string; // UUID
    drawing_id: string; // e.g., thijsvinke-1
    image_data: string | null;
    likes: number;
    created_at: string;
    user_id: string;
    user_email: string;
    blocked: boolean;
    title?: string;
  };

  async function fetchDrawings(page: number) {
    loading.set(true);
    error.set(null);

    const { itemsPerPage } = $pagination;
    const offset = (page - 1) * itemsPerPage;

    try {
      const { data, count, error: fetchError } = await supabase
        .from('drawings')
        .select('id, drawing_id, image_data, likes, created_at, user_id, user_email, blocked, title', { count: 'exact' })
        .eq('blocked', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + itemsPerPage - 1);

      if (fetchError) throw fetchError;

      const processedData = await Promise.all(
        (data || []).map(async (drawing) => {
          console.log('Fetched drawing:', { id: drawing.id, drawing_id: drawing.drawing_id, image_data: drawing.image_data });
          if (drawing.image_data && typeof drawing.image_data === 'string' && drawing.image_data.startsWith('drawings/')) {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('drawings')
              .createSignedUrl(drawing.image_data, 3600);
            if (signedError) {
              console.error('Signed URL error for drawing', drawing.id, signedError);
              return drawing;
            }
            return { ...drawing, image_data: signedData.signedUrl };
          }
          return drawing;
        })
      );

      drawings.set(processedData);
      pagination.update(p => ({
        ...p,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / itemsPerPage)
      }));

      likesStore.update(current => {
        const newLikes = { ...current };
        processedData.forEach(drawing => (newLikes[drawing.drawing_id] = drawing.likes));
        return newLikes;
      });
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'Failed to load drawings');
      console.error('Gallery error:', err);
    } finally {
      loading.set(false);
    }
  }

  async function handleLike(drawingId: string) {
    console.log('GalleryContainer handleLike called with drawingId:', drawingId);
    const previousLikes = $likesStore[drawingId] || 0;

    likesStore.update(current => ({
      ...current,
      [drawingId]: previousLikes + 1
    }));
    drawings.update(current =>
      current.map(d =>
        d.drawing_id === drawingId ? { ...d, likes: previousLikes + 1 } : d
      )
    );

    try {
      await supabase
        .from('drawings')
        .update({ likes: previousLikes + 1 })
        .eq('drawing_id', drawingId)
        .throwOnError();
    } catch (err) {
      console.error('Like update failed:', err);
      likesStore.update(current => ({
        ...current,
        [drawingId]: previousLikes
      }));
      drawings.update(current =>
        current.map(d =>
          d.drawing_id === drawingId ? { ...d, likes: previousLikes } : d
        )
      );
      error.set('Failed to update like. Please try again.');
    }
  }

  function handlePreview(imageData: string) {
    console.log('Preview image:', imageData);
    // Implement preview logic (e.g., open modal)
  }

  function handleOpenComments(drawingId: string, drawingUuid: string) {
    console.log('Open comments for:', { drawingId, drawingUuid });
    // Trigger CommentsModal opening
  }

  onMount(() => {
    fetchDrawings(1);
  });
</script>

<div class="gallery-container">
  <GalleryGrid
    drawings={$drawings}
    loading={$loading}
    error={$error}
    onLike={handleLike}
    onPreview={handlePreview}
    onOpenComments={handleOpenComments}
    onPageChange={fetchDrawings}
  />

  <GalleryControls
    currentPage={$pagination.currentPage}
    totalPages={$pagination.totalPages}
    onPageChange={fetchDrawings}
  />
  
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