<!-- src/lib/Toast.svelte -->
<script lang="ts">
  import { fade } from 'svelte/transition';

  export let message: string;
  export let show: boolean;
  export let type: 'success' | 'error' = 'success';
</script>

{#if show}
  <div
    class="toast"
    class:success={type === 'success'}
    class:error={type === 'error'}
    transition:fade={{ duration: 300 }}
  >
    {message}
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    color: white;
    font-weight: 500;
    font-size: 0.95rem;
    animation: slideIn 0.3s ease-out;
  }

  .success {
    background-color: #28a745;
  }

  .error {
    background-color: #db4437;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @media (max-width: 768px) {
    .toast {
      width: 90%;
      text-align: center;
      padding: 0.75rem 1rem;
    }
  }
</style>