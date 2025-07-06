<script lang="ts">
  import { cartStore } from '$lib/gallery/stores';
  import type { Object3D } from './types';
  import { createEventDispatcher } from 'svelte';

  export let objects3D: Object3D[];
  export let selectedObjects: { subscribe: any };
  export let totalAmount: number;
  export let formatCurrency: (amount: number) => string;
  export let cartSize: number = 0;
  export let showFullSummary: boolean = true;

  const dispatch = createEventDispatcher();

  function updateTotal() {
    dispatch('updateTotal');
  }

  function goToShipping() {
    dispatch('goToShipping');
  }

  function goBack() {
    dispatch('goBack');
  }
</script>

<div class="cart-summary" class:full-summary={showFullSummary}>
  <h2>Order Summary</h2>
  <div class="summary-items">
    {#each $cartStore as item}
      <!-- Use $selectedObjects directly instead of get(selectedObjects) -->
      {@const selectedObject = objects3D.find(obj => obj.id === $selectedObjects[item.drawingId])}
      <div class="summary-item">
        {#if !showFullSummary}
          <img src={item.imageData} alt="Drawing preview" class="item-thumbnail" />
          <div class="item-details">
            <span class="item-id">{selectedObject?.name || 'Custom Object'}</span>
            <span class="item-price">{formatCurrency(selectedObject?.price || 0)}</span>
          </div>
        {:else}
          <span>{selectedObject?.name || 'Custom Object'}</span>
          <span>{formatCurrency(selectedObject?.price || 0)}</span>
        {/if}
      </div>
    {/each}
  </div>

  <div class="summary-total">
    <span>Total {showFullSummary ? '' : `(${cartSize} ${cartSize === 1 ? 'item' : 'items'})`}:</span>
    <span class="total-amount">{formatCurrency(totalAmount)}</span>
  </div>

  {#if showFullSummary}
    <div class="checkout-actions">
      <button class="secondary-button" on:click={updateTotal}>Update Total</button>
      <button class="back-button" on:click={goBack}>Continue Shopping</button>
      <button class="checkout-button" on:click={goToShipping}>Continue to Shipping</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .cart-summary {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;

    &.full-summary {
      height: fit-content;
      position: sticky;
      top: 2rem;
      
      @media (max-width: 960px) {
        position: static;
      }
    }
  }

  .summary-items {
    margin: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }

  .item-thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 1rem;
  }

  .item-details {
    display: flex;
    flex-direction: column;
  }

  .item-id {
    font-weight: 500;
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.2rem;
    margin: 1.5rem 0;
    padding-top: 1rem;
    border-top: 2px solid #eee;
  }

  .total-amount {
    color: #4CAF50;
  }

  .checkout-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .secondary-button {
    background-color: #ffffff;
    color: #2c3e50;
    padding: 0.75rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s, transform 0.1s;
    
    &:hover {
      background-color: #f5f5f5;
      border-color: #ccc;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }

  .back-button {
    background-color: #ffffff;
    color: #2c3e50;
    padding: 0.75rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s, transform 0.1s;
    
    &:hover {
      background-color: #f5f5f5;
      border-color: #ccc;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }

  .checkout-button {
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