<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { supabase } from '$lib/supabase';
  import type { Stroke } from './types.js';

  export let sessionId: string = '';
  export let playbackSpeed: number = 1.0;
  export let strokes: Stroke[] = [];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let isPlaying = false;
  let isPaused = false;
  let currentIndex = 0;
  let totalDuration = 0;
  let currentTime = 0;
  let animationId: number | null = null;
  let playbackStartTime = 0;
  let pausedAtTime = 0;
  let prevPlaybackSpeed = 1.0;

  // Recalculate playbackStartTime when speed changes mid-playback
  $: if (playbackSpeed !== prevPlaybackSpeed && isPlaying && !isPaused && strokes.length > 0) {
    const baseTimestamp = strokes[0]?.timestamp || 0;
    const contentElapsed = (performance.now() - playbackStartTime) * prevPlaybackSpeed;
    playbackStartTime = performance.now() - contentElapsed / playbackSpeed;
    prevPlaybackSpeed = playbackSpeed;
  }

  // Stats
  let hesitationCount = 0;
  let correctionCount = 0;
  let uniqueStrokeIds: Set<string> = new Set();

  const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

  function setupCanvas() {
    if (!canvas || !browser) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }

  function computeStats() {
    hesitationCount = strokes.filter(s => s.is_hesitation).length;
    correctionCount = strokes.filter(s => s.is_correction).length;
    uniqueStrokeIds = new Set(strokes.map(s => s.stroke_id));
    if (strokes.length > 0) {
      totalDuration = Math.max(...strokes.map(s => s.timestamp)) - Math.min(...strokes.map(s => s.timestamp));
    }
  }

  async function loadStrokes() {
    if (!sessionId || !browser) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) return;

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-strokes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      strokes = (data.strokes || []).sort((a: Stroke, b: Stroke) => a.timestamp - b.timestamp);
      computeStats();
    } catch (error) {
      console.error('Failed to load strokes for replay:', error);
    }
  }

  function drawStroke(stroke: Stroke) {
    if (!ctx) return;

    if (stroke.pressure !== undefined && stroke.pressure !== 0.5) {
      ctx.globalAlpha = Math.max(0.2, stroke.pressure);
      ctx.lineWidth = stroke.width * (0.5 + stroke.pressure);
    } else {
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = stroke.width;
    }

    ctx.beginPath();
    ctx.moveTo(stroke.x0, stroke.y0);
    ctx.lineTo(stroke.x1, stroke.y1);
    ctx.strokeStyle = stroke.color;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    ctx.lineWidth = stroke.width;
  }

  function drawHesitationMarker(stroke: Stroke) {
    if (!ctx || !stroke.is_hesitation) return;
    ctx.save();
    const gradient = ctx.createRadialGradient(stroke.x0, stroke.y0, 0, stroke.x0, stroke.y0, 15);
    gradient.addColorStop(0, 'rgba(255, 165, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(stroke.x0, stroke.y0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCorrectionMarker(stroke: Stroke) {
    if (!ctx || !stroke.is_correction) return;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
    ctx.beginPath();
    ctx.arc(stroke.x0, stroke.y0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function replayLoop() {
    if (!isPlaying || isPaused || currentIndex >= strokes.length) {
      if (currentIndex >= strokes.length) {
        isPlaying = false;
        isPaused = false;
      }
      return;
    }

    const elapsed = (performance.now() - playbackStartTime) * playbackSpeed;
    const baseTimestamp = strokes[0]?.timestamp || 0;

    while (currentIndex < strokes.length) {
      const stroke = strokes[currentIndex];
      const strokeRelativeTime = stroke.timestamp - baseTimestamp;

      if (strokeRelativeTime <= elapsed) {
        drawStroke(stroke);
        drawHesitationMarker(stroke);
        drawCorrectionMarker(stroke);
        currentTime = stroke.timestamp;
        currentIndex++;
      } else {
        break;
      }
    }

    if (currentIndex < strokes.length) {
      animationId = requestAnimationFrame(replayLoop);
    } else {
      isPlaying = false;
    }
  }

  export function play() {
    if (strokes.length === 0) return;
    if (isPaused) {
      isPaused = false;
      const baseTimestamp = strokes[0]?.timestamp || 0;
      playbackStartTime = performance.now() - (pausedAtTime - baseTimestamp) / playbackSpeed;
      animationId = requestAnimationFrame(replayLoop);
      return;
    }
    restart();
  }

  export function pause() {
    isPaused = true;
    pausedAtTime = currentTime;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  export function restart() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    currentIndex = 0;
    currentTime = strokes[0]?.timestamp || 0;
    isPlaying = true;
    isPaused = false;
    playbackStartTime = performance.now();
    animationId = requestAnimationFrame(replayLoop);
  }

  export function seek(timestamp: number) {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    currentIndex = 0;
    for (let i = 0; i < strokes.length; i++) {
      if (strokes[i].timestamp <= timestamp) {
        drawStroke(strokes[i]);
        drawHesitationMarker(strokes[i]);
        drawCorrectionMarker(strokes[i]);
        currentIndex = i + 1;
        currentTime = strokes[i].timestamp;
      } else {
        break;
      }
    }

    if (isPlaying && !isPaused) {
      const baseTimestamp = strokes[0]?.timestamp || 0;
      playbackStartTime = performance.now() - (timestamp - baseTimestamp) / playbackSpeed;
      animationId = requestAnimationFrame(replayLoop);
    }
  }

  function handleScrub(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const minTs = strokes[0]?.timestamp || 0;
    const seekTs = minTs + pct * totalDuration;
    seek(seekTs);
  }

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  $: if (strokes.length > 0) {
    computeStats();
  }

  $: progressPct = totalDuration > 0
    ? ((currentTime - (strokes[0]?.timestamp || 0)) / totalDuration) * 100
    : 0;

  onMount(() => {
    if (browser) {
      setupCanvas();
      if (sessionId && strokes.length === 0) {
        loadStrokes();
      }
    }
  });

  onDestroy(() => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
  });
</script>

<div class="replay-container">
  <canvas bind:this={canvas} class="replay-canvas"></canvas>

  <div class="replay-controls">
    <div class="control-buttons">
      {#if !isPlaying || isPaused}
        <button on:click={play} class="play-btn">▶ Play</button>
      {:else}
        <button on:click={pause} class="pause-btn">⏸ Pause</button>
      {/if}
      <button on:click={restart} class="restart-btn">↺ Restart</button>

      <select bind:value={playbackSpeed} class="speed-select">
        <option value={0.25}>0.25x</option>
        <option value={0.5}>0.5x</option>
        <option value={1.0}>1x</option>
        <option value={2.0}>2x</option>
        <option value={4.0}>4x</option>
      </select>
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="scrubber" on:click={handleScrub}>
      <div class="scrubber-fill" style="width: {progressPct}%"></div>
      <div class="scrubber-handle" style="left: {progressPct}%"></div>
    </div>

    <div class="time-display">
      <span>{formatTime(currentTime - (strokes[0]?.timestamp || 0))}</span>
      <span>/</span>
      <span>{formatTime(totalDuration)}</span>
    </div>
  </div>

  <div class="replay-stats">
    <div class="stat">
      <span class="stat-label">Strokes</span>
      <span class="stat-value">{uniqueStrokeIds.size}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Points</span>
      <span class="stat-value">{strokes.length}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Hesitations</span>
      <span class="stat-value hesitation">{hesitationCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Corrections</span>
      <span class="stat-value correction">{correctionCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Duration</span>
      <span class="stat-value">{formatTime(totalDuration)}</span>
    </div>
  </div>
</div>

<style>
  .replay-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
  .replay-canvas {
    width: 100%;
    height: 400px;
    border: 1px solid #444;
    background-color: white;
    border-radius: 6px;
  }
  .replay-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #222;
    border-radius: 6px;
    border: 1px solid #444;
  }
  .control-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .control-buttons button {
    padding: 0.4rem 0.8rem;
    background: #333;
    color: #ccc;
    border: 1px solid #555;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-weight: bold;
    transition: all 0.2s;
  }
  .control-buttons button:hover {
    background: #0f0;
    color: #000;
    border-color: #0f0;
  }
  .speed-select {
    padding: 0.4rem;
    background: #333;
    color: #ccc;
    border: 1px solid #555;
    border-radius: 4px;
    font-family: inherit;
    margin-left: auto;
  }
  .scrubber {
    height: 8px;
    background: #444;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  }
  .scrubber-fill {
    height: 100%;
    background: #0f0;
    border-radius: 4px;
    transition: width 0.05s linear;
  }
  .scrubber-handle {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    background: #0f0;
    border: 2px solid #000;
    border-radius: 50%;
    pointer-events: none;
  }
  .time-display {
    display: flex;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: #888;
    justify-content: center;
  }
  .replay-stats {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 1rem;
    background: #222;
    border: 1px solid #444;
    border-radius: 6px;
    min-width: 80px;
  }
  .stat-label {
    font-size: 0.7rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .stat-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: #0f0;
  }
  .stat-value.hesitation {
    color: #ffa500;
  }
  .stat-value.correction {
    color: #f44;
  }
</style>
