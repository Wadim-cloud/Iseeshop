<script>
  import { createEventDispatcher } from 'svelte';

  export let toast;

  const dispatch = createEventDispatcher();
</script>

<style>
  .toast {
    background: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
  }
  .toast.success {
    background: #4caf50;
  }
  .toast.error {
    background: #f44336;
  }
  .toast button {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }
  .toast button:active {
    transform: scale(0.95);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>

<div class="toast {toast.type}">
  <span>{toast.message}</span>
  <button on:click={() => dispatch('close')}>✕</button>
</div>