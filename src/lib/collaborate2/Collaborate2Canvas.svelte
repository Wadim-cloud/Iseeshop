<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '$lib/supabase';
  import type { Stroke, UserData, Session } from '$lib/collaborate/types.js';

  export let ctx: CanvasRenderingContext2D | null = null;
  export let brushColor: string = '#000000';
  export let brushSize: number = 5;
  export let session: Session | null = null;
  export let userData: UserData | null = null;

  const dispatch = createEventDispatcher<{ stroke: Stroke }>();

  let canvas: HTMLCanvasElement;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  const maxStrokes = 1000;
  let strokeCount = 0;

  function setupCanvas() {
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

  function getPosition(e: MouseEvent | TouchEvent) {
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

  function startDrawing(e: MouseEvent | TouchEvent) {
    if (strokeCount >= maxStrokes) return;
    isDrawing = true;
    const pos = getPosition(e);
    lastX = pos.x;
    lastY = pos.y;
    lastTime = Date.now();
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing || !ctx || strokeCount >= maxStrokes) return;

    const pos = getPosition(e);
    const now = Date.now();
    const dt = now - lastTime;
    const dx = pos.x - lastX;
    const dy = pos.y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = dist / (dt || 1);

    const width = Math.min(10, Math.max(1, speed * 0.5));
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineWidth = width;
    ctx.strokeStyle = brushColor;
    ctx.stroke();

    const stroke: Stroke = {
      x0: lastX, y0: lastY, x1: pos.x, y1: pos.y,
      color: brushColor, width
    };
    dispatch('stroke', stroke);
    strokeCount++;

    lastX = pos.x;
    lastY = pos.y;
    lastTime = now;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  onMount(() => {
    setupCanvas();
    canvas?.addEventListener('mousedown', startDrawing);
    canvas?.addEventListener('mousemove', draw);
    canvas?.addEventListener('mouseup', stopDrawing);
    canvas?.addEventListener('touchstart', startDrawing);
    canvas?.addEventListener('touchmove', draw);
    canvas?.addEventListener('touchend', stopDrawing);
  });

  onDestroy(() => {
    canvas?.removeEventListener('mousedown', startDrawing);
    canvas?.removeEventListener('mousemove', draw);
    canvas?.removeEventListener('mouseup', stopDrawing);
    canvas?.removeEventListener('touchstart', startDrawing);
    canvas?.removeEventListener('touchmove', draw);
    canvas?.removeEventListener('touchend', stopDrawing);
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
