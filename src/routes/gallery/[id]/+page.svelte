<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import CommentsModal from '$lib/gallery/CommentsModal.svelte';

  interface Drawing {
    id: string; // UUID or TEXT from drawings.id
    drawing_id: string;
    image_data: string;
    user_email: string;
    created_at: string;
    likes: number;
    blocked: boolean;
  }

  let drawing: Drawing | null = null;
  let recentDrawingId: string | null = null;
  let loading = true;
  let error: string | null = null;
  let showComments = false;

  $: drawingId = $page.params.id;

  async function fetchDrawing() {
    loading = true;
    error = null;

    if (!drawingId) {
      error = 'Invalid drawing ID. Please check the URL.';
      console.error('Invalid drawing_id:', drawingId);
      loading = false;
      return;
    }

    try {
      const { data, error: fetchError, count } = await supabase
        .from('drawings')
        .select('id, drawing_id, image_data, user_email, created_at, likes, blocked', { count: 'exact' })
        .eq('drawing_id', drawingId)
        .eq('blocked', false);

      console.log('Fetch result:', { data, count, fetchError });

      if (fetchError) {
        throw new Error(`Failed to fetch drawing: ${fetchError.message}`);
      }

      if (!data || data.length === 0) {
        error = `Drawing #${drawingId} not found or is not available`;
        console.warn('No drawing found for drawing_id:', drawingId);
        drawing = null;
      } else if (data.length > 1) {
        error = 'Multiple drawings found with the same ID. Please contact support.';
        console.error('Multiple drawings returned:', data);
        drawing = null;
      } else {
        drawing = data[0];
        console.log('Fetched drawing:', drawing);
      }

      // Fetch a recent drawing for suggestion
      const { data: recentData } = await supabase
        .from('drawings')
        .select('drawing_id')
        .eq('blocked', false)
        .order('created_at', { ascending: false })
        .limit(1);

      recentDrawingId = recentData?.[0]?.drawing_id || null;
      console.log('Recent drawing ID:', recentDrawingId);
    } catch (err) {
      error = 'An error occurred while loading the drawing. Please try again later.';
      console.error('Error fetching drawing:', err);
      drawing = null;
    }

    loading = false;
  }

  function toggleComments() {
    showComments = !showComments;
    console.log('Comments modal toggled:', showComments);
  }

  function goToGallery() {
    console.log('Navigating to gallery');
    goto('/gallery');
  }

  function goToRecentDrawing() {
    if (recentDrawingId) {
      console.log('Navigating to recent drawing:', recentDrawingId);
      goto(`/gallery/${recentDrawingId}`);
    } else {
      goToGallery();
    }
  }

  onMount(() => {
    console.log('Gallery page mounted for drawing_id:', drawingId);
    fetchDrawing();
  });
</script>

<svelte:head>
  <title>Pexos - Drawing #{drawingId}</title>
  <meta name="description" content="View drawing #{drawingId} on Pexos, a collaborative creative platform." />
</svelte:head>

<div class="gallery-container">
  {#if loading}
    <div class="loading" role="status" aria-live="polite">
      <div class="spinner"></div>
      <p>Loading drawing...</p>
    </div>
  {:else if error}
    <div class="error-message" role="alert">
      {error}
      <div class="error-actions">
        <button class="retry-button" on:click={fetchDrawing}>Retry</button>
        {#if recentDrawingId}
          <button class="recent-button" on:click={goToRecentDrawing}>View Recent Drawing</button>
        {/if}
        <button class="gallery-button" on:click={goToGallery}>Back to Gallery</button>
      </div>
    </div>
  {:else if drawing}
    <div class="drawing-content" in:fade={{ duration: 500 }}>
      <h1>Drawing #{drawing.drawing_id}</h1>
      <div class="drawing-image">
        {#if drawing.image_data}
          <img src={drawing.image_data} alt="Drawing #{drawing.drawing_id}" />
        {:else}
          <p>No image data available</p>
        {/if}
      </div>
      <div class="drawing-meta">
        <p><strong>Created by:</strong> {drawing.user_email?.split('@')[0] || 'Anonymous'}</p>
        <p><strong>Created on:</strong> {new Date(drawing.created_at).toLocaleString()}</p>
        <p><strong>Likes:</strong> {drawing.likes}</p>
      </div>
      <button class="comments-button" on:click={toggleComments}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
    </div>
  {:else}
    <p class="no-drawing">Drawing not found.</p>
  {/if}
</div>

{#if showComments && drawing}
  <CommentsModal
    id={drawing.id}
    drawing_id={drawing.drawing_id}
    onClose={toggleComments}
  />
{/if}

<style>
  .gallery-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1c2526 100%);
    color: white;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
  }

  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    color: #ff6b6b;
    text-align: center;
    font-size: 1.2rem;
    margin: 2rem 0;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .retry-button, .gallery-button, .recent-button {
    padding: 0.5rem 1rem;
    background-color: #2a3435;
    border: 1px solid rgba(0, 123, 255, 0.2);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    color: white;
    transition: background-color 0.2s ease;
  }

  .retry-button:hover, .gallery-button:hover, .recent-button:hover {
    background-color: #3a4a4b;
  }

  .no-drawing {
    font-size: 1.2rem;
    text-align: center;
    margin: 2rem 0;
  }

  .drawing-content {
    max-width: 800px;
    width: 100%;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    color: white;
    text-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
    margin-bottom: 1.5rem;
  }

  .drawing-image {
    margin: 1rem 0;
    border: 1px solid rgba(0, 123, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.2);
  }

  .drawing-image img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .drawing-meta {
    background: #2a3435;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(0, 123, 255, 0.2);
    text-align: left;
  }

  .drawing-meta p {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: white;
  }

  .drawing-meta strong {
    color: #00cccc;
  }

  .comments-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #00cccc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }

  .comments-button:hover {
    background-color: #00b3b3;
  }

  @media (max-width: 768px) {
    .gallery-container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .drawing-meta {
      padding: 0.8rem;
    }

    .drawing-meta p {
      font-size: 0.95rem;
    }

    .comments-button {
      font-size: 0.9rem;
      padding: 0.4rem 0.8rem;
    }
  }
</style>