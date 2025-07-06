<script>
  import { createEventDispatcher } from 'svelte';

  export let backgroundPattern; // Changed from backgroundColor
  export let lineOpacity;

  const dispatch = createEventDispatcher();
  const patterns = ['blank', 'striped', 'pied-de-poule'];
</script>

<style>
  .settings-panel {
    background: #ffffffcc;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
  .settings-panel label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .settings-panel select,
  .settings-panel input {
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
</style>

<div class="settings-panel">
  <label>
    🖼️ Background Pattern
    <select
      bind:value={backgroundPattern}
      on:change={e => dispatch('changeBackgroundPattern', e.target.value)}
    >
      {#each patterns as pattern}
        <option value={pattern}>{pattern}</option>
      {/each}
    </select>
  </label>
  <label>
    🌫️ Line Opacity
    <input
      type="range"
      bind:value={lineOpacity}
      min="0"
      max="1"
      step="0.1"
      on:input={e => dispatch('changeLineOpacity', +e.target.value)}
    />
  </label>
</div>