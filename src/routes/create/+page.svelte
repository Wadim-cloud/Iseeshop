<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';
  import { supabase, getCurrentUser } from '$lib/supabase';
  import DrawingCanvas from '$lib/DrawingCanvas2.svelte';
  import DrawingControls from '$lib/DrawingControls.svelte';
  import DrawingMenu from '$lib/DrawingMenu.svelte';
  import CanvasShader from '$lib/CanvasShader.svelte';
  import Toast from '$lib/Toast.svelte';
  import type { Session } from '@supabase/supabase-js';

  export let data: { session: Session | null };

  const sessionStore = writable<Session | null>(data.session);
  const loading = writable(true);
  const error = writable<string | null>(null);
  const canvasStore = writable<{ canvas: HTMLCanvasElement | null }>({ canvas: null });
  const toastState = writable<{
    message: string;
    visible: boolean;
    type: 'success' | 'error' | 'warning';
  }>({ message: '', visible: false, type: 'success' });

  const COLORS = ['red', 'green', 'blue', 'black', 'white'] as const;
  const INITIAL_COLOR = 'black';
  const INITIAL_SIZE = 10;
  const TOAST_DURATION = 3000;

  let color = INITIAL_COLOR;
  let size = INITIAL_SIZE;
  let showMenu = false;
  let selected = INITIAL_COLOR;
  let user = null;
  let toastTimeout: NodeJS.Timeout;

  onMount(async () => {
    try {
      const { data: { session: clientSession } } = await supabase.auth.getSession();
      $sessionStore = clientSession || data.session;
      user = await getCurrentUser();
      console.log('Create page user:', user);
      console.log('Create page session:', $sessionStore);
      console.log('Client cookies:', document.cookie);

      const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        $sessionStore = newSession;
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } catch (err) {
      $error = err instanceof Error ? err.message : 'Failed to load session';
      console.error('Session sync error:', err);
    } finally {
      $loading = false;
    }
  });

  afterUpdate(() => {
    if (import.meta.env.DEV && $sessionStore) {
      console.debug('[DrawingApp] Session active for:', $sessionStore.user?.email);
    }
  });

  const getEmailPrefix = (email: string): string => {
    return email.split('@')[0] || 'user';
  };

  async function getDrawingCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('drawings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Error fetching drawing count:', err);
      $error = 'Failed to fetch drawing count';
      return 0;
    }
  }

  async function generateDrawingId(email: string, userId: string): Promise<string> {
    const prefix = getEmailPrefix(email);
    const count = (await getDrawingCount(userId)) + 1;
    return `${prefix}-${count}`;
  }

  async function saveDrawing(canvas: HTMLCanvasElement) {
    if (!canvas) {
      showToast('No canvas element found', 'error');
      return;
    }
    if (!$sessionStore?.user) {
      showToast('Please login to save drawings', 'error');
      return;
    }

    $loading = true;
    try {
      await verifyRateLimits();
      await persistDrawing(canvas);
      showToast('Drawing saved successfully!', 'success');
    } catch (err) {
      handlePersistError(err);
    } finally {
      $loading = false;
    }
  }

  async function verifyRateLimits() {
    if (import.meta.env.DEV || import.meta.env.MODE === 'preview') {
      console.log('Mock rate limit check: allowed');
      return;
    }
    try {
      console.log('Fetching rate limit check for user:', $sessionStore?.user.id);
      const response = await fetch('/api/check-rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: $sessionStore?.user.id })
      });

      if (!response.ok) {
        throw new Error('Rate limit service unavailable');
      }

      const result = await response.json();
      if (result.blocked) {
        throw new Error(result.message || 'You are temporarily banned due to excessive submissions');
      }
      if (result.limited) {
        showToast(result.message || 'Warning: approaching submission limit', 'warning');
      }
    } catch (err) {
      console.error('[Rate Limit]', err);
      throw err;
    }
  }

  async function persistDrawing(canvas: HTMLCanvasElement) {
    try {
      const imageData = canvas.toDataURL('image/png');
      const createdAt = new Date().toISOString();
      const drawingId = await generateDrawingId($sessionStore.user.email, $sessionStore.user.id);
      const { error } = await supabase.from('drawings').insert({
        drawing_id: drawingId,
        image_data: imageData,
        user_id: $sessionStore.user.id,
        user_email: $sessionStore.user.email,
        created_at: createdAt,
        blocked: false,
        likes: 0,
        comments: {}
      });
      if (error) throw error;
    } catch (err) {
      console.error('[Supabase] Persist error:', err);
      throw err;
    }
  }

  function handlePersistError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save drawing';
    console.error('[DrawingApp] Save error:', error);
    showToast(message, 'error');
  }

  function showToast(message: string, type: 'success' | 'error' | 'warning') {
    clearTimeout(toastTimeout);
    $toastState = { message, visible: true, type };
    toastTimeout = setTimeout(() => {
      $toastState.visible = false;
    }, TOAST_DURATION);
  }

  function updateColor(newColor: string) {
    selected = color = newColor;
  }

  function updateSize(newSize: number) {
    size = Math.max(1, Math.min(50, newSize));
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }
</script>

{#if $loading}
  <p>Loading...</p>
{:else if $error}
  <p>Error: {$error}</p>
{:else if $sessionStore}
  <DrawingCanvas color={color} size={size} {canvasStore} />
  <DrawingControls {canvasStore} onSave={saveDrawing} onMenuToggle={toggleMenu} />
  {#if showMenu}
    <DrawingMenu 
      colors={COLORS}
      selected={selected}
      size={size}
      onColorChange={updateColor}
      onSizeChange={updateSize}
    />
  {/if}
{:else}
  <CanvasShader message="You need to log in to start creating">
    <DrawingCanvas color={color} size={size} disabled />
  </CanvasShader>
{/if}

<Toast 
  message={$toastState.message} 
  show={$toastState.visible} 
  type={$toastState.type} 
/>

<style>

  /* Ensure Toast is above everything */
  :global(.toast) {
    position: fixed;
    z-index: 1100; /* Higher than all navbar elements and controls */
  }

  /* Ensure canvas stays below controls but above background */
  :global(.drawing-canvas) {
    position: relative;
    z-index: 500; /* Below controls but above general content */
  }

  /* Optional: Add padding to account for fixed navbar height */
  :global(main) {
    padding-top: 80px; /* Adjust based on navbar height (approx 60px + margin) */
  }
</style>