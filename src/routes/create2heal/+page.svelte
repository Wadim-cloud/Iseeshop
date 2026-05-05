<script>
  export const ssr = false;
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { supabase } from '$lib/supabase';

  let canvas;
  let ctx;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Drawing settings
  let brushColor = '#000000';
  let brushSize = 5;
  let brushType = 'normal';
  let backgroundPattern = 'blank';
  let lineOpacity = 1;
  let pressureResponsive = true;
  const colors = ['#000000', '#e53e3e', '#3182ce', '#38a169', '#d69e2e', '#805ad5'];
  const brushTypes = ['normal', 'twirl', 'horizontal'];

  // Motion capture state
  let sessionStartTime = 0;
  let currentStrokeId = '';
  let lastTimestamp = 0;
  let lastVelocity = 0;
  let lastDx = 0;
  let lastDy = 0;
  let currentPressure = 0.5;
  let twirlAngle = 0;

  // Session strokes (in-memory only, no collaborate tables)
  let strokes = [];
  let strokeStartTimes = {};

  // Real-time metrics
  let totalPoints = 0;
  let totalStrokes = 0;
  let hesitationCount = 0;
  let correctionCount = 0;
  let velocities = [];
  let pressures = [];
  let accelerations = [];
  let brushUsage = {};
  let sessionDuration = 0;
  let durationInterval;

  // Velocity sparkline data (last 60 seconds, 1 per second)
  let velocitySpark = [];
  let lastSparkSecond = 0;
  let currentSecondVelocities = [];

  // Drawing title
  let drawingTitle = 'Healing Session';
  let session;
  let toasts = [];
  let showSettings = false;

  const TWIRL_RADIUS = 18.75;
  const TWIRL_SPEED = 0.1;
  const STOP_DRIP_LENGTH = 150;
  const HORIZONTAL_LENGTH = 187.5;

  function addToast(message, type = 'info', duration = 3000) {
    const id = Math.random().toString(36).substr(2, 9);
    toasts = [...toasts, { id, message, type }];
    setTimeout(() => { toasts = toasts.filter(t => t.id !== id); }, duration);
  }

  function generateStrokeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function setupCanvas() {
    if (!canvas || !browser) return;
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      updateCanvasBackground();
    }
    sessionStartTime = Date.now();
  }

  function updateCanvasBackground() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundPattern === 'blank') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (backgroundPattern === 'striped') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 80; i++) {
        const x1 = Math.random() * canvas.width;
        const y1 = Math.random() * canvas.height;
        const angle = Math.random() * 2 * Math.PI;
        const length = 20 + Math.random() * 60;
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1 + Math.random();
        ctx.globalAlpha = 0.3 + Math.random() * 0.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (backgroundPattern === 'pied-de-poule') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      const size = 10;
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

  $: if (browser && backgroundPattern) {
    updateCanvasBackground();
  }

  function startDrawing(e) {
    if (!ctx || !browser) return;
    isDrawing = true;
    currentStrokeId = generateStrokeId();
    totalStrokes++;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    lastTimestamp = Date.now();
    lastVelocity = 0;
    lastDx = 0;
    lastDy = 0;
    twirlAngle = 0;
    strokeStartTimes[currentStrokeId] = lastTimestamp;
    brushUsage[brushType] = (brushUsage[brushType] || 0) + 1;
    canvas.setPointerCapture(e.pointerId);
  }

  function drawTwirl() {
    if (!ctx || !isDrawing || brushType !== 'twirl') return;
    twirlAngle += TWIRL_SPEED;
    const radius = TWIRL_RADIUS * (1 + Math.sin(twirlAngle * 2) * 0.2);
    const x = lastX + Math.cos(twirlAngle) * radius;
    const y = lastY + Math.sin(twirlAngle) * radius;
    ctx.beginPath();
    ctx.moveTo(lastX + Math.cos(twirlAngle - TWIRL_SPEED) * radius, lastY + Math.sin(twirlAngle - TWIRL_SPEED) * radius);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize / 2;
    ctx.globalAlpha = lineOpacity;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function draw(e) {
    if (!isDrawing || !ctx || !browser) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();
    const dt = now - lastTimestamp;
    const dx = x - lastX;
    const dy = y - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = dt > 0 ? distance / dt : 0;
    const acceleration = dt > 0 ? (velocity - lastVelocity) / dt : 0;
    const pressure = e.pressure !== undefined && e.pressure > 0 ? e.pressure : 0.5;
    currentPressure = pressure;

    const is_hesitation = dt > 200;
    const hasPrevDirection = lastDx !== 0 || lastDy !== 0;
    const dotProduct = hasPrevDirection ? (dx * lastDx + dy * lastDy) : 1;
    const is_correction = hasPrevDirection && dotProduct < 0;

    if (is_hesitation) hesitationCount++;
    if (is_correction) correctionCount++;
    totalPoints++;
    velocities.push(velocity);
    pressures.push(pressure);
    accelerations.push(acceleration);

    // Velocity sparkline tracking
    const currentSecond = Math.floor((now - sessionStartTime) / 1000);
    if (currentSecond > lastSparkSecond) {
      if (currentSecondVelocities.length > 0) {
        const avg = currentSecondVelocities.reduce((a, b) => a + b, 0) / currentSecondVelocities.length;
        velocitySpark = [...velocitySpark.slice(-59), avg];
      }
      currentSecondVelocities = [];
      lastSparkSecond = currentSecond;
    }
    currentSecondVelocities.push(velocity);

    // Draw with pressure response
    const effectiveWidth = pressureResponsive ? brushSize * (0.5 + pressure) : brushSize;
    const effectiveAlpha = pressureResponsive ? Math.max(0.2, pressure) * lineOpacity : lineOpacity;

    if (brushType === 'normal') {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = effectiveWidth;
      ctx.globalAlpha = effectiveAlpha;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (brushType === 'twirl') {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = effectiveWidth / 4;
      ctx.globalAlpha = effectiveAlpha;
      ctx.stroke();
      ctx.globalAlpha = 1;
      drawTwirl();
    } else if (brushType === 'horizontal') {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = effectiveWidth / 4;
      ctx.globalAlpha = effectiveAlpha;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    strokes.push({
      x0: lastX, y0: lastY, x1: x, y1: y,
      color: brushColor, width: brushSize,
      timestamp: now - sessionStartTime,
      stroke_id: currentStrokeId,
      velocity, acceleration, pressure,
      brush_type: brushType,
      is_hesitation, is_correction,
    });

    lastX = x;
    lastY = y;
    lastTimestamp = now;
    lastVelocity = velocity;
    lastDx = dx;
    lastDy = dy;
  }

  function stopDrawing() {
    if (isDrawing && ctx) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(lastX, lastY + STOP_DRIP_LENGTH);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize / 3;
      ctx.globalAlpha = lineOpacity;
      ctx.stroke();
      ctx.globalAlpha = 1;

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
    currentStrokeId = '';
    lastVelocity = 0;
    lastDx = 0;
    lastDy = 0;
  }

  function clearCanvas() {
    updateCanvasBackground();
    strokes = [];
    totalPoints = 0;
    totalStrokes = 0;
    hesitationCount = 0;
    correctionCount = 0;
    velocities = [];
    pressures = [];
    accelerations = [];
    brushUsage = {};
    velocitySpark = [];
    currentSecondVelocities = [];
    lastSparkSecond = 0;
    sessionStartTime = Date.now();
    sessionDuration = 0;
  }

  async function saveDrawing() {
    if (!canvas) return;
    const imageData = canvas.toDataURL('image/png');
    try {
      const userId = session?.user?.id || null;
      const userEmail = session?.user?.email || null;
      const username = userEmail ? userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'anonymous';
      const sanitizedTitle = drawingTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

      let count = 1;
      if (userId) {
        const { count: existingCount } = await supabase
          .from('drawings')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        count = (existingCount || 0) + 1;
      }

      const newDrawingId = `${username}-${count}-${sanitizedTitle}`;
      const { error } = await supabase.from('drawings').insert({
        drawing_id: newDrawingId,
        image_data: imageData,
        title: drawingTitle.trim() || 'Healing Session',
        user_id: userId,
        user_email: userEmail,
        likes: 0,
        comments: null,
        blocked: false,
      });

      if (error) throw error;
      addToast(`Drawing saved: ${newDrawingId}`, 'success');
    } catch (error) {
      addToast('Failed to save: ' + error.message, 'error');
    }
  }

  // Computed metrics
  $: avgVelocity = velocities.length > 0 ? velocities.reduce((a, b) => a + b, 0) / velocities.length : 0;
  $: maxVelocity = velocities.length > 0 ? Math.max(...velocities) : 0;
  $: avgPressure = pressures.length > 0 ? pressures.reduce((a, b) => a + b, 0) / pressures.length : 0;
  $: pressureVariance = pressures.length > 1
    ? pressures.reduce((sum, p) => sum + Math.pow(p - avgPressure, 2), 0) / pressures.length
    : 0;
  $: avgAcceleration = accelerations.length > 0 ? accelerations.reduce((a, b) => a + b, 0) / accelerations.length : 0;
  $: hesitationRate = sessionDuration > 0 ? hesitationCount / (sessionDuration / 60) : 0;
  $: correctionRate = sessionDuration > 0 ? correctionCount / (sessionDuration / 60) : 0;
  $: flowScore = totalPoints > 0
    ? Math.max(0, Math.min(100, 100 - (hesitationRate * 5) - (correctionRate * 3) + (avgVelocity * 20)))
    : 0;
  $: steadinessScore = pressureVariance < 0.01 ? 100 : Math.max(0, 100 - pressureVariance * 500);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Sparkline SVG path
  $: sparklinePath = (() => {
    if (velocitySpark.length < 2) return '';
    const max = Math.max(...velocitySpark, 0.001);
    const w = 280;
    const h = 40;
    const points = velocitySpark.map((v, i) => {
      const x = (i / (velocitySpark.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  })();

  onMount(async () => {
    if (browser) {
      setupCanvas();
      durationInterval = setInterval(() => {
        sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      }, 1000);

      const { data: { session: s } } = await supabase.auth.getSession();
      session = s;
    }
  });

  onDestroy(() => {
    if (durationInterval) clearInterval(durationInterval);
  });
</script>

<div class="page">
  <!-- Toast container -->
  <div class="toast-container">
    {#each toasts as toast (toast.id)}
      <div class="toast toast-{toast.type}">
        {toast.message}
        <button class="toast-close" on:click={() => toasts = toasts.filter(t => t.id !== toast.id)}>x</button>
      </div>
    {/each}
  </div>

  <!-- Header -->
  <div class="header">
    <h1>Create2Heal</h1>
    <p class="subtitle">Draw freely. Observe your motion. Understand your patterns.</p>
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <input class="title-input" type="text" bind:value={drawingTitle} placeholder="Session title" />
    <div class="color-swatches">
      {#each colors as color}
        <button
          class="swatch"
          class:active={brushColor === color}
          style="background-color: {color}"
          on:click={() => brushColor = color}
          aria-label="Color {color}"
        ></button>
      {/each}
      <input type="color" bind:value={brushColor} class="custom-color" title="Custom color" />
    </div>
    <label class="tool-label">
      Size
      <input type="range" bind:value={brushSize} min="1" max="50" />
      <span class="tool-value">{brushSize}px</span>
    </label>
    <label class="tool-label">
      Type
      <select bind:value={brushType}>
        {#each brushTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </label>
    <label class="tool-label">
      <input type="checkbox" bind:checked={pressureResponsive} />
      Pressure FX
    </label>
    <button class="tool-btn" on:click={() => showSettings = !showSettings}>Settings</button>
    <button class="tool-btn" on:click={saveDrawing}>Save</button>
    <button class="tool-btn danger" on:click={clearCanvas}>Clear</button>
  </div>

  {#if showSettings}
    <div class="settings-bar">
      <label>
        Background
        <select bind:value={backgroundPattern}>
          <option value="blank">Blank</option>
          <option value="striped">Scratched</option>
          <option value="pied-de-poule">Houndstooth</option>
        </select>
      </label>
      <label>
        Opacity
        <input type="range" bind:value={lineOpacity} min="0" max="1" step="0.1" />
        <span>{lineOpacity}</span>
      </label>
    </div>
  {/if}

  <!-- Canvas -->
  <div class="canvas-area">
    <canvas
      bind:this={canvas}
      width="800"
      height="600"
      on:pointerdown={startDrawing}
      on:pointermove={draw}
      on:pointerup={stopDrawing}
      on:pointerout={stopDrawing}
      on:pointercancel={stopDrawing}
      class="heal-canvas"
    ></canvas>

    <!-- Pressure bar overlay -->
    <div class="pressure-overlay">
      <div class="pressure-fill" style="height: {currentPressure * 100}%"></div>
      <span class="pressure-text">{currentPressure.toFixed(2)}</span>
    </div>
  </div>

  <!-- Behavioral Metrics Panel -->
  <div class="metrics-panel">
    <h2>Your Drawing Behavior</h2>

    <!-- Flow & Steadiness scores -->
    <div class="scores-row">
      <div class="score-card">
        <div class="score-ring" style="--pct: {flowScore}; --color: {flowScore > 70 ? '#38a169' : flowScore > 40 ? '#d69e2e' : '#e53e3e'}">
          <span class="score-number">{Math.round(flowScore)}</span>
        </div>
        <span class="score-label">Flow</span>
        <span class="score-desc">Continuous motion</span>
      </div>
      <div class="score-card">
        <div class="score-ring" style="--pct: {steadinessScore}; --color: {steadinessScore > 70 ? '#38a169' : steadinessScore > 40 ? '#d69e2e' : '#e53e3e'}">
          <span class="score-number">{Math.round(steadinessScore)}</span>
        </div>
        <span class="score-label">Steadiness</span>
        <span class="score-desc">Pressure consistency</span>
      </div>
      <div class="session-timer">
        <span class="timer-value">{formatTime(sessionDuration)}</span>
        <span class="timer-label">Session</span>
      </div>
    </div>

    <!-- Metrics grid -->
    <div class="metrics-grid">
      <div class="metric">
        <span class="metric-val">{totalStrokes}</span>
        <span class="metric-lbl">Strokes</span>
      </div>
      <div class="metric">
        <span class="metric-val">{totalPoints}</span>
        <span class="metric-lbl">Points</span>
      </div>
      <div class="metric">
        <span class="metric-val avg">{avgVelocity.toFixed(2)}</span>
        <span class="metric-lbl">Avg Velocity</span>
      </div>
      <div class="metric">
        <span class="metric-val">{maxVelocity.toFixed(2)}</span>
        <span class="metric-lbl">Peak Velocity</span>
      </div>
      <div class="metric">
        <span class="metric-val">{avgPressure.toFixed(2)}</span>
        <span class="metric-lbl">Avg Pressure</span>
      </div>
      <div class="metric">
        <span class="metric-val">{pressureVariance.toFixed(4)}</span>
        <span class="metric-lbl">Pressure Var</span>
      </div>
      <div class="metric hesitation">
        <span class="metric-val">{hesitationCount}</span>
        <span class="metric-lbl">Hesitations</span>
      </div>
      <div class="metric correction">
        <span class="metric-val">{correctionCount}</span>
        <span class="metric-lbl">Corrections</span>
      </div>
      <div class="metric">
        <span class="metric-val">{hesitationRate.toFixed(1)}/m</span>
        <span class="metric-lbl">Hesitation Rate</span>
      </div>
      <div class="metric">
        <span class="metric-val">{correctionRate.toFixed(1)}/m</span>
        <span class="metric-lbl">Correction Rate</span>
      </div>
    </div>

    <!-- Velocity sparkline -->
    <div class="sparkline-section">
      <h3>Velocity Over Time</h3>
      {#if velocitySpark.length >= 2}
        <svg class="sparkline" viewBox="0 0 280 40" preserveAspectRatio="none">
          <path d={sparklinePath} fill="none" stroke="#38a169" stroke-width="1.5" />
        </svg>
      {:else}
        <p class="sparkline-empty">Start drawing to see your velocity pattern</p>
      {/if}
    </div>

    <!-- Brush usage -->
    {#if Object.keys(brushUsage).length > 0}
      <div class="brush-usage">
        <h3>Brush Usage</h3>
        <div class="usage-bars">
          {#each Object.entries(brushUsage) as [type, count]}
            <div class="usage-row">
              <span class="usage-label">{type}</span>
              <div class="usage-bar-track">
                <div class="usage-bar-fill" style="width: {(count / totalStrokes) * 100}%"></div>
              </div>
              <span class="usage-count">{count}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Behavioral insights -->
    {#if totalPoints > 50}
      <div class="insights-section">
        <h3>Behavioral Insights</h3>
        <div class="insight-cards">
          {#if hesitationRate > 10}
            <div class="insight warn">
              <span class="insight-icon">⏸</span>
              <span>High hesitation rate ({hesitationRate.toFixed(1)}/min). You're pausing frequently — this may indicate careful deliberation or uncertainty.</span>
            </div>
          {:else if hesitationRate > 0 && hesitationRate <= 3}
            <div class="insight good">
              <span class="insight-icon">✨</span>
              <span>Low hesitation ({hesitationRate.toFixed(1)}/min). Your strokes are flowing naturally.</span>
            </div>
          {/if}

          {#if correctionRate > 8}
            <div class="insight warn">
              <span class="insight-icon">↩️</span>
              <span>High correction rate ({correctionRate.toFixed(1)}/min). Frequent direction reversals suggest self-editing behavior.</span>
            </div>
          {:else if correctionRate > 0 && correctionRate <= 2}
            <div class="insight good">
              <span class="insight-icon">➡️</span>
              <span>Low corrections ({correctionRate.toFixed(1)}/min). Your movements are decisive and directional.</span>
            </div>
          {/if}

          {#if avgVelocity > 0.5}
            <div class="insight info">
              <span class="insight-icon">⚡</span>
              <span>Fast drawing pace (avg {avgVelocity.toFixed(2)} px/ms). You're moving with energy and confidence.</span>
            </div>
          {:else if avgVelocity > 0 && avgVelocity < 0.15}
            <div class="insight info">
              <span class="insight-icon">🐢</span>
              <span>Slow, deliberate pace (avg {avgVelocity.toFixed(2)} px/ms). You're taking time with each mark.</span>
            </div>
          {/if}

          {#if pressureVariance < 0.005 && pressures.length > 20}
            <div class="insight good">
              <span class="insight-icon">🎯</span>
              <span>Very steady pressure (variance {pressureVariance.toFixed(4)}). Your motor control is consistent.</span>
            </div>
          {:else if pressureVariance > 0.03}
            <div class="insight info">
              <span class="insight-icon">🌊</span>
              <span>Variable pressure ({pressureVariance.toFixed(4)}). Your touch has natural dynamics — lighter and heavier moments.</span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f7f7f5;
    min-height: 100vh;
    padding: 20px;
  }
  .header {
    text-align: center;
    margin-bottom: 16px;
  }
  .header h1 {
    font-size: 1.8rem;
    color: #2d3748;
    margin: 0;
    font-weight: 700;
  }
  .subtitle {
    color: #718096;
    font-size: 0.95rem;
    margin: 4px 0 0;
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px;
    background: #ffffffcc;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    margin-bottom: 12px;
    align-items: center;
    justify-content: center;
    max-width: 820px;
    width: 100%;
  }
  .title-input {
    min-width: 140px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
  }
  .color-swatches {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .swatch {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
    transition: transform 0.1s;
  }
  .swatch.active {
    border-color: #2d3748;
    transform: scale(1.2);
  }
  .swatch:hover {
    transform: scale(1.15);
  }
  .custom-color {
    width: 24px;
    height: 24px;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: 4px;
  }
  .tool-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #4a5568;
  }
  .tool-value {
    font-size: 12px;
    color: #718096;
    min-width: 30px;
  }
  .tool-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #fff;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tool-btn:hover {
    background: #edf2f7;
  }
  .tool-btn.danger {
    color: #e53e3e;
    border-color: #e53e3e;
  }
  .tool-btn.danger:hover {
    background: #fff5f5;
  }
  .settings-bar {
    display: flex;
    gap: 16px;
    padding: 10px 16px;
    background: #ffffffcc;
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    margin-bottom: 12px;
    align-items: center;
    font-size: 13px;
    color: #4a5568;
  }
  .settings-bar label {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .settings-bar select,
  .settings-bar input[type="range"] {
    padding: 4px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  /* Canvas area */
  .canvas-area {
    position: relative;
    margin-bottom: 20px;
  }
  .heal-canvas {
    border: 2px solid #333;
    border-radius: 4px;
    cursor: crosshair;
    touch-action: none;
  }
  .pressure-overlay {
    position: absolute;
    right: -30px;
    top: 0;
    width: 16px;
    height: 100%;
    background: #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column-reverse;
  }
  .pressure-fill {
    width: 100%;
    background: linear-gradient(to top, #38a169, #d69e2e, #e53e3e);
    border-radius: 8px;
    transition: height 0.1s ease;
  }
  .pressure-text {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #718096;
    white-space: nowrap;
  }

  /* Metrics panel */
  .metrics-panel {
    width: 100%;
    max-width: 820px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    padding: 24px;
    margin-bottom: 40px;
  }
  .metrics-panel h2 {
    font-size: 1.2rem;
    color: #2d3748;
    margin: 0 0 16px;
  }
  .metrics-panel h3 {
    font-size: 0.9rem;
    color: #4a5568;
    margin: 16px 0 8px;
  }

  /* Scores */
  .scores-row {
    display: flex;
    gap: 24px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .score-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .score-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 4px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: conic-gradient(var(--color) calc(var(--pct) * 1%), #e2e8f0 0);
  }
  .score-number {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2d3748;
    background: #fff;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .score-label {
    font-weight: 600;
    font-size: 0.85rem;
    color: #2d3748;
  }
  .score-desc {
    font-size: 0.7rem;
    color: #a0aec0;
  }
  .session-timer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .timer-value {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    font-variant-numeric: tabular-nums;
  }
  .timer-label {
    font-size: 0.75rem;
    color: #a0aec0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Metrics grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }
  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 6px;
    background: #f7fafc;
    border-radius: 10px;
    border: 1px solid #edf2f7;
  }
  .metric-val {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2d3748;
  }
  .metric-lbl {
    font-size: 0.65rem;
    color: #a0aec0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
  }
  .metric.hesitation .metric-val {
    color: #d69e2e;
  }
  .metric.correction .metric-val {
    color: #e53e3e;
  }

  /* Sparkline */
  .sparkline-section {
    margin-top: 12px;
  }
  .sparkline {
    width: 100%;
    height: 50px;
    background: #f7fafc;
    border-radius: 8px;
    border: 1px solid #edf2f7;
  }
  .sparkline-empty {
    text-align: center;
    color: #a0aec0;
    font-size: 0.85rem;
    padding: 12px;
    background: #f7fafc;
    border-radius: 8px;
  }

  /* Brush usage */
  .brush-usage {
    margin-top: 12px;
  }
  .usage-bars {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .usage-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .usage-label {
    min-width: 70px;
    font-size: 0.8rem;
    color: #4a5568;
    text-transform: capitalize;
  }
  .usage-bar-track {
    flex: 1;
    height: 8px;
    background: #edf2f7;
    border-radius: 4px;
    overflow: hidden;
  }
  .usage-bar-fill {
    height: 100%;
    background: #38a169;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  .usage-count {
    min-width: 24px;
    text-align: right;
    font-size: 0.8rem;
    color: #718096;
  }

  /* Insights */
  .insights-section {
    margin-top: 16px;
  }
  .insight-cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .insight {
    display: flex;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 0.85rem;
    align-items: flex-start;
    line-height: 1.4;
  }
  .insight.good {
    background: #f0fff4;
    color: #276749;
    border: 1px solid #c6f6d5;
  }
  .insight.warn {
    background: #fffff0;
    color: #744210;
    border: 1px solid #fefcbf;
  }
  .insight.info {
    background: #ebf8ff;
    color: #2a4365;
    border: 1px solid #bee3f8;
  }
  .insight-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  /* Toast */
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .toast {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    display: flex;
    gap: 10px;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .toast-info { background: #ebf8ff; color: #2a4365; }
  .toast-success { background: #f0fff4; color: #276749; }
  .toast-error { background: #fff5f5; color: #9b2c2c; }
  .toast-warning { background: #fffff0; color: #744210; }
  .toast-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: inherit;
    opacity: 0.6;
  }

  @media (max-width: 840px) {
    .heal-canvas {
      width: 100%;
      height: auto;
    }
    .pressure-overlay {
      display: none;
    }
    .metrics-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
