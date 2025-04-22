<!-- src/lib/CanvasShader.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
  
    let canvas: HTMLCanvasElement;
    let animationFrame: number;
  
    onMount(() => {
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      // Simple gradient background (replace with actual shader logic if needed)
      const render = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#d0e0ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animationFrame = requestAnimationFrame(render);
      };
  
      render();
  
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    });
  
    onDestroy(() => {
      cancelAnimationFrame(animationFrame);
    });
  </script>
  
  <canvas bind:this={canvas} class="shader"></canvas>
  
  <style>
    .shader {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>