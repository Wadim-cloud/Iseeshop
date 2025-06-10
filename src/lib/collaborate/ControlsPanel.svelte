<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Session, Canvas, Toast } from './types.js';

  export let canvasId: string = '';
  export let title: string = 'Collaborative Session';
  export let brushColor: string = '#000000';
  export let brushSize: number = 5;
  export let userCanvases: Canvas[] = [];
  export let sessions: Session[] = [];
  export let isLoading: boolean = false;
  export let shareLink: string = '';
  export let currentSessionId: string | null = null;

  const dispatch = createEventDispatcher<{
    createSession: string;
    createCanvas: string;
    saveCanvas: void;
    clearCanvas: void;
    loadSession: string;
    loadCanvas: string;
    updateBrush: { color: string; size: number };
    toast: Toast;
  }>();

  let newSessionTitle: string = '';
  let newCanvasTitle: string = '';

  $: console.log('userCanvases:', userCanvases);

  function validateTitle(title: string, existing: { title: string | null }[]): boolean {
    if (!title.trim()) {
      dispatch('toast', { id: crypto.randomUUID(), message: 'Title is required', type: 'error' });
      return false;
    }
    if (title.trim().length < 3) {
      dispatch('toast', { id: crypto.randomUUID(), message: 'Title must be at least 3 characters', type: 'error' });
      return false;
    }
    if (existing.some(item => item.title && item.title.toLowerCase() === title.trim().toLowerCase())) {
      dispatch('toast', { id: crypto.randomUUID(), message: 'Title already exists', type: 'error' });
      return false;
    }
    return true;
  }

  function handleCreateSession() {
    console.log('handleCreateSession called with newSessionTitle:', newSessionTitle);
    if (!validateTitle(newSessionTitle, sessions)) return;
    console.log('Dispatching createSession event with title:', newSessionTitle.trim());
    dispatch('createSession', newSessionTitle.trim());
    newSessionTitle = '';
  }

  function handleCreateCanvas() {
    console.log('handleCreateCanvas called with newCanvasTitle:', newCanvasTitle);
    if (!validateTitle(newCanvasTitle, userCanvases)) return;
    console.log('Dispatching createCanvas event with title:', newCanvasTitle.trim());
    dispatch('createCanvas', newCanvasTitle.trim());
    newCanvasTitle = '';
  }

  function handleLoadSession(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      console.log('Loading session:', select.value);
      dispatch('loadSession', select.value);
    }
  }

  function handleLoadCanvas(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      console.log('Loading canvas:', select.value);
      dispatch('loadCanvas', select.value);
    }
  }

  $: dispatch('updateBrush', { color: brushColor, size: brushSize });
</script>

<div class="controls-panel">
  <h2>{title}</h2>
  <div class="control-group">
    <label for="new-session-title">New Session Title:</label>
    <input
      id="new-session-title"
      type="text"
      bind:value={newSessionTitle}
      placeholder="Enter session title"
      disabled={isLoading}
    />
    <button on:click={handleCreateSession} disabled={isLoading}>New Session</button>
  </div>
  <div class="control-group">
    <label for="new-canvas-title">New Canvas Title:</label>
    <input
      id="new-canvas-title"
      type="text"
      bind:value={newCanvasTitle}
      placeholder="Enter canvas title"
      disabled={isLoading || !currentSessionId}
    />
    <button on:click={handleCreateCanvas} disabled={isLoading || !currentSessionId}>New Canvas</button>
  </div>
  <div class="control-group">
    <label for="session-select">Load Session:</label>
    <select id="session-select" on:change={handleLoadSession} disabled={isLoading}>
      <option value="">Select a session</option>
      {#each sessions as session}
        <option value={session.session_id} selected={session.session_id === currentSessionId}>
          {session.title}
        </option>
      {/each}
    </select>
  </div>
  <div class="control-group">
    <label for="canvas-select">Load Canvas:</label>
    <select id="canvas-select" on:change={handleLoadCanvas} disabled={isLoading || !currentSessionId}>
      <option value="">Select a canvas</option>
      {#each userCanvases as canvas}
        <option value={canvas.canvas_id} selected={canvas.canvas_id === canvasId}>
          {canvas.title || 'Untitled'}
        </option>
      {/each}
    </select>
  </div>
  <div class="control-group">
    <label for="brush-color">Brush Color:</label>
    <input id="brush-color" type="color" bind:value={brushColor} disabled={isLoading} />
  </div>
  <div class="control-group">
    <label for="brush-size">Brush Size:</label>
    <input
      id="brush-size"
      type="range"
      min="1"
      max="20"
      bind:value={brushSize}
      disabled={isLoading}
    />
    <span>{brushSize}px</span>
  </div>
  <div class="control-group">
    <button on:click={() => dispatch('saveCanvas')} disabled={isLoading}>Save Canvas</button>
    <button on:click={() => dispatch('clearCanvas')} disabled={isLoading}>Clear Canvas</button>
  </div>
  {#if shareLink}
    <div class="control-group">
      <label>Share Link:</label>
      <input
        type="text"
        value={shareLink}
        readonly
        on:click={(e) => {
          (e.target as HTMLInputElement).select();
          document.execCommand('copy');
          dispatch('toast', { id: crypto.randomUUID(), message: 'Share link copied!', type: 'success' });
        }}
      />
    </div>
  {/if}
</div>

<style>
  .controls-panel {
    width: 100%;
    max-width: 600px;
    padding: 1rem;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    color: #333;
  }
  .control-group {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }
  label {
    flex: 0 0 120px;
    color: #555;
    font-size: 0.9rem;
  }
  input[type="text"],
  input[type="color"],
  select {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  input[type="range"] {
    flex: 1;
  }
  button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  button:hover:not(:disabled) {
    background: #0056b3;
  }
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  input[readonly] {
    background: #f8f8f8;
    cursor: pointer;
  }
  input[readonly]:hover {
    background: #e8ecef;
  }
</style>