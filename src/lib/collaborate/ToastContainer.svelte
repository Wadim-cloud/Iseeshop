<!-- src/lib/collaborate/ToastContainer.svelte -->
<script lang="ts">
  export let toasts: { id: string; message: string; type: 'info' | 'success' | 'error' }[] = [];

  function dismissToast(id: string) {
    toasts = toasts.filter(t => t.id !== id);
  }
</script>

<style>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .toast {
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    animation: fade-in 0.3s ease-out;
    cursor: pointer;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .toast.info { background-color: #3498db; }
  .toast.success { background-color: #2ecc71; }
  .toast.error { background-color: #e74c3c; }

  .toast:hover {
    opacity: 0.9;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }

  .toast.dismiss {
    animation: fade-out 0.3s ease forwards;
  }
</style>

<div class="toast-container">
  {#each toasts as toast (toast.id)}
    <div
      class="toast {toast.type}"
      on:click={() => dismissToast(toast.id)}
      on:animationend={(e) => {
        if (e.animationName === 'fade-out') dismissToast(toast.id);
      }}
      class:dismiss={toasts.find(t => t.id === toast.id)?.dismiss}
    >
      {toast.message}
    </div>
  {/each}
</div>