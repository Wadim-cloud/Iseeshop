<script lang="ts">
  import DrawingCanvas2 from '$lib/collaborate2/Collaborate2Canvas.svelte';

  let brushColor: string = '#000000';
  let brushSize: number = 5;
</script>

<div class="page-container">
  <h1>🧪 Collaborate 2</h1>
  <p>A limited-stroke experimental canvas. Faster strokes = thinner lines + sharper angles.</p>

  <div class="controls">
    <label>
      Color:
      <input type="color" bind:value={brushColor}>
    </label>
    <label>
      Base Size:
      <input type="range" min="1" max="20" bind:value={brushSize}>
    </label>
  </div>

  <DrawingCanvas2 bind:brushColor bind:brushSize />
</div>

<style>
  .page-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    color: #ccc;
    font-family: monospace;
  }

  h1 {
    color: #0f0;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .controls {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
  }

  input[type="color"] {
    border: none;
    background: none;
    width: 2rem;
    height: 2rem;
    padding: 0;
  }
</style>
