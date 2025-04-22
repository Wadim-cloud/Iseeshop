<script lang="ts">
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let color: string;
  export let size: number;
  export let canvasStore: Writable<{ canvas: HTMLCanvasElement | null }> | undefined;
  export let disabled = false;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null;
  let drawing = false;
  let coords: { x: number; y: number } | null = null;

  onMount(() => {
    context = canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get 2D context');
      return;
    }

    console.log('Canvas bound:', !!canvas);
    if (canvasStore) {
      canvasStore.set({ canvas });
    } else {
      console.warn('canvasStore not provided; canvas not stored');
    }

    resizeCanvas();
    if (!disabled) {
      setupEventListeners();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('touchstart', preventTouch);
      canvas.removeEventListener('touchmove', preventTouch);
      if (canvasStore) {
        canvasStore.set({ canvas: null });
      }
    };
  });

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      clearCanvas();
    }
  }

  function clearCanvas() {
    if (context) {
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function preventTouch(e: Event) {
    e.preventDefault();
  }

  function setupEventListeners() {
    canvas.addEventListener('touchstart', preventTouch, { passive: false });
    canvas.addEventListener('touchmove', preventTouch, { passive: false });
    window.addEventListener('resize', resizeCanvas);
  }

  function getCoordinates(e: PointerEvent | TouchEvent) {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as PointerEvent).offsetX,
      y: (e as PointerEvent).offsetY
    };
  }

  function startDrawing(e: PointerEvent | TouchEvent) {
    if (disabled) return;
    e.preventDefault();
    drawing = true;
    coords = getCoordinates(e);
    if (coords) {
      drawPoint(coords.x, coords.y);
    }
  }

  function draw(e: PointerEvent | TouchEvent) {
    if (!drawing || !coords || disabled) return;
    e.preventDefault();

    const prev = coords;
    coords = getCoordinates(e);

    if (context) {
      context.lineWidth = size;
      context.lineCap = 'round';
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(prev.x, prev.y);
      context.lineTo(coords.x, coords.y);
      context.stroke();
    }
  }

  function stopDrawing(e: PointerEvent | TouchEvent) {
    if (disabled) return;
    e.preventDefault();
    drawing = false;
    coords = null;
  }

  function drawPoint(x: number, y: number) {
    if (context) {
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, size / 2, 0, Math.PI * 2);
      context.fill();
    }
  }

  // Update context when props change
  $: if (context && (color || size)) {
    context.strokeStyle = color;
    context.lineWidth = size;
    context.fillStyle = color;
  }
</script>

<canvas
  bind:this={canvas}
  on:pointerdown={startDrawing}
  on:pointermove={draw}
  on:pointerup={stopDrawing}
  on:pointerleave={stopDrawing}
  class:disabled
/>

<style>
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    touch-action: none;
    background: white;
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
</style>