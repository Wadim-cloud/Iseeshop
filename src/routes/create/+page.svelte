<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  let canvas;
  let ctx;
  let drawingId = '';
  let brushColor = 'black';
  let brushSize = 5;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let errorMessage = '';
  let showModal = false;
  let drawings = [];
  let isLoading = false;
  let toasts = [];

  const colors = ['black', 'red', 'blue', 'green'];

  // Function to add a toast
  function addToast(message, type = 'info', duration = 3000) {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type }];
    setTimeout(() => {
      toasts = toasts.filter(toast => toast.id !== id);
    }, duration);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    preloadDrawings();

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userEmail = session.user.email || '';
        const username = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        if (username === 'savebertin') {
          addToast('Welcome, Savebertin! Visit the admin settings at pexos.vercel.app/settings/admin.', 'success');
        }
      }
    });

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', stopDrawing);
      subscription?.unsubscribe();
    };
  });

  async function preloadDrawings() {
    isLoading = true;
    const { data, error } = await supabase
      .from('drawings')
      .select('drawing_id, title, image_data')
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

  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const [x, y] = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.type.startsWith('touch')) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    return [x, y];
  }

  function handleTouchStart(e) {
    e.preventDefault();
    startDrawing(e);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    draw(e);
  }

  async function saveDrawing() {
    const imageData = canvas.toDataURL('image/png');
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || 'user-uuid-placeholder';
      const userEmail = userData?.user?.email || 'user@example.com';
      const username = userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';

      const { count, error: countError } = await supabase
        .from('drawings')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);
      if (countError) throw countError;

      const sequence = (count || 0) + 1;
      const newDrawingId = `${username}-${sequence}`;

      const { error } = await supabase.from('drawings').insert({
        drawing_id: newDrawingId,
        image_data: imageData,
        title: 'New Drawing',
        user_id: userId,
        user_email: userEmail
      });
      if (error) throw error;

      // Notify Supabase Edge Function - Commented out as not ready for operation
      /*
      await fetch('https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_API_KEY}`
        },
        body: JSON.stringify({
          id: newDrawingId,
          user_id: userId,
          title: `New Drawing by ${userEmail}`
        })
      });
      */

      errorMessage = '';
      addToast('Drawing saved successfully with ID: ' + newDrawingId, 'success');
      drawingId = newDrawingId;
      await preloadDrawings();
    } catch (error) {
      console.error('Error saving drawing:', error);
      errorMessage = 'Failed to save drawing: ' + error.message;
      addToast('Failed to save drawing: ' + error.message, 'error');
    }
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function selectDrawing(id) {
    drawingId = id;
    showModal = false;
    loadBackground();
  }

  async function loadBackground() {
    if (!drawingId.trim()) {
      errorMessage = 'Please enter a Drawing ID';
      addToast('Please enter a Drawing ID', 'error');
      return;
    }
    const { data, error } = await supabase
      .from('drawings')
      .select('image_data')
      .eq('drawing_id', drawingId)
      .single();
    if (error) {
      console.error('Error loading background:', error);
      errorMessage = 'Failed to load drawing';
      addToast('Failed to load drawing', 'error');
      return;
    }
    if (data && data.image_data) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = data.image_data;
      errorMessage = '';
      addToast('Drawing loaded successfully', 'success');
    } else {
      errorMessage = 'No background image found for this drawing';
      addToast('No background image found for this drawing', 'error');
      clearCanvas();
    }
  }

  function openModal() {
    showModal = true;
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

  canvas {
    border: 2px solid #333;
    background-color: white;
  }

  .subbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px;
    background: #ffffffcc;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    align-items: center;
    justify-content: center;
  }

  .subbar button,
  .subbar input,
  .subbar select {
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background-color: #fff;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .subbar button:active {
    transform: scale(0.95);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .subbar .drawing-id {
    min-width: 140px;
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

  .toast {
    background: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
  }

  .toast.success {
    background: #4caf50;
  }

  .toast.error {
    background: #f44336;
  }

  .toast button {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .toast button:active {
    transform: scale(0.95);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 1000;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  .modal-content {
    max-height: 400px;
    overflow-y: auto;
    margin-top: 1rem;
  }

  .drawing-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }

  .drawing-item:hover {
    background: #f5f5f5;
  }

  .drawing-preview {
    width: 80px;
    height: 60px;
    object-fit: cover;
    margin-right: 10px;
    border: 1px solid #ddd;
  }

  .drawing-info {
    flex: 1;
  }

  .modal-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .modal-buttons button {
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .modal-buttons button:active {
    transform: scale(0.95);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>

<div class="container">
  <div class="toast-container">
    {#each toasts as toast (toast.id)}
      <div class="toast {toast.type}">
        <span>{toast.message}</span>
        <button on:click={() => toasts = toasts.filter(t => t.id !== toast.id)}>✕</button>
      </div>
    {/each}
  </div>

  <div class="subbar">
    <input class="drawing-id" type="text" bind:value={drawingId} placeholder="Drawing ID" />
    <button on:click={openModal}>🖼️ Gallery</button>
    <button on:click={loadBackground}>📥 Load</button>
    <button on:click={saveDrawing}>💾 Save</button>
    <button on:click={clearCanvas}>🧹 Clear</button>
    <label>
      🎨
      <select bind:value={brushColor}>
        {#each colors as color}
          <option value={color}>{color}</option>
        {/each}
      </select>
    </label>
    <label>
      🖌️
      <input type="range" bind:value={brushSize} min="1" max="50" />
    </label>
  </div>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <canvas bind:this={canvas} width="800" height="600"></canvas>
</div>

{#if showModal}
  <div class="modal-overlay" on:click={() => (showModal = false)}></div>
  <div class="modal">
    <h2>Select a Drawing</h2>
    <div class="modal-content">
      {#if isLoading}
        <p>Loading drawings...</p>
      {:else if drawings.length === 0}
        <p>No drawings found.</p>
      {:else}
        {#each drawings as drawing}
          <div class="drawing-item" on:click={() => selectDrawing(drawing.drawing_id)}>
            {#if drawing.image_data}
              <img src={drawing.image_data} alt="Preview" class="drawing-preview" />
            {:else}
              <div class="drawing-preview" style="display: flex; align-items: center; justify-content: center; background: #eee;">
                No Image
              </div>
            {/if}
            <div class="drawing-info">
              <strong>{drawing.drawing_id}</strong>
              {#if drawing.title}
                <span> - {drawing.title}</span>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
    <div class="modal-buttons">
      <button on:click={() => (showModal = false)}>Close</button>
    </div>
  </div>
{/if}