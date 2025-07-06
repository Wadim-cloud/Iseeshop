<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Define props explicitly
  export let orderId: string | undefined;
  export let email: string;

  const dispatch = createEventDispatcher();

  function goBack() {
    dispatch('goBack');
  }
</script>

<div class="success-message">
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#4CAF50" stroke-width="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="M22 4 12 14.01l-3-3"></path>
  </svg>
  <h2>Purchase Complete!</h2>
  <p>Your order (#{orderId}) has been successfully placed.</p>
  <p>A confirmation has been sent to w.v.seminsky@gmail.com, who will personally confirm your order.</p>
  <p>Your provided email ({email}) has been recorded for order reference.</p>
  <button class="primary-button" on:click={goBack}>Back to Gallery</button>
</div>

<style lang="scss">
  .success-message {
    background: rgba(76, 175, 80, 0.1);
    border-radius: 8px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    h2 {
      color: #2E7D32;
      margin-top: 1rem;
    }
    
    p {
      margin: 0.5rem 0;
    }
    
    button {
      margin-top: 2rem;
    }
  }

  .primary-button {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    
    &:hover {
      background-color: #45a049;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
</style>