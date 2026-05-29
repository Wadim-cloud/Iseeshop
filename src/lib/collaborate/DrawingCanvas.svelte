<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';
  import { supabase } from '$lib/supabase';
  import type { Stroke, UserData, Session, BrushType } from './types.js';

  export let ctx: CanvasRenderingContext2D | null = null;
  export let brushColor: string = '#000000';
  export let brushSize: number = 5;
  export let brushType: BrushType = 'normal';
  export let session: Session | null = null;
  export let userData: UserData | null = null;

  const dispatch = createEventDispatcher<{ stroke: Stroke }>();
  const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

  let canvas: HTMLCanvasElement;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Motion capture state
  let sessionStartTime = 0;
  let currentStrokeId = '';
  let lastTimestamp = 0;
  let lastVelocity = 0;
  let lastDx = 0;
  let lastDy = 0;
  export let currentPressure: number = 0.5;
  export let pressureResponsive: boolean = false;

  function generateStrokeId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

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

    sessionStartTime = Date.now();
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
        strokes.forEach((stroke: Stroke) => {
          ctx!.beginPath();
          ctx!.moveTo(stroke.x0, stroke.y0);
          ctx!.lineTo(stroke.x1, stroke.y1);
          ctx!.strokeStyle = stroke.color;
          ctx!.lineWidth = stroke.width;
          ctx!.stroke();
        });
      }
    } catch (error) {
      console.error('Failed to load strokes:', error);
    }
  }

  function getPosition(e: PointerEvent) {
    if (!canvas || !browser) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDrawing(e: PointerEvent) {
    if (!ctx || !session?.session_id || !userData || !browser) return;
    isDrawing = true;
    currentStrokeId = generateStrokeId();
    const pos = getPosition(e);
    lastX = pos.x;
    lastY = pos.y;
    lastTimestamp = Date.now();
    lastVelocity = 0;
    lastDx = 0;
    lastDy = 0;
    canvas.setPointerCapture(e.pointerId);
  }

  function draw(e: PointerEvent) {
    if (!isDrawing || !ctx || !session?.session_id || !userData || !browser) return;

    const pos = getPosition(e);
    const x = pos.x;
    const y = pos.y;

    // Compute motion metrics
    const now = Date.now();
    const dt = now - lastTimestamp;
    const dx = x - lastX;
    const dy = y - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = dt > 0 ? distance / dt : 0;
    const acceleration = dt > 0 ? (velocity - lastVelocity) / dt : 0;
    const pressure = e.pressure !== undefined ? e.pressure : 0.5;
    currentPressure = pressure;

    // Hesitation: pause > 200ms between points
    const is_hesitation = dt > 200;

    // Correction: direction reversal (dot product of consecutive vectors < 0)
    const hasPrevDirection = lastDx !== 0 || lastDy !== 0;
    const dotProduct = hasPrevDirection ? (dx * lastDx + dy * lastDy) : 1;
    const is_correction = hasPrevDirection && dotProduct < 0;

    // Pressure-responsive rendering
    if (pressureResponsive) {
      ctx.globalAlpha = Math.max(0.2, pressure);
      ctx.lineWidth = brushSize * (0.5 + pressure);
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (pressureResponsive) {
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = brushSize;
    }

    const stroke: Stroke = {
      x0: lastX,
      y0: lastY,
      x1: x,
      y1: y,
      color: brushColor,
      width: brushSize,
      timestamp: now - sessionStartTime,
      stroke_id: currentStrokeId,
      velocity,
      acceleration,
      pressure,
      brush_type: brushType,
      is_hesitation,
      is_correction,
    };
    dispatch('stroke', stroke);

    lastX = x;
    lastY = y;
    lastTimestamp = now;
    lastVelocity = velocity;
    lastDx = dx;
    lastDy = dy;
  }

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      currentStrokeId = '';
      lastVelocity = 0;
    }
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
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
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
      canvas?.addEventListener('pointerdown', startDrawing);
      canvas?.addEventListener('pointermove', draw);
      canvas?.addEventListener('pointerup', stopDrawing);
      canvas?.addEventListener('pointerout', stopDrawing);
      canvas?.addEventListener('pointercancel', stopDrawing);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('resize', handleResize);
      canvas?.removeEventListener('pointerdown', startDrawing);
      canvas?.removeEventListener('pointermove', draw);
      canvas?.removeEventListener('pointerup', stopDrawing);
      canvas?.removeEventListener('pointerout', stopDrawing);
      canvas?.removeEventListener('pointercancel', stopDrawing);
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
