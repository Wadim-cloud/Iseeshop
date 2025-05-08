<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { user } from '$lib/utils/auth';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import AuthModal from '$lib/AuthModal.svelte';

  export let show: boolean;

  type Comment = {
    id: string; // UUID from comments.id
    drawing_id: string; // UUID or TEXT from drawings.id
    user_id: string;
    content: string;
    created_at: string;
    display_name?: string;
    reactions: { user_id: string; created_at: string }[];
  };

  let comments: Comment[] = [];
  let drawings: { id: string; drawing_id: string }[] = [];
  let selectedDrawingId: string = '';
  let newComment = '';
  let loading = false;
  let reactionLoading: string | null = null;
  let error: string | null = null;
  let showAuthModal = false;

  function getDisplayName(userId: string): string {
    if ($user && $user.id === userId && $user.email) {
      return $user.email.split('@')[0];
    }
    return userId.slice(0, 8);
  }

  async function fetchComments() {
    loading = true;
    error = null;

    try {
      const { data: drawingsData, error: drawingsError } = await supabase
        .from('drawings')
        .select('id, drawing_id')
        .eq('blocked', false)
        .order('created_at', { ascending: false });

      if (drawingsError) {
        throw new Error(`Failed to load drawings: ${drawingsError.message}`);
      }

      drawings = drawingsData.map(d => ({ id: d.id, drawing_id: d.drawing_id }));
      selectedDrawingId = drawings[0]?.drawing_id || ''; // Use drawing_id

      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('id, drawing_id, user_id, content, created_at, display_name, reactions')
        .order('created_at', { ascending: false });

      if (commentsError) {
        throw new Error(`Failed to load comments: ${commentsError.message}`);
      }

      comments = commentsData.map(comment => ({
        ...comment,
        display_name: comment.display_name || getDisplayName(comment.user_id),
        reactions: Array.isArray(comment.reactions) ? comment.reactions : []
      }));

      console.log('Fetched comments:', comments);
    } catch (err) {
      error = `Unexpected error loading comments: ${err.message}`;
      console.error('Unexpected error in fetchComments:', err);
      comments = [];
      drawings = [];
    }
    loading = false;
  }

  async function postComment() {
    if (!$user || !newComment.trim() || !selectedDrawingId) {
      error = 'Please select a drawing and enter a comment';
      return;
    }

    loading = true;
    error = null;

    try {
      const drawing = drawings.find(d => d.drawing_id === selectedDrawingId); // Use drawing_id
      if (!drawing) {
        throw new Error('Selected drawing not found');
      }

      const newCommentObj: Omit<Comment, 'id' | 'created_at' | 'reactions'> = {
        drawing_id: drawing.id, // Store drawings.id in comments
        user_id: $user.id,
        content: newComment.trim(),
        display_name: $user.email?.split('@')[0] || $user.id.slice(0, 8)
      };

      const { error: insertError } = await supabase
        .from('comments')
        .insert([newCommentObj]);

      if (insertError) {
        throw new Error(`Failed to post comment: ${insertError.message}`);
      }

      console.log('Comment posted successfully');
      newComment = '';
      await fetchComments();
    } catch (err) {
      error = `Error posting comment: ${err.message}`;
      console.error('Error posting comment:', err);
    }

    loading = false;
  }

  async function handleReact(commentId: string) {
    if (!$user) {
      localStorage.setItem('sb-redirect', window.location.pathname);
      showAuthModal = true;
      return;
    }

    reactionLoading = commentId;
    error = null;

    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) throw new Error('Comment not found');

      const hasReacted = comment.reactions.some(r => r.user_id === $user.id);
      let updatedReactions: { user_id: string; created_at: string }[];

      if (hasReacted) {
        updatedReactions = comment.reactions.filter(r => r.user_id !== $user.id);
      } else {
        updatedReactions = [
          ...comment.reactions,
          { user_id: $user.id, created_at: new Date().toISOString() }
        ];
      }

      const { error: updateError } = await supabase
        .from('comments')
        .update({ reactions: updatedReactions })
        .eq('id', commentId);

      if (updateError) {
        throw new Error(`Failed to update reactions: ${updateError.message}`);
      }

      comments = comments.map(c =>
        c.id === commentId ? { ...c, reactions: updatedReactions } : c
      );
      console.log('Reaction updated successfully');
    } catch (err) {
      error = `Failed to react to comment: ${err.message}`;
      console.error('Reaction error:', err);
    } finally {
      reactionLoading = null;
    }
  }

  function navigateToDrawing(drawingId: string) {
    if (!drawingId || typeof drawingId !== 'string' || drawingId.trim() === '') {
      console.error('Invalid drawingId:', drawingId);
      error = 'Cannot navigate: Invalid drawing ID';
      return;
    }
    console.log('Navigating to drawing:', drawingId);
    goto(`/gallery/${drawingId}`); // drawingId is drawings.drawing_id
    show = false;
  }

  function handleLoginPrompt() {
    console.log('Login prompt triggered');
    localStorage.setItem('sb-redirect', window.location.pathname);
    showAuthModal = true;
  }

  $: if (show) {
    console.log('Comments modal opened, fetching comments');
    fetchComments();
  }
</script>

{#if show}
  <div class="comment-modal-container" transition:fade={{ duration: 300 }}>
    <div class="modal" transition:fly={{ y: 100, duration: 400 }}>
      <button
        class="close-button"
        on:click={() => {
          console.log('Close comment modal clicked');
          show = false;
          error = null;
        }}
        aria-label="Close comment modal"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <h2>Recent Comments</h2>

      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
        </div>
      {:else if error}
        <div class="error-message" role="alert">{error}</div>
        <button class="retry-button" on:click={fetchComments}>Retry</button>
      {:else if comments.length === 0}
        <p class="no-comments">No comments yet.</p>
      {:else}
        <div class="comment-list">
          {#each comments as comment (comment.id)}
            <div class="comment-item">
              <div class="comment-header">
                <span class="username">{comment.display_name || 'Anonymous'}</span>
                <span class="timestamp">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p class="comment-content">{comment.content}</p>
              <div class="comment-actions">
                <button
                  class="react-button"
                  on:click={() => handleReact(comment.id)}
                  disabled={reactionLoading === comment.id}
                  aria-label={comment.reactions.some(r => r.user_id === $user?.id) ? 'Unlike comment' : 'Like comment'}
                >
                  {#if reactionLoading === comment.id}
                    <div class="spinner small"></div>
                  {:else}
                    <span class="heart">{comment.reactions.some(r => r.user_id === $user?.id) ? '❤️' : '🤍'}</span>
                    {comment.reactions.length}
                  {/if}
                </button>
                <button
                  class="view-drawing"
                  on:click={() => navigateToDrawing(drawings.find(d => d.id === comment.drawing_id)?.drawing_id || '')}
                  aria-label="View drawing"
                >
                  View Drawing
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if $user}
        <div class="comment-form">
          {#if drawings.length > 0}
            <select bind:value={selectedDrawingId} disabled={loading}>
              <option value="" disabled>Select a drawing</option>
              {#each drawings as drawing}
                <option value={drawing.drawing_id}>Drawing #{drawing.drawing_id}</option>
              {/each}
            </select>
          {:else}
            <p>No drawings available to comment on.</p>
          {/if}
          <textarea
            bind:value={newComment}
            placeholder="Add a comment..."
            rows="4"
            disabled={loading || drawings.length === 0}
          ></textarea>
          <button
            class="comment-button"
            on:click={postComment}
            disabled={loading || !newComment.trim() || !selectedDrawingId}
          >
            Post Comment
          </button>
        </div>
      {:else}
        <p>
          Please <button class="link-button" on:click={handleLoginPrompt}>log in</button> to post a comment or react.
        </p>
      {/if}
    </div>
  </div>
{/if}

{#if showAuthModal}
  <AuthModal
    bind:show={showAuthModal}
    on:authSuccess={() => {
      console.log('Auth success, refreshing comments');
      showAuthModal = false;
      fetchComments();
    }}
    on:authError={({ detail }) => {
      console.log('Auth error:', detail.message);
      error = detail.message;
      showAuthModal = false;
    }}
  />
{/if}

<style>
  .comment-modal-container {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 100%;
    max-width: 600px;
    z-index: 1000;
    display: flex;
    align-items: flex-end;
  }

  .modal {
    background: #1c2526;
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    position: relative;
    box-shadow: 0 0 30px rgba(0, 123, 255, 0.3);
    border: 1px solid rgba(0, 123, 255, 0.2);
    max-height: 50vh;
    overflow-y: auto;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    transition: transform 0.3s ease;
  }

  .close-button:hover {
    transform: rotate(90deg);
  }

  h2 {
    font-family: 'Stanley', sans-serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: white;
    text-align: center;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }

  .spinner.small {
    width: 16px;
    height: 16px;
    border-width: 2px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .no-comments {
    color: white;
    text-align: center;
    font-size: 1rem;
    margin: 2rem 0;
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .comment-item {
    background: #2a3435;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(0, 123, 255, 0.2);
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .username {
    color: #00cccc;
    font-weight: 600;
  }

  .timestamp {
    color: #888;
    font-size: 0.85rem;
  }

  .comment-content {
    color: white;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .comment-actions {
    display: flex;
    gap: 1rem;
  }

  .react-button, .view-drawing {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.3s ease;
  }

  .react-button:hover, .view-drawing:hover {
    color: #00cccc;
  }

  .react-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .heart {
    font-size: 1.2rem;
  }

  .view-drawing {
    text-decoration: underline;
  }

  .error-message {
    margin-top: 1rem;
    color: #ff6b6b;
    text-align: center;
    font-weight: 500;
  }

  .retry-button {
    padding: 0.25rem 0.5rem;
    background-color: #2a3435;
    border: 1px solid rgba(0, 123, 255, 0.2);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    color: white;
    margin: 0.5rem auto;
    display: block;
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .comment-form select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid rgba(0, 123, 255, 0.2);
    border-radius: 4px;
    background: #2a3435;
    color: white;
    font-size: 0.9rem;
  }

  .comment-form textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid rgba(0, 123, 255, 0.2);
    border-radius: 4px;
    resize: vertical;
    font-size: 0.9rem;
    background: #2a3435;
    color: white;
  }

  .comment-button {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    background-color: #00cccc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .comment-button:hover {
    background-color: #00b3b3;
  }

  .comment-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .link-button {
    background: none;
    border: none;
    color: #00cccc;
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: underline;
    padding: 0;
  }

  .link-button:hover {
    color: #00b3b3;
  }

  @media (max-width: 768px) {
    .comment-modal-container {
      bottom: 10px;
      left: 10px;
      max-width: 95%;
    }
    .modal {
      padding: 1.5rem;
      max-height: 60vh;
    }
    h2 {
      font-size: 1.5rem;
    }
    .comment-item {
      padding: 0.8rem;
    }
    .comment-content {
      font-size: 0.95rem;
    }
    .react-button, .view-drawing {
      font-size: 0.85rem;
    }
  }
</style>