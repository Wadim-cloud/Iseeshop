<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import Canvas from './Canvas.svelte';
  import Toolbar from './Toolbar.svelte';
  import GalleryModal from './GalleryModal.svelte';
  import Toast from './Toast.svelte';
  import SettingsPanel from './SettingsPanel.svelte';
  import DrawingTitleInput from './DrawingTitleInput.svelte';

  export let session;

  let drawingId = '';
  let drawingTitle = 'New Drawing';
  let brushColor = 'black';
  let brushSize = 5;
  let brushType = 'normal';
  let backgroundPattern = 'blank';
  let lineOpacity = 1;
  let errorMessage = '';
  let showModal = false;
  let showSettings = false;
  let drawings = [];
  let isLoading = false;
  let toasts = [];
  let canvasRef;

  const colors = ['black', 'red', 'blue', 'green'];
  const brushTypes = ['normal', 'twirl', 'horizontal'];

  function addToast(message, type = 'info', duration = 3000) {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type }];
    setTimeout(() => {
      toasts = toasts.filter(toast => toast.id !== id);
    }, duration);
  }

  onMount(() => {
    preloadDrawings();

    if (session?.user) {
      const userEmail = session.user.email || '';
      const username = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (username === 'savebertin') {
        addToast('Welcome, Savebertin! Visit the admin settings at pexos.vercel.app/settings/admin.', 'success');
      }
    }

    const { subscription } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN' && newSession?.user) {
        session = newSession;
        const userEmail = newSession.user.email || '';
        const username = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (username === 'savebertin') {
          addToast('Welcome, Savebertin! Visit the admin settings at pexos.vercel.app/settings/admin.', 'success');
        }
      }
    });

    return () => subscription?.unsubscribe();
  });

  async function preloadDrawings() {
    isLoading = true;
    const { data, error } = await supabase
      .from('drawings')
      .select('id, drawing_id, title, image_data')
      .eq('blocked', false)
      .limit(5)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error preloading drawings:', error);
      errorMessage = 'Failed to load drawings';
      addToast('Failed to load drawings', 'error');
    } else {
      drawings = data || [];
    }
    isLoading = false;
  }

  async function saveDrawing() {
    const imageData = canvasRef.toDataURL('image/png');
    try {
      const trimmedTitle = drawingTitle.trim();
      console.log('Saving drawing with title:', trimmedTitle); // Debug title
      const usedTitle = trimmedTitle || 'New Drawing';
      if (!trimmedTitle) {
        addToast('Title is empty, using default title "New Drawing" for ID', 'warning');
      }

      const userId = session?.user?.id || null;
      const userEmail = session?.user?.email || null;
      console.log('userId:', userId, 'typeof userId:', typeof userId); // Debug userId
      const username = userEmail ? userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'anonymous';

      // Sanitize title for drawing_id: lowercase, alphanumeric, replace spaces with hyphens
      const sanitizedTitle = usedTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

      // Calculate sequence number
      let count = 1;
      if (userId) {
        const { count: existingCount, error: countError } = await supabase
          .from('drawings')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        if (countError) throw countError;
        count = (existingCount || 0) + 1;
      } else {
        const { count: existingCount, error: countError } = await supabase
          .from('drawings')
          .select('id', { count: 'exact' })
          .is('user_id', null)
          .eq('user_email', null);
        if (countError) throw countError;
        count = (existingCount || 0) + 1;
      }

      const newDrawingId = `${username}-${count}-${sanitizedTitle}`;

      const drawingData = {
        drawing_id: newDrawingId,
        image_data: imageData,
        title: usedTitle,
        user_id: userId,
        user_email: userEmail,
        likes: 0,
        comments: null,
        blocked: false
      };
      console.log('Inserting drawing data:', drawingData); // Debug insert data

      const { error } = await supabase.from('drawings').insert(drawingData);
      if (error) throw error;

      errorMessage = '';
      addToast(`Drawing saved successfully with ID: ${newDrawingId}`, 'success');
      drawingId = newDrawingId;
      await preloadDrawings();
    } catch (error) {
      console.error('Error saving drawing:', error);
      errorMessage = 'Failed to save drawing: ' + error.message;
      addToast('Failed to save drawing: ' + error.message, 'error');
    }
  }

  function clearCanvas() {
    canvasRef.clear();
  }

  async function loadBackground() {
    if (!drawingId.trim()) {
      errorMessage = 'Please enter a Drawing ID';
      addToast('Please enter a Drawing ID', 'error');
      return;
    }
    const { data, error } = await supabase
      .from('drawings')
      .select('id, drawing_id, title, image_data')
      .eq('drawing_id', drawingId)
      .eq('blocked', false)
      .single();
    if (error) {
      console.error('Error loading background:', error);
      errorMessage = 'Failed to load drawing';
      addToast('Failed to load drawing', 'error');
      return;
    }
    if (data && data.image_data) {
      canvasRef.loadImage(data.image_data);
      drawingTitle = data.title || 'New Drawing';
      errorMessage = '';
      addToast('Drawing loaded successfully', 'success');
    } else {
      errorMessage = 'No background image found for this drawing';
      addToast('No background image found for this drawing', 'error');
      clearCanvas();
    }
  }
</script>

<style>
  .container {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f0f0;
    padding: 20px;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>

<div class="container">
  <div class="toast-container">
    {#each toasts as toast (toast.id)}
      <Toast {toast} on:close={() => toasts = toasts.filter(t => t.id !== toast.id)} />
    {/each}
  </div>
  <Toolbar
    {drawingId}
    {brushColor}
    {brushSize}
    {brushType}
    {colors}
    {brushTypes}
    on:changeDrawingId={e => drawingId = e.detail}
    on:changeBrushColor={e => brushColor = e.detail}
    on:changeBrushSize={e => brushSize = e.detail}
    on:changeBrushType={e => brushType = e.detail}
    on:openGallery={() => showModal = true}
    on:loadDrawing={loadBackground}
    on:saveDrawing={saveDrawing}
    on:clearCanvas={clearCanvas}
    on:toggleSettings={() => showSettings = !showSettings}
  />
  <DrawingTitleInput bind:drawingTitle />
  {#if showSettings}
    <SettingsPanel
      {backgroundPattern}
      {lineOpacity}
      on:changeBackgroundPattern={e => backgroundPattern = e.detail}
      on:changeLineOpacity={e => lineOpacity = e.detail}
    />
  {/if}
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  <Canvas bind:canvasRef {brushColor} {brushSize} {brushType} {backgroundPattern} {lineOpacity} />
</div>
{#if showModal}
  <GalleryModal
    {drawings}
    {isLoading}
    on:selectDrawing={e => {
      drawingId = e.detail;
      showModal = false;
      loadBackground();
    }}
    on:close={() => showModal = false}
  />
{/if}