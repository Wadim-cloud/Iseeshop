<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { user } from '$lib/utils/auth';
  import { onMount } from 'svelte';
  import AuthModal from '$lib/AuthModal.svelte';

  export let id: string | undefined; // UUID or TEXT from drawings.id
  export let drawing_id: string | undefined; // Public-facing drawing_id for display
  export let onClose: () => void;

  type Comment = {
    id: string; // UUID from comments.id
    user_id: string;
    content: string;
    created_at: string;
    display_name?: string;
  };

  let comments: Comment[] = [];
  let newComment = '';
  let loading = false;
  let error: string | null = null;
  let showAuthModal = false;

  // Validate props
  if (!id || !drawing_id) {
    error = 'Invalid drawing ID or UUID';
    console.error('CommentsModal mounted with invalid props:', { id, drawing_id });
  } else {
    console.log('CommentsModal mounted with props:', {
      id,
      drawing_id,
      idLength: id?.length,
      userId: $user?.id,
      userEmail: $user?.email
    });
  }

  // Get display name from user store
  function getDisplayName(userId: string): string {
    if ($user && $user.id === userId && $user.email) {
      return $user.email.split('@')[0];
    }
    return userId.slice(0, 8);
  }

  // Fetch comments from the new comments table
  async function fetchComments() {
    if (!id) {
      error = 'Cannot load comments: Missing drawing UUID';
      console.error('fetchComments called with invalid id:', id);
      return;
    }

    loading = true;
    error = null;

    console.log('Fetching comments for UUID:', id);
    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('id, user_id, content, created_at, display_name')
        .eq('drawing_id', id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        error = `Failed to load comments: ${fetchError.message}`;
        console.error('Error fetching comments:', fetchError);
        comments = [];
      } else {
        comments = data.map(comment => ({
          ...comment,
          display_name: comment.display_name || getDisplayName(comment.user_id)
        }));
        console.log('Fetched comments:', comments);
      }
    } catch (err) {
      error = `Unexpected error loading comments: ${err.message}`;
      console.error('Unexpected error in fetchComments:', err);
      comments = [];
    }
    loading = false;
  }

  // Post a new comment to the comments table
  async function postComment() {
    if (!$user || !newComment.trim()) return;
    if (!id) {
      error = 'Cannot post comment: Missing drawing UUID';
      console.error('postComment called with invalid id:', id);
      return;
    }

    loading = true;
    error = null;

    try {
      const newCommentObj: Omit<Comment, 'id' | 'created_at'> = {
        drawing_id: id,
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
      error = `Error: ${err.message}`;
      console.error('Error posting comment:', err);
    }

    loading = false;
  }

  function handleLoginPrompt() {
    localStorage.setItem('sb-redirect', window.location.pathname);
    showAuthModal = true;
  }

  onMount(() => {
    console.log('CommentsModal mounted. Authenticated user ID:', $user?.id, 'Email:', $user?.email);
    if (id) {
      fetchComments().catch(err => {
        console.error('Error in onMount fetchComments:', err);
        error = `Failed to initialize comments: ${err.message}`;
      });
    } else {
      console.error('onMount skipped due to invalid id:', id);
    }
  });
</script>

<div class="modal-overlay" on:click={onClose}>
  <div class="modal-content" on:click|stopPropagation>
    <button class="close-button" on:click={onClose}>×</button>
    <h2>Comments for Drawing #{drawing_id || 'Unknown'}</h2>

    {#if loading}
      <p>Loading comments...</p>
    {:else if error}
      <p class="error">{error}</p>
      <button class="retry-button" on:click={fetchComments}>Retry</button>
    {:else if comments.length === 0}
      <p>No comments yet. Be the first to comment!</p>
    {:else}
      <div class="comments-list">
        {#each comments as comment (comment.id)}
          <div class="comment">
            <p>
              <strong class="username">{comment.display_name || 'User'}</strong>: {comment.content}
            </p>
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </div>
        {/each}
      </div>
    {/if}

    {#if $user}
      <div class="comment-form">
        <textarea
          bind:value={newComment}
          placeholder="Add a comment..."
          rows="4"
          disabled={loading}
        ></textarea>
        <button
          class="comment-button"
          on:click={postComment}
          disabled={loading || !newComment.trim()}
        >
          Post Comment
        </button>
      </div>
    {:else}
      <p>
        Please <button class="link-button" on:click={handleLoginPrompt}>log in</button> to post a comment.
      </p>
    {/if}
  </div>
</div>

{#if showAuthModal}
  <AuthModal
    bind:show={showAuthModal}
    on:authSuccess={() => {
      showAuthModal = false;
      fetchComments();
    }}
    on:authError={({ detail }) => {
      error = detail.message;
      showAuthModal = false;
    }}
  />
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .comments-list {
    margin-bottom: 1rem;
  }

  .comment {
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .comment p {
    margin: 0;
    font-size: 0.9rem;
  }

  .username {
    font-weight: bold;
    color: #333;
    margin-right: 0.5rem;
  }

  .comment small {
    color: #666;
    font-size: 0.8rem;
    display: block;
    margin-top: 0.25rem;
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .comment-form textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-size: 0.9rem;
  }

  .comment-button {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .comment-button:hover {
    background-color: #45a049;
  }

  .comment-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .error {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .retry-button {
    padding: 0.25rem 0.5rem;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .link-button {
    background: none;
    border: none;
    color: #4CAF50;
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: underline;
    padding: 0;
  }

  .link-button:hover {
    color: #45a049;
  }
</style>