<script lang="ts">
  import { supabase } from '../supabase';
  import { user } from '../utils/auth';
  import { onMount } from 'svelte';
  import AuthModal from '../AuthModal.svelte';

  export let id: string | undefined; // UUID from id column
  export let drawing_id: string | undefined; // Public-facing drawing_id for display
  export let onClose: () => void;

  // Support old and new comment formats
  type OldComment = {
    user: string;
    text: string;
  };

  type NewComment = {
    user_id: string;
    content: string;
    created_at: string;
    display_name?: string;
  };

  type Comment = OldComment | NewComment;

  let comments: NewComment[] = [];
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

  // Fetch user display name using only auth data
  function getDisplayName(userId: string, userEmail?: string): string {
    // Use email from $user if available and userId matches
    if ($user && $user.id === userId && $user.email) {
      return $user.email.split('@')[0];
    }
    // Fallback to provided userEmail or userId
    return userEmail?.split('@')[0] || userId.slice(0, 8);
  }

  // Normalize comments to NewComment format
  function normalizeComment(comment: Comment, defaultCreatedAt: string): NewComment {
    if ('user' in comment) {
      return {
        user_id: comment.user,
        content: comment.text,
        created_at: defaultCreatedAt,
        display_name: comment.user.slice(0, 8),
      };
    }
    return comment as NewComment;
  }

  // Fetch comments from the drawings table
  async function fetchComments() {
    if (!id || !drawing_id) {
      error = 'Cannot load comments: Missing drawing ID or UUID';
      console.error('fetchComments called with invalid props:', { id, drawing_id });
      return;
    }

    loading = true;
    error = null;

    console.log('Fetching comments for UUID:', id, 'drawing_id:', drawing_id);
    try {
      const { data, error: fetchError } = await supabase
        .from('drawings')
        .select('comments, user_email, created_at')
        .eq('id', id)
        .single();

      if (fetchError) {
        error = `Failed to load comments: Drawing ${drawing_id} not found`;
        console.error('Error fetching comments:', fetchError);
        comments = [];
      } else {
        console.log('Fetched data:', { 
          uuid: id, 
          public_drawing_id: drawing_id, 
          comments: data?.comments, 
          user_email: data?.user_email 
        });
        
        const rawComments = Array.isArray(data?.comments) ? data.comments : [];
        const defaultCreatedAt = data?.created_at || new Date().toISOString();
        
        comments = rawComments.map((comment: Comment) => {
          const normalized = normalizeComment(comment, defaultCreatedAt);
          return {
            ...normalized,
            display_name: getDisplayName(normalized.user_id, data.user_email),
          };
        });
        
        console.log('Processed comments:', comments);
      }
    } catch (err) {
      error = `Unexpected error loading comments: ${err.message}`;
      console.error('Unexpected error in fetchComments:', err);
      comments = [];
    }
    loading = false;
  }

  // Post a new comment
  async function postComment() {
    if (!$user || !newComment.trim()) return;
    if (!id || !drawing_id) {
      error = 'Cannot post comment: Missing drawing ID or UUID';
      console.error('postComment called with invalid props:', { id, drawing_id });
      return;
    }

    loading = true;
    error = null;
    
    try {
      // Create new comment object
      const newCommentObj: NewComment = {
        user_id: $user.id,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        display_name: $user.email?.split('@')[0] || $user.id.slice(0, 8),
      };
      
      // Get current comments
      const { data: currentData, error: fetchError } = await supabase
        .from('drawings')
        .select('comments')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        throw new Error(`Failed to fetch current comments: ${fetchError.message}`);
      }
      
      // Prepare updated comments array
      const currentComments = Array.isArray(currentData?.comments) ? currentData.comments : [];
      const updatedComments = [...currentComments, newCommentObj];
      
      console.log('Update payload:', { 
        id: id,
        currentComments: currentComments.length, 
        updatedComments: updatedComments.length 
      });
      
      // Update the database
      const { data: updateData, error: updateError } = await supabase
        .from('drawings')
        .update({ comments: updatedComments })
        .eq('id', id)
        .select();
        
      if (updateError) {
        throw new Error(`Failed to update comments: ${updateError.message}`);
      }
      
      console.log('Update successful:', updateData);
      
      // Reset comment input and refresh comments
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
    if (id && drawing_id) {
      fetchComments().catch(err => {
        console.error('Error in onMount fetchComments:', err);
        error = `Failed to initialize comments: ${err.message}`;
      });
    } else {
      console.error('onMount skipped due to invalid props:', { id, drawing_id });
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
        {#each comments as comment}
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