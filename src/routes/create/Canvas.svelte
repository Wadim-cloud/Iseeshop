<script>
  import { onMount, createEventDispatcher } from 'svelte';

  export let canvasRef;
  export let brushColor;
  export let brushSize;
  export let brushType;
  export let backgroundPattern;
  export let lineOpacity;

  let canvas;
  let ctx;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let twirlAngle = 0;
  let twirlFrameId = null;
  const STOP_DRIP_LENGTH = 150; // Y-axis drip on stop
  const TWIRL_RADIUS = 18.75; // 0.5 cm (~18.75 pixels at 96 DPI)
  const TWIRL_SPEED = 0.1; // Radians per frame
  const HORIZONTAL_LENGTH = 187.5; // 5 cm (~187.5 pixels at 96 DPI)

  const dispatch = createEventDispatcher();

  onMount(() => {
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      updateCanvasBackground();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    canvasRef = {
      toDataURL: (type, quality) => canvas.toDataURL(type, quality),
      clear: () => {
        if (ctx) {
          updateCanvasBackground();
        }
      },
      loadImage: (src) => {
        const img = new Image();
        img.onload = () => {
          if (ctx) {
            updateCanvasBackground();
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        };
        img.src = src;
      }
    };

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', stopDrawing);
      if (twirlFrameId) cancelAnimationFrame(twirlFrameId);
    };
  });

  function updateCanvasBackground() {
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply pattern
    if (backgroundPattern === 'blank') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (backgroundPattern === 'striped') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Chaotic scratch-like lines
      for (let i = 0; i < 80; i++) {
        const x1 = Math.random() * canvas.width;
        const y1 = Math.random() * canvas.height;
        const angle = Math.random() * 2 * Math.PI;
        const length = 20 + Math.random() * 60; // 20-80px
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1 + Math.random(); // 1-2px
        ctx.globalAlpha = 0.3 + Math.random() * 0.2; // 0.3-0.5
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (backgroundPattern === 'pied-de-poule') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      const size = 10; // Small houndstooth unit
      for (let x = 0; x < canvas.width; x += size * 2) {
        for (let y = 0; y < canvas.height; y += size * 2) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + size / 2, y);
          ctx.lineTo(x + size, y + size / 2);
          ctx.lineTo(x + size / 2, y + size);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  $: if (backgroundPattern) {
    updateCanvasBackground();
  }

  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
    if (brushType === 'twirl') {
      twirlAngle = 0;
    }
  }

  function drawTwirl() {
    if (!ctx || !isDrawing || brushType !== 'twirl') return;

    twirlAngle += TWIRL_SPEED;
    const radius = TWIRL_RADIUS * (1 + Math.sin(twirlAngle * 2) * 0.2); // Slight oscillation
    const x = lastX + Math.cos(twirlAngle) * radius;
    const y = lastY + Math.sin(twirlAngle) * radius;

    ctx.beginPath();
    ctx.moveTo(lastX + Math.cos(twirlAngle - TWIRL_SPEED) * radius, lastY + Math.sin(twirlAngle - TWIRL_SPEED) * radius);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize / 2; // Thicker twirl
    ctx.globalAlpha = lineOpacity;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function draw(e) {
    if (!isDrawing || !ctx) return;
    e.preventDefault();
    const [x, y] = getCoordinates(e);
    if (brushType === 'normal') {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = lineOpacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (brushType === 'twirl') {
      // Draw base path (thin line)
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize / 4; // Thin base line
      ctx.globalAlpha = lineOpacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
      // Draw twirl effect
      drawTwirl();
    } else if (brushType === 'horizontal') {
      // Draw base path (thin line)
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize / 4; // Thin base line
      ctx.globalAlpha = lineOpacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    if (isDrawing && ctx) {
      // Y-axis drip for all brushes
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(lastX, lastY + STOP_DRIP_LENGTH);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize / 3;
      ctx.globalAlpha = lineOpacity;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Horizontal line for horizontal brush
      if (brushType === 'horizontal') {
        const halfLength = HORIZONTAL_LENGTH / 2;
        const xStart = Math.max(0, lastX - halfLength);
        const xEnd = Math.min(canvas.width, lastX + halfLength);
        ctx.beginPath();
        ctx.moveTo(xStart, lastY);
        ctx.lineTo(xEnd, lastY);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.globalAlpha = lineOpacity;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    isDrawing = false;
    if (twirlFrameId) {
      cancelAnimationFrame(twirlFrameId);
      twirlFrameId = null;
    }
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    let x = 0, y = 0;
    if (e.type.includes('touch')) {
      x = e.touches[0]?.clientX - rect.left || lastX;
      y = e.touches[0]?.clientY - rect.top || lastY;
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
</script>

<style>
  canvas {
    border: 2px solid #333;
  }
</style>

<canvas bind:this={canvas} width="800" height="600"></canvas>