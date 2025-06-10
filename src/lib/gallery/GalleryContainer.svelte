<script lang="ts">
  import GalleryGrid from './GalleryGrid.svelte';
  import GalleryControls from './GalleryControls.svelte';
  import ShoppingCart from './ShoppingCart.svelte';
  import { supabase } from '$lib/supabase';
  import { writable } from 'svelte/store';
  import { likesStore, cartStore, cartSize, commentCounts, commentActions } from './stores';
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
      // Fetch total count of unblocked drawings
      const { count: totalCount, error: countError } = await supabase
        .from('drawings')
        .select('id', { count: 'exact', head: true })
        .eq('blocked', false);
      if (countError) {
        console.error('Count error:', countError);
        throw new Error(`Failed to fetch total count: ${countError.message}`);
      }
      console.log('Total drawings count:', totalCount);

      // Fetch drawings
      const { data: drawingsData, error: drawingsError } = await supabase
        .from('drawings')
        .select('id, drawing_id, image_data, likes, created_at, user_id, user_email, blocked, title')
        .eq('blocked', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + itemsPerPage - 1);
      if (drawingsError) {
        console.error('Drawings fetch error:', drawingsError);
        throw new Error(`Failed to fetch drawings: ${drawingsError.message}`);
      }
      console.log('Fetched drawings:', drawingsData);

      // Fetch comment counts using raw SQL
      const drawingIds = drawingsData.map(d => d.id);
      console.log('Drawing IDs for comments query:', drawingIds);
      const { data: commentsData, error: commentsError } = await supabase
        .rpc('get_comment_counts', { drawing_ids: drawingIds });
      if (commentsError) {
        console.error('Comments RPC error:', commentsError);
        throw new Error(`Failed to fetch comment counts: ${commentsError.message}`);
      }
      console.log('Fetched comment counts:', commentsData);

      // Create a map of drawing_id to comment count
      const commentCountMap = Object.fromEntries(
        commentsData.map(item => [item.drawing_id, item.comment_count])
      );
      console.log('Comment count map:', commentCountMap);

      const processedData = await Promise.all(
        (drawingsData || []).map(async (drawing) => {
          console.log('Processing drawing:', { id: drawing.id, drawing_id: drawing.drawing_id, image_data: drawing.image_data });
          if (drawing.image_data && typeof drawing.image_data === 'string' && drawing.image_data.startsWith('drawings/')) {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('drawings')
              .createSignedUrl(drawing.image_data, 3600);
            if (signedError) {
              console.error('Signed URL error for drawing', drawing.id, signedError);
              return { ...drawing, image_data: null };
            }
            return { ...drawing, image_data: signedData.signedUrl };
          }
          return { ...drawing, image_data: drawing.image_data || null };
        })
      );

      console.log('Processed drawings:', processedData);
      drawings.set(processedData);
      pagination.update(p => ({
        ...p,
        currentPage: page,
        totalPages: Math.ceil((totalCount || 0) / itemsPerPage)
      }));

      likesStore.update(current => {
        const newLikes = { ...current };
        processedData.forEach(drawing => (newLikes[drawing.drawing_id] = drawing.likes));
        return newLikes;
      });

      commentCounts.update(current => {
        const newCounts = { ...current };
        processedData.forEach(drawing => (newCounts[drawing.id] = commentCountMap[drawing.id] || 0));
        return newCounts;
      });
      console.log('Updated commentCounts:', $commentCounts);
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'Failed to load drawings');
      console.error('Gallery fetch error:', err);
      drawings.set([]);
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

  async function handleOpenComments(drawingId: string, drawingUuid: string) {
    console.log('Open comments for:', { drawingId, drawingUuid });
    try {
      const { data: comments, count, error: commentsError } = await supabase
        .from('comments')
        .select('id, content, created_at, display_name, user_id, reactions', { count: 'exact' })
        .eq('drawing_id', drawingUuid);
      if (commentsError) throw commentsError;

      commentActions.setCommentCount(drawingUuid, count || 0);

      async function addComment(content: string, displayName: string, userId: string) {
        const { data, error: insertError } = await supabase
          .from('comments')
          .insert({ drawing_id: drawingUuid, content, display_name: displayName, user_id: userId })
          .select()
          .single();
        if (insertError) throw insertError;

        commentActions.incrementCommentCount(drawingUuid);
        return data;
      }

      console.log('Comments fetched:', comments, 'Count:', count);
    } catch (err) {
      console.error('Failed to fetch or update comments:', err);
      error.set('Failed to load or add comment. Please try again.');
    }
  }

  function handlePreview(imageData: string) {
    console.log('Preview image:', imageData);
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