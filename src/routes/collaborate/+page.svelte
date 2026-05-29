<script lang="ts">
  export const ssr = false;
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import SessionManager from '$lib/collaborate/SessionManager.svelte';
  import ChannelManager from '$lib/collaborate/ChannelManager.svelte';
  import DrawingCanvas from '$lib/collaborate/DrawingCanvas.svelte';
  import ControlsPanel from '$lib/collaborate/ControlsPanel.svelte';
  import ToastContainer from '$lib/collaborate/ToastContainer.svelte';
  import DebugInfo from '$lib/collaborate/DebugInfo.svelte';
  import OnlineUsers from '$lib/collaborate/OnlineUsers.svelte';
  import { supabase } from '$lib/supabase';
  import type { Session, Stroke, UserData, Canvas, Toast, BrushType } from '$lib/collaborate/types.js';

  let currentTab: 'canvas' | 'settings' | 'gallery' = 'canvas';

  let session: Session | null = null;
  let canvasId: string = '';
  let currentSessionId: string | null = null;
  let title: string = 'Collaborative Session';
  let brushColor: string = '#000000';
  let brushSize: number = 5;
  let brushType: BrushType = 'normal';
  let currentPressure: number = 0.5;
  let pressureResponsive: boolean = false;
  let sessions: Session[] = [];
  let userCanvases: Canvas[] = [];
  let onlineUsers: { user_id: string; email: string }[] = [];
  let isLoading: boolean = false;
  let toasts: Toast[] = [];
  let shareLink: string = '';
  let userData: UserData | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let canvasComponent: {
    clearCanvas: () => void;
    drawRemoteStroke: (stroke: Stroke) => void;
    saveCanvas: () => string | null;
  } | null = null;
  let sessionManager: {
    refreshSessions: () => Promise<void>;
    refreshCanvases: () => Promise<void>;
    createSession: (title: string) => Promise<void>;
    createCanvas: (title: string) => Promise<void>;
  } | null = null;
  let channelManager: { sendStroke: (stroke: Stroke) => void } | null = null;

  function addToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
    if (toasts.some(t => t.message === message && t.type === type)) return;
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, message, type }];
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
    }, 5000);
  }

  function handleSessionLoaded(id: string) {
    session = sessions.find(s => s.session_id === id) || null;
    currentSessionId = id;
    shareLink = session ? `${window.location.origin}/collaborate?session=${id}` : '';
    if (session && canvasComponent) {
      canvasComponent.clearCanvas();
      if (session.canvas_id) {
        canvasId = session.canvas_id;
        addToast(`Loaded session ${session.title} with canvas`, 'success');
      } else {
        canvasId = '';
        addToast(`Loaded session ${session.title}, no canvas`, 'info');
      }
      title = session.title || 'Collaborative Session';
    }
  }

  function handleCanvasLoaded(id: string) {
    canvasId = id;
    if (canvasComponent) {
      canvasComponent.clearCanvas();
      const canvas = userCanvases.find(c => c.canvas_id === id);
      if (canvas) {
        title = canvas.title || 'Collaborative Session';
        addToast(`Loaded canvas ${canvas.title}`, 'success');
      }
    }
  }

  async function handleCreateSession(title: string) {
    if (sessionManager) {
      await sessionManager.createSession(title);
    } else {
      addToast('Session manager not initialized', 'error');
    }
  }

  async function handleCreateCanvas(title: string) {
    if (sessionManager) {
      await sessionManager.createCanvas(title);
    } else {
      addToast('Session manager not initialized', 'error');
    }
  }

  async function handleSaveCanvas() {
    if (!canvasComponent || !canvasId || !userData) {
      addToast('Cannot save: missing canvas, session, or user', 'error');
      return;
    }

    const imageData = canvasComponent.saveCanvas?.();
    if (!imageData) {
      addToast('Failed to generate canvas image', 'error');
      return;
    }

    const { error } = await supabase
      .from('canvases')
      .update({
        image_data: imageData,
        updated_at: new Date().toISOString(),
      })
      .eq('canvas_id', canvasId);

    if (error) {
      console.error('Error saving canvas:', error);
      addToast('Error saving canvas to database', 'error');
    } else {
      addToast('Canvas image saved!', 'success');
    }
  }

  function handleStrokeReceived(event: CustomEvent<Stroke>) {
    if (canvasComponent?.drawRemoteStroke) {
      canvasComponent.drawRemoteStroke(event.detail);
    }
  }

  function handleUpdateBrush(event: CustomEvent<{ color: string; size: number; brushType: BrushType }>) {
    brushColor = event.detail.color;
    brushSize = event.detail.size;
    brushType = event.detail.brushType;
  }

  async function fetchSessionsFromEdgeFunction(user_id: string, token: string) {
    try {
      const response = await fetch(
        'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1/list-sessions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      sessions = data;
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      addToast('Failed to load sessions from server', 'error');
    }
  }

  onMount(async () => {
    if (browser) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        userData = { user_id: session.user.id, email: session.user.email || '' };
        await fetchSessionsFromEdgeFunction(session.user.id, session.access_token);
      }

      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session');
      if (sessionId) {
        handleSessionLoaded(sessionId);
      }
    }
  });

  $: if (browser && !userData) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        userData = { user_id: session.user.id, email: session.user.email || '' };
      }
    });
  }
</script>

<div class="container">
  <div class="tabs">
    <button on:click={() => currentTab = 'canvas'} class:active={currentTab === 'canvas'}>🎨 Canvas</button>
    <button on:click={() => currentTab = 'settings'} class:active={currentTab === 'settings'}>⚙️ Settings</button>
    <button on:click={() => currentTab = 'gallery'} class:active={currentTab === 'gallery'}>🖼 Gallery</button>
    {#if session}
      <a href="/collaborate/replay?session={session.session_id}" class="tab-link">▶ Replay</a>
    {/if}
    <a href="/collaborate/insights" class="tab-link">📊 Insights</a>
  </div>

  <ToastContainer {toasts} />

  {#if currentTab === 'settings'}
    <ControlsPanel
      bind:canvasId
      bind:title
      bind:brushColor
      bind:brushSize
      bind:brushType
      bind:pressureResponsive
      {currentPressure}
      {userCanvases}
      {sessions}
      {isLoading}
      {shareLink}
      {currentSessionId}
      on:createSession={(e) => handleCreateSession(e.detail)}
      on:createCanvas={(e) => handleCreateCanvas(e.detail)}
      on:saveCanvas={handleSaveCanvas}
      on:loadSession={(e) => handleSessionLoaded(e.detail)}
      on:loadCanvas={(e) => handleCanvasLoaded(e.detail)}
      on:updateBrush={handleUpdateBrush}
      on:toast={(e) => addToast(e.detail.message, e.detail.type)}
    />
    <SessionManager
      bind:userData
      bind:sessions
      bind:userCanvases
      bind:isLoading
      bind:currentSessionId
      bind:this={sessionManager}
      on:sessionLoaded={(e) => handleSessionLoaded(e.detail)}
      on:canvasLoaded={(e) => handleCanvasLoaded(e.detail)}
      on:toast={(e) => addToast(e.detail.message, e.detail.type)}
    />
    <DebugInfo
      sessionId={session?.session_id ?? ''}
      {userCanvases}
      {sessions}
      {addToast}
      refreshSessions={sessionManager?.refreshSessions ?? (async () => {})}
      refreshCanvases={sessionManager?.refreshCanvases ?? (async () => {})}
    />
  {/if}

  {#if currentTab === 'canvas'}
    {#if session && userData}
      <ChannelManager
        sessionId={session.session_id}
        {userData}
        {ctx}
        bind:onlineUsers
        bind:this={channelManager}
        on:stroke={handleStrokeReceived}
        on:toast={(e) => addToast(e.detail.message, e.detail.type)}
      />
    {/if}
    <div class="canvas-wrapper">
      <DrawingCanvas
        bind:ctx
        bind:currentPressure
        {brushColor}
        {brushSize}
        {brushType}
        {pressureResponsive}
        {session}
        {userData}
        bind:this={canvasComponent}
        on:stroke={(e) => channelManager?.sendStroke(e.detail)}
      />
      <div class="canvas-buttons">
        <button on:click={handleSaveCanvas}>💾 Save Canvas</button>
        <button on:click={() => canvasComponent?.clearCanvas()}>🧹 Clear Canvas</button>
      </div>
    </div>
    <OnlineUsers {onlineUsers} />
  {/if}

  {#if currentTab === 'gallery'}
    <div class="gallery">
      {#if userCanvases.length === 0}
        <p>No saved canvases found.</p>
      {:else}
        {#each userCanvases as canvas}
          <div class="gallery-item">
            <h3>{canvas.title}</h3>
            {#if canvas.image_data}
              <img src={canvas.image_data} alt="Saved canvas image" />
            {:else}
              <p><em>No image data available</em></p>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    background-color: #1a1a1a;
    color: #ccc;
    font-family: 'Courier New', Courier, monospace;
    min-height: 100vh;
    padding: 20px;
  }
  .tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  .tabs button {
    background-color: #222;
    color: #ccc;
    border: 1px solid #444;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
    font-weight: bold;
    font-family: inherit;
    border-radius: 4px;
    transition: background 0.3s, color 0.3s;
  }
  .tabs button:hover {
    background-color: #333;
    color: #fff;
  }
  .tabs button.active {
    background-color: #0f0;
    color: #000;
    border: 1px solid #0f0;
  }
  .tab-link {
    background-color: #222;
    color: #ccc;
    border: 1px solid #444;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
    font-weight: bold;
    font-family: inherit;
    border-radius: 4px;
    transition: background 0.3s, color 0.3s;
    text-decoration: none;
    display: flex;
    align-items: center;
  }
  .tab-link:hover {
    background-color: #333;
    color: #fff;
  }
  .canvas-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    width: 100%;
  }
  .canvas-buttons {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }
  .canvas-buttons button {
    background-color: #222;
    color: #ccc;
    border: 1px solid #444;
    padding: 0.5rem 1rem;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
  }
  .canvas-buttons button:hover {
    background-color: #0f0;
    color: #000;
    border-color: #0f0;
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
  .gallery-item {
    background: #222;
    padding: 1rem;
    border: 1px dashed #555;
    border-radius: 6px;
    text-align: center;
  }
  .gallery-item img {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    background: #000;
    margin-top: 0.5rem;
    border: 1px solid #333;
  }
</style>
