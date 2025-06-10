<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';
  import { supabase } from '$lib/supabase';
  import type { Stroke, UserData, Session } from './types.js';

  export let ctx: CanvasRenderingContext2D | null = null;
  export let brushColor: string = '#000000';
  export let brushSize: number = 5;
  export let session: Session | null = null;
  export let userData: UserData | null = null;

  const dispatch = createEventDispatcher<{ stroke: Stroke }>();
  const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

  let canvas: HTMLCanvasElement;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

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
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    }
  }

  $: if (ctx) {
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
  }

  async function loadStrokes() {
    if (!session?.session_id || !userData || !browser) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        console.error('No valid session for loading strokes');
        return;
      }

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-strokes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: session.session_id }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const { strokes } = await res.json();
      if (ctx && strokes.length) {
        strokes.forEach(stroke => {
          ctx.beginPath();
          ctx.moveTo(stroke.x0, stroke.y0);
          ctx.lineTo(stroke.x1, stroke.y1);
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width;
          ctx.stroke();
        });
      }
    } catch (error) {
      console.error('Failed to load strokes:', error);
    }
  }

  function getPosition(e: MouseEvent | TouchEvent) {
    if (!canvas || !browser) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  async function startDrawing(e: MouseEvent | TouchEvent) {
    if (!ctx || !session?.session_id || !userData || !browser) return;
    isDrawing = true;
    const pos = getPosition(e);
    lastX = pos.x;
    lastY = pos.y;
  }

  async function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing || !ctx || !session?.session_id || !userData || !browser) return;

    const pos = getPosition(e);
    const x = pos.x;
    const y = pos.y;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    const stroke: Stroke = { x0: lastX, y0: lastY, x1: x, y1: y, color: brushColor, width: brushSize };
    dispatch('stroke', stroke);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error('No access token');

      await fetch(`${SUPABASE_FUNCTIONS_URL}/save-stroke`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.session_id,
          x0: stroke.x0,
          y0: stroke.y0,
          x1: stroke.x1,
          y1: stroke.y1,
          color: stroke.color,
          width: stroke.width
        }),
      });
    } catch (error) {
      console.error('Failed to save stroke:', error);
    }

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  export function clearCanvas() {
    if (ctx && canvas && browser) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  export function drawRemoteStroke(stroke: Stroke) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(stroke.x0, stroke.y0);
    ctx.lineTo(stroke.x1, stroke.y1);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.stroke();
  }

  export function saveCanvas(): string | null {
    if (!canvas || !browser) return null;
    return canvas.toDataURL('image/png');
  }

  export function loadImage(imageData: string) {
    if (!ctx || !canvas || !imageData) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageData;
  }

  function handleResize() {
    if (!canvas || !ctx || !browser) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth * dpr;
    const height = canvas.offsetHeight * dpr;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

    canvas.width = width;
    canvas.height = height;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    if (tempCtx) ctx.drawImage(tempCanvas, 0, 0);
    loadStrokes();
  }

  onMount(() => {
    if (browser) {
      setupCanvas();
      if (session?.session_id && userData) loadStrokes();
      window.addEventListener('resize', handleResize);
      canvas?.addEventListener('mousedown', startDrawing);
      canvas?.addEventListener('mousemove', draw);
      canvas?.addEventListener('mouseup', stopDrawing);
      canvas?.addEventListener('mouseout', stopDrawing);
      canvas?.addEventListener('touchstart', startDrawing);
      canvas?.addEventListener('touchmove', draw);
      canvas?.addEventListener('touchend', stopDrawing);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('resize', handleResize);
      canvas?.removeEventListener('mousedown', startDrawing);
      canvas?.removeEventListener('mousemove', draw);
      canvas?.removeEventListener('mouseup', stopDrawing);
      canvas?.removeEventListener('mouseout', stopDrawing);
      canvas?.removeEventListener('touchstart', startDrawing);
      canvas?.removeEventListener('touchmove', draw);
      canvas?.removeEventListener('touchend', stopDrawing);
    }
  });
</script>

<canvas bind:this={canvas} class="drawing-canvas"></canvas>

<style>
  .drawing-canvas {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
    background-color: white;
    touch-action: none;
  }
</style>
