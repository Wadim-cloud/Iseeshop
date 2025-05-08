<script lang="ts">
    import { cartStore, cartActions, cartSize } from './stores';
    import { fly, slide } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    export let showCart = false;
    
    function toggleCart() {
      showCart = !showCart;
    }
    
    function removeItem(drawingId: number) {
      cartActions.removeFromCart(drawingId);
    }
    
    function checkout() {
      // Close cart
      showCart = false;
      // Navigate to checkout page
      goto('/gallery/checkout');
    }
  </script>
  
  <div class="cart-container">
    <!-- Cart button with badge -->
    <button class="cart-button" on:click={toggleCart}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {#if $cartSize > 0}
        <span class="cart-badge">{$cartSize}</span>
      {/if}
    </button>
    
    <!-- Cart panel -->
    {#if showCart}
      <div 
        class="cart-panel"
        transition:fly={{ y: -20, duration: 200 }}
      >
        <div class="cart-header">
          <h3>Your Cart ({$cartSize})</h3>
          <button class="close-button" on:click={toggleCart}>×</button>
        </div>
        
        {#if $cartSize === 0}
          <div class="empty-cart">
            <p>Your cart is empty</p>
            <p class="empty-caption">Add drawings to create custom 3D objects</p>
          </div>
        {:else}
          <div class="cart-items">
            {#each $cartStore as item}
              <div class="cart-item" transition:slide>
                <img src={item.imageData} alt="Drawing preview" class="cart-thumbnail" />
                <button class="remove-button" on:click={() => removeItem(item.drawingId)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            {/each}
          </div>
          
          <div class="cart-footer">
            <button class="clear-button" on:click={cartActions.clearCart}>Clear All</button>
            <button class="checkout-button" on:click={checkout}>
              Checkout ({$cartSize})
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  
  <style>
    .cart-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 100;
    }
    
    .cart-button {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: white;
      border: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s ease;
    }
    
    .cart-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .cart-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #f44336;
      color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }
    
    .cart-panel {
      position: absolute;
      top: 60px;
      right: 0;
      width: 320px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .cart-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .empty-cart {
      padding: 2rem 1rem;
      text-align: center;
    }
    
    .empty-caption {
      color: #999;
      font-size: 0.9rem;
    }
    
    .cart-items {
      max-height: 320px;
      overflow-y: auto;
      padding: 0.5rem;
    }
    
    .cart-item {
      position: relative;
      margin: 0.5rem 0;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .cart-thumbnail {
      width: 100%;
      height: 120px;
      object-fit: cover;
      display: block;
    }
    
    .remove-button {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(255, 255, 255, 0.7);
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    
    .cart-footer {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-top: 1px solid #eee;
    }
    
    .clear-button {
      background: none;
      border: 1px solid #eee;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .clear-button:hover {
      background: #f8f9fa;
    }
    
    .checkout-button {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    
    .checkout-button:hover {
      background: #43A047;
    }
    
    @media (max-width: 768px) {
      .cart-container {
        bottom: 20px;
        top: auto;
      }
      
      .cart-panel {
        bottom: 60px;
        top: auto;
        right: 0;
        width: 280px;
      }
    }
  </style>