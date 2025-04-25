<script lang="ts">
    import { supabase } from '$lib/supabase';
    import { user } from '$lib/utils/auth';
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
  
    export let show: boolean;
  
    // Support old and new comment formats
    type OldComment = {
      user: string;
      text: string;
    };
  
    type NewComment = {
      id: number; // Generated ID for reactions
      user_id: string;
      content: string;
      created_at: string;
      display_name?: string;
      reactions?: { user_id: string; created_at: string }[];
      drawing_id: string;
    };
  
    type Comment = OldComment | NewComment;
  
    let comments: NewComment[] = [];
    let drawings: { id: string; drawing_id: string }[] = [];
    let selectedDrawingId: string = '';
    let newComment = '';
    let loading = false;
    let reactionLoading: number | null = null;
    let error: string | null = null;
    let showAuthModal = false;
  
    // Generate a unique ID for comments (client-safe)
    function generateCommentId(comment: NewComment): number {
      let hash = 0;
      const str = `${comment.user_id}${comment.created_at}`;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    }
  
    // Fetch user display name
    function getDisplayName(userId: string, userEmail?: string): string {
      if ($user && $user.id === userId && $user.email) {
        return $user.email.split('@')[0];
      }
      return userEmail?.split('@')[0] || userId.slice(0, 8);
    }
  
    // Normalize comments to NewComment format
    function normalizeComment(comment: Comment, defaultCreatedAt: string, drawingId: string): NewComment {
      if ('user' in comment) {
        const newComment: NewComment = {
          id: generateCommentId({ user_id: comment.user, content: comment.text, created_at: defaultCreatedAt, drawing_id: drawingId }),
          user_id: comment.user,
          content: comment.text,
          created_at: defaultCreatedAt,
          display_name: comment.user.slice(0, 8),
          reactions: [],
          drawing_id: drawingId
        };
        return newComment;
      }
      const newComment = comment as NewComment;
      return {
        ...newComment,
        id: newComment.id || generateCommentId({ ...newComment, drawing_id: drawingId }),
        reactions: newComment.reactions || [],
        drawing_id: drawingId
      };
    }
  
    // Fetch drawings and comments
    async function fetchComments() {
      loading = true;
      error = null;
  
      try {
        const { data, error: fetchError } = await supabase
          .from('drawings')
          .select('id, drawing_id, comments, user_email, created_at')
          .eq('blocked', false)
          .order('created_at', { ascending: false });
  
        if (fetchError) {
          error = `Failed to load comments: ${fetchError.message}`;
          console.error('Error fetching drawings:', fetchError);
          comments = [];
          drawings = [];
        } else {
          console.log('Fetched drawings:', data);
          drawings = data.map(d => ({ id: d.id, drawing_id: d.drawing_id }));
          selectedDrawingId = drawings[0]?.drawing_id || '';
  
          comments = [];
          data.forEach(drawing => {
            const rawComments = Array.isArray(drawing.comments) ? drawing.comments : [];
            const defaultCreatedAt = drawing.created_at || new Date().toISOString();
  
            const drawingComments = rawComments.map((comment: Comment) =>
              normalizeComment(comment, defaultCreatedAt, drawing.drawing_id)
            );
  
            comments = [...comments, ...drawingComments];
          });
  
          console.log('Processed comments:', comments);
        }
      } catch (err) {
        error = `Unexpected error loading comments: ${err.message}`;
        console.error('Unexpected error in fetchComments:', err);
        comments = [];
        drawings = [];
      }
      loading = false;
    }
  
    // Post a new comment
    async function postComment() {
      if (!$user || !newComment.trim() || !selectedDrawingId) {
        error = 'Please select a drawing and enter a comment';
        return;
      }
  
      loading = true;
      error = null;
  
      try {
        const newCommentObj: NewComment = {
          id: generateCommentId({
            user_id: $user.id,
            content: newComment.trim(),
            created_at: new Date().toISOString(),
            drawing_id: selectedDrawingId
          }),
          user_id: $user.id,
          content: newComment.trim(),
          created_at: new Date().toISOString(),
          display_name: $user.email?.split('@')[0] || $user.id.slice(0, 8),
          reactions: [],
          drawing_id: selectedDrawingId
        };
  
        const { data: currentData, error: fetchError } = await supabase
          .from('drawings')
          .select('comments')
          .eq('drawing_id', selectedDrawingId)
          .single();
  
        if (fetchError) {
          throw new Error(`Failed to fetch current comments: ${fetchError.message}`);
        }
  
        const currentComments = Array.isArray(currentData?.comments) ? currentData.comments : [];
        const updatedComments = [...currentComments, newCommentObj];
  
        const { data: updateData, error: updateError } = await supabase
          .from('drawings')
          .update({ comments: updatedComments })
          .eq('drawing_id', selectedDrawingId)
          .select();
  
        if (updateError) {
          throw new Error(`Failed to update comments: ${updateError.message}`);
        }
  
        console.log('Comment posted successfully:', updateData);
        newComment = '';
        await fetchComments();
      } catch (err) {
        error = `Error posting comment: ${err.message}`;
        console.error('Error posting comment:', err);
      }
  
      loading = false;
    }
  
    // Handle comment reactions
    async function handleReact(commentId: number) {
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
        let updatedComments: NewComment[];
  
        if (hasReacted) {
          // Unlike
          updatedComments = comments.map(c =>
            c.id === commentId
              ? { ...c, reactions: c.reactions.filter(r => r.user_id !== $user.id) }
              : c
          );
        } else {
          // Like
          updatedComments = comments.map(c =>
            c.id === commentId
              ? {
                  ...c,
                  reactions: [
                    ...c.reactions,
                    { user_id: $user.id, created_at: new Date().toISOString() }
                  ]
                }
              : c
          );
        }
  
        const { data: currentData, error: fetchError } = await supabase
          .from('drawings')
          .select('comments')
          .eq('drawing_id', comment.drawing_id)
          .single();
  
        if (fetchError) {
          throw new Error(`Failed to fetch current comments: ${fetchError.message}`);
        }
  
        const currentComments = Array.isArray(currentData?.comments) ? currentData.comments : [];
        const updatedDrawingComments = currentComments.map((c: NewComment) =>
          c.id === commentId
            ? updatedComments.find(uc => uc.id === commentId) || c
            : c
        );
  
        const { error: updateError } = await supabase
          .from('drawings')
          .update({ comments: updatedDrawingComments })
          .eq('drawing_id', comment.drawing_id);
  
        if (updateError) {
          throw new Error(`Failed to update reactions: ${updateError.message}`);
        }
  
        console.log('Reaction updated successfully');
        comments = updatedComments;
      } catch (err) {
        error = `Failed to react to comment: ${err.message}`;
        console.error('Reaction error:', err);
      } finally {
        reactionLoading = null;
      }
    }
  
    function navigateToDrawing(drawingId: string) {
      console.log('Navigating to drawing:', drawingId);
      goto(`/gallery/${drawingId}`);
      show = false;
    }
  
    function handleLoginPrompt() {
      console.log('Login prompt triggered');
      localStorage.setItem('sb-redirect', window.location.pathname);
      showAuthModal = true;
    }
  
    // Load comments when modal is shown
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
                    on:click={() => navigateToDrawing(comment.drawing_id)}
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