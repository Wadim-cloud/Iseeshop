<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { SessionMetrics, DriftReport } from './types.js';

  export let metrics: SessionMetrics | null = null;
  export let driftReports: DriftReport[] = [];

  let velocityCanvas: HTMLCanvasElement;
  let distributionCanvas: HTMLCanvasElement;

  const CHART_COLORS = {
    green: '#0f0',
    orange: '#ffa500',
    red: '#f44',
    blue: '#4488ff',
    purple: '#aa44ff',
    cyan: '#00cccc',
    gray: '#666',
  };

  function drawVelocityChart() {
    if (!velocityCanvas || !metrics || !browser) return;
    const ctx = velocityCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    velocityCanvas.width = velocityCanvas.offsetWidth * dpr;
    velocityCanvas.height = velocityCanvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = velocityCanvas.offsetWidth;
    const h = velocityCanvas.offsetHeight;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    const data = metrics.velocity_profile;
    if (data.length === 0) return;

    const maxVal = Math.max(...data, 0.001);

    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (plotH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (plotH * i) / 4;
      const val = maxVal * (1 - i / 4);
      ctx.fillText(val.toFixed(1), padding.left - 5, y + 4);
    }

    // Velocity line
    ctx.beginPath();
    ctx.strokeStyle = CHART_COLORS.green;
    ctx.lineWidth = 2;
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + (i / (data.length - 1 || 1)) * plotW;
      const y = padding.top + plotH - (data[i] / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Area fill
    ctx.lineTo(padding.left + plotW, padding.top + plotH);
    ctx.lineTo(padding.left, padding.top + plotH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#ccc';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', w / 2, h - 5);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Velocity (px/ms)', 0, 0);
    ctx.restore();
  }

  function drawDistributionChart() {
    if (!distributionCanvas || !metrics || !browser) return;
    const ctx = distributionCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    distributionCanvas.width = distributionCanvas.offsetWidth * dpr;
    distributionCanvas.height = distributionCanvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = distributionCanvas.offsetWidth;
    const h = distributionCanvas.offsetHeight;
    const dist = metrics.brush_type_distribution;
    const entries = Object.entries(dist);
    const total = entries.reduce((sum, [, count]) => sum + count, 0);

    if (total === 0) return;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);

    const colors = [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.purple, CHART_COLORS.cyan];
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) / 2 - 30;
    let startAngle = -Math.PI / 2;

    entries.forEach(([label, count], i) => {
      const sliceAngle = (count / total) * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + (radius * 0.65) * Math.cos(midAngle);
      const labelY = centerY + (radius * 0.65) * Math.sin(midAngle);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${label}`, labelX, labelY - 6);
      ctx.fillText(`${((count / total) * 100).toFixed(0)}%`, labelX, labelY + 8);

      startAngle += sliceAngle;
    });
  }

  function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  }

  function severityColor(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
      case 'low': return CHART_COLORS.orange;
      case 'medium': return '#ff6600';
      case 'high': return CHART_COLORS.red;
    }
  }

  $: if (metrics && browser) {
    // Use setTimeout to let DOM render first
    setTimeout(() => {
      drawVelocityChart();
      drawDistributionChart();
    }, 50);
  }

  onMount(() => {
    if (browser && metrics) {
      drawVelocityChart();
      drawDistributionChart();
    }
  });
</script>

{#if metrics}
  <div class="analytics">
    <h3>Session Analytics</h3>

    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-label">Duration</span>
        <span class="metric-value">{formatDuration(metrics.total_duration)}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Strokes</span>
        <span class="metric-value">{metrics.stroke_count}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Points</span>
        <span class="metric-value">{metrics.point_count}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Avg Velocity</span>
        <span class="metric-value">{metrics.avg_velocity.toFixed(2)}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Max Velocity</span>
        <span class="metric-value">{metrics.max_velocity.toFixed(2)}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Avg Pressure</span>
        <span class="metric-value">{metrics.avg_pressure.toFixed(2)}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Pressure Var</span>
        <span class="metric-value">{metrics.pressure_variance.toFixed(4)}</span>
      </div>
      <div class="metric-card hesitation">
        <span class="metric-label">Hesitations</span>
        <span class="metric-value">{metrics.hesitation_count}</span>
      </div>
      <div class="metric-card correction">
        <span class="metric-label">Corrections</span>
        <span class="metric-value">{metrics.correction_count}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Avg Stroke Dur</span>
        <span class="metric-value">{(metrics.avg_stroke_duration / 1000).toFixed(1)}s</span>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-container">
        <h4>Velocity Profile</h4>
        <canvas bind:this={velocityCanvas} class="chart-canvas"></canvas>
      </div>
      <div class="chart-container small">
        <h4>Brush Distribution</h4>
        <canvas bind:this={distributionCanvas} class="chart-canvas"></canvas>
      </div>
    </div>

    {#if driftReports.length > 0}
      <div class="drift-section">
        <h4>Behavioral Drift Detected</h4>
        <div class="drift-list">
          {#each driftReports as report}
            <div class="drift-item" style="border-left-color: {severityColor(report.severity)}">
              <div class="drift-header">
                <span class="drift-metric">{report.metric}</span>
                <span class="drift-severity" style="color: {severityColor(report.severity)}">
                  {report.severity.toUpperCase()}
                </span>
              </div>
              <div class="drift-values">
                <span>Current: {report.current.toFixed(3)}</span>
                <span>Baseline: {report.baseline.toFixed(3)}</span>
                <span>Deviation: {report.deviation.toFixed(1)}σ</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .analytics {
    width: 100%;
    padding: 1rem;
    background: #222;
    border-radius: 8px;
    border: 1px solid #444;
  }
  h3 {
    margin: 0 0 1rem;
    color: #0f0;
    font-size: 1.1rem;
  }
  h4 {
    margin: 0 0 0.5rem;
    color: #ccc;
    font-size: 0.9rem;
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .metric-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
  }
  .metric-label {
    font-size: 0.65rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }
  .metric-value {
    font-size: 1rem;
    font-weight: bold;
    color: #0f0;
  }
  .metric-card.hesitation .metric-value {
    color: #ffa500;
  }
  .metric-card.correction .metric-value {
    color: #f44;
  }
  .charts-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .chart-container {
    flex: 2;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 0.75rem;
  }
  .chart-container.small {
    flex: 1;
  }
  .chart-canvas {
    width: 100%;
    height: 200px;
  }
  .drift-section {
    margin-top: 1rem;
  }
  .drift-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .drift-item {
    padding: 0.5rem 0.75rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-left: 3px solid;
    border-radius: 4px;
  }
  .drift-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  .drift-metric {
    font-weight: bold;
    color: #ccc;
  }
  .drift-severity {
    font-size: 0.75rem;
    font-weight: bold;
  }
  .drift-values {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #888;
  }

  @media (max-width: 600px) {
    .charts-row {
      flex-direction: column;
    }
    .metrics-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
