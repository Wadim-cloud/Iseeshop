<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { user } from '$lib/utils/auth';
  import { onMount } from 'svelte';
  import AuthModal from '$lib/AuthModal.svelte';
  import { commentCounts } from './stores';

  export let id: string | undefined; // UUID (drawings.id)
  export let drawing_id: string | undefined; // Public-facing ID (e.g., thijsvinke-1)
  export let onClose: () => void;

  type Comment = {
    id: string;
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

  function getDisplayName(userId: string): string {
    if ($user && $user.id === userId && $user.email) {
      return $user.email.split('@')[0];
    }
    return userId.slice(0, 8);
  }

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
        // Update comment count in store
        commentCounts.update(counts => ({
          ...counts,
          [id]: comments.length
        }));
      }
    } catch (err) {
      error = `Unexpected error loading comments: ${err.message}`;
      console.error('Unexpected error in fetchComments:', err);
      comments = [];
    }
    loading = false;
  }

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
    <button class="close-button" on:click={onClose}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>

    <h2>Comments for {drawing_id}</h2>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    {#if loading}
      <div class="loading">Loading comments...</div>
    {:else if comments.length === 0}
      <div class="no-comments">No comments yet.</div>
    {:else}
      <div class="comments-list">
        {#each comments as comment (comment.id)}
          <div class="comment">
            <div class="comment-header">
              <span class="comment-author">{comment.display_name}</span>
              <span class="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
            </div>
            <p class="comment-content">{comment.content}</p>
          </div>
        {/each}
      </div>
    {/if}

    {#if $user}
      <div class="comment-form">
        <textarea
          bind:value={newComment}
          placeholder="Write a comment..."
          rows="4"
          disabled={loading}
        ></textarea>
        <button on:click={postComment} disabled={loading || !newComment.trim()}>
          Post Comment
        </button>
      </div>
    {:else}
      <div class="login-prompt">
        <p>Please log in to post a comment.</p>
        <button on:click={handleLoginPrompt}>Log In</button>
      </div>
    {/if}

    {#if showAuthModal}
      <AuthModal onClose={() => (showAuthModal = false)} />
    {/if}
  </div>
</div>

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
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  h2 {
    margin: 0 0 16px;
    font-size: 20px;
    color: #333;
  }

  .error {
    color: #d32f2f;
    margin-bottom: 16px;
  }

  .loading {
    text-align: center;
    color: #666;
    margin: 16px 0;
  }

  .no-comments {
    text-align: center;
    color: #666;
    margin: 16px 0;
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }

  .comment {
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .comment-author {
    font-weight: 600;
    color: #333;
  }

  .comment-date {
    font-size: 12px;
    color: #666;
  }

  .comment-content {
    margin: 0;
    color: #333;
    font-size: 14px;
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-size: 14px;
  }

  .comment-form button {
    align-self: flex-end;
    padding: 8px 16px;
    background: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .comment-form button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .login-prompt {
    text-align: center;
    color: #666;
  }

  .login-prompt button {
    padding: 8px 16px;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
</style>