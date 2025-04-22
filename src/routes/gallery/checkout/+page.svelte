<script lang="ts">
  import { onMount } from 'svelte';
  import { cartStore, cartSize, cartActions } from '$lib/gallery/stores';
  import { completePurchase, type BuyerInfo } from '$lib/gallery/CheckoutService';
  import { goto } from '$app/navigation';
  
  // Available 3D objects
  const objects3D = [
    { id: 'mug', name: 'Coffee Mug', price: 19.99, image: '/images/objects/mug.jpg' },
    { id: 'tshirt', name: 'T-Shirt', price: 24.99, image: '/images/objects/tshirt.jpg' },
    { id: 'poster', name: 'Poster', price: 14.99, image: '/images/objects/poster.jpg' },
    { id: 'phonecase', name: 'Phone Case', price: 29.99, image: '/images/objects/phonecase.jpg' },
    { id: 'pillow', name: 'Throw Pillow', price: 34.99, image: '/images/objects/pillow.jpg' }
  ];
  
  // For each cart item, track which 3D object is selected
  let selectedObjects: Record<number, string> = {};
  
  // Track which step of checkout we're on
  let checkoutStep: 'product-selection' | 'shipping-info' | 'success' = 'product-selection';
  
  // Buyer information for shipping step
  let buyerInfo: BuyerInfo = {
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };
  
  let isSubmitting = false;
  let error: string | null = null;
  let orderId: string | undefined;
  
  // Check if cart is empty
  $: isEmpty = $cartStore.length === 0;
  
  // Calculate total price
  $: totalAmount = calculateTotal();
  
  onMount(() => {
    // Pre-populate selected objects if cart is not empty
    if ($cartStore.length > 0) {
      $cartStore.forEach(item => {
        if (item.selected3DObject) {
          selectedObjects[item.drawingId] = item.selected3DObject;
        } else {
          // Default to first object
          selectedObjects[item.drawingId] = objects3D[0].id;
        }
      });
      
      // Update cart items with selected objects
      Object.entries(selectedObjects).forEach(([drawingId, objectId]) => {
        cartActions.updateCartItem(parseInt(drawingId), { selected3DObject: objectId });
      });
    } else {
      // Redirect to gallery if cart is empty
      goto('/gallery');
    }
  });
  
  // Update cart item with selected 3D object
  function updateSelection(drawingId: number, objectId: string) {
    selectedObjects[drawingId] = objectId;
    cartActions.updateCartItem(drawingId, { selected3DObject: objectId });
  }
  
  // Remove item from cart
  function removeItem(drawingId: number) {
    cartActions.removeFromCart(drawingId);
    delete selectedObjects[drawingId];
    
    // Go back to gallery if cart is now empty
    if ($cartStore.length === 0) {
      goto('/gallery');
    }
  }
  
  // Calculate total price
  function calculateTotal() {
    let total = 0;
    $cartStore.forEach(item => {
      const objectId = selectedObjects[item.drawingId];
      const object = objects3D.find(obj => obj.id === objectId);
      if (object) {
        total += object.price;
      }
    });
    return total;
  }
  
  // Go to shipping info step
  function goToShippingInfo() {
    checkoutStep = 'shipping-info';
  }
  
  // Process the checkout
  async function handleSubmit() {
    isSubmitting = true;
    error = null;
    
    try {
      const result = await completePurchase(buyerInfo);
      
      if (result.success) {
        checkoutStep = 'success';
        orderId = result.orderId;
      } else {
        error = result.error || 'Purchase failed';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'An unexpected error occurred';
    } finally {
      isSubmitting = false;
    }
  }
  
  // Go back to product selection step
  function goBackToProductSelection() {
    checkoutStep = 'product-selection';
  }
  
  // Go back to gallery
  function goBackToGallery() {
    goto('/gallery');
  }
</script>

<svelte:head>
  <title>Checkout | Pexos</title>
  <meta name="description" content="Complete your order" />
</svelte:head>

<div class="checkout-container">
  <h1>
    {#if checkoutStep === 'product-selection'}
      Your Custom 3D Order
    {:else if checkoutStep === 'shipping-info'}
      Shipping Information
    {:else}
      Order Complete
    {/if}
  </h1>
  
  {#if isEmpty}
    <div class="empty-checkout">
      <p>Your cart is empty.</p>
      <button class="back-button" on:click={goBackToGallery}>Return to Gallery</button>
    </div>
  {:else if checkoutStep === 'product-selection'}
    <div class="checkout-content">
      <div class="checkout-items">
        {#each $cartStore as item}
          <div class="checkout-item">
            <div class="item-image">
              <img src={item.imageData} alt="Drawing preview" />
              <button class="remove-button" on:click={() => removeItem(item.drawingId)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="item-options">
              <h3>Select 3D Object</h3>
              <div class="objects-grid">
                {#each objects3D as object}
                  <div 
                    class="object-option {selectedObjects[item.drawingId] === object.id ? 'selected' : ''}"
                    on:click={() => updateSelection(item.drawingId, object.id)}
                  >
                    <div class="object-image">
                      <!-- Display a placeholder for demo purposes -->
                      <div class="object-placeholder">
                        <span>{object.name}</span>
                      </div>
                    </div>
                    <div class="object-info">
                      <span class="object-name">{object.name}</span>
                      <span class="object-price">${object.price.toFixed(2)}</span>
                    </div>
                  </div>
                {/each}
              </div>
              
              <div class="preview-section">
                <h4>Preview</h4>
                <div class="preview-3d">
                  <!-- This would be replaced with an actual 3D renderer -->
                  <div class="preview-placeholder">
                    {#if selectedObjects[item.drawingId]}
                      {@const selectedObject = objects3D.find(obj => obj.id === selectedObjects[item.drawingId])}
                      <div class="mock-3d-object">
                        <span>{selectedObject?.name || 'Object'}</span>
                        <div class="texture-overlay" style="background-image: url({item.imageData})"></div>
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="checkout-summary">
        <h2>Order Summary</h2>
        <div class="summary-items">
          {#each $cartStore as item}
            {@const selectedObject = objects3D.find(obj => obj.id === selectedObjects[item.drawingId])}
            <div class="summary-item">
              <span>{selectedObject?.name || 'Custom Object'}</span>
              <span>${selectedObject?.price.toFixed(2) || '0.00'}</span>
            </div>
          {/each}
        </div>
        
        <div class="summary-total">
          <span>Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        
        <div class="checkout-actions">
          <button class="back-button" on:click={goBackToGallery}>Continue Shopping</button>
          <button class="checkout-button" on:click={goToShippingInfo}>Continue to Shipping</button>
        </div>
      </div>
    </div>
  {:else if checkoutStep === 'shipping-info'}
    <div class="cart-summary">
      <h2>Order Summary</h2>
      
      <div class="summary-items">
        {#each $cartStore as item}
          {@const selectedObject = objects3D.find(obj => obj.id === selectedObjects[item.drawingId])}
          <div class="summary-item">
            <img src={item.imageData} alt="Drawing preview" class="item-thumbnail" />
            <div class="item-details">
              <span class="item-id">{selectedObject?.name || 'Custom Object'}</span>
              <span class="item-price">${selectedObject?.price.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="summary-total">
        <span>Total ({$cartSize} items):</span>
        <span class="total-amount">${totalAmount.toFixed(2)}</span>
      </div>
    </div>
    
    <div class="checkout-form">
      <h2>Shipping Information</h2>
      
      {#if error}
        <div class="error-message">{error}</div>
      {/if}
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            bind:value={buyerInfo.name} 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            bind:value={buyerInfo.email} 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="address">Street Address</label>
          <input 
            type="text" 
            id="address" 
            bind:value={buyerInfo.address} 
            required
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="city">City</label>
            <input 
              type="text" 
              id="city" 
              bind:value={buyerInfo.city} 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="state">State/Province</label>
            <input 
              type="text" 
              id="state" 
              bind:value={buyerInfo.state} 
              required
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="zipCode">Zip/Postal Code</label>
            <input 
              type="text" 
              id="zipCode" 
              bind:value={buyerInfo.zipCode} 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="country">Country</label>
            <input 
              type="text" 
              id="country" 
              bind:value={buyerInfo.country} 
              required
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="secondary-button" on:click={goBackToProductSelection}>Back to Products</button>
          <button type="submit" class="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : `Complete Purchase - $${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  {:else if checkoutStep === 'success'}
    <div class="success-message">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#4CAF50" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <path d="M22 4 12 14.01l-3-3"></path>
      </svg>
      <h2>Purchase Complete!</h2>
      <p>Your order (#{orderId}) has been successfully placed.</p>
      <p>You will receive a confirmation email shortly.</p>
      <button class="primary-button" on:click={goBackToGallery}>Back to Gallery</button>
    </div>
  {/if}
</div>

<style>
  .checkout-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
  
  .empty-checkout {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Product Selection Step Styles */
  .checkout-content {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
  }
  
  .checkout-items {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .checkout-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .item-image {
    position: relative;
    height: 100%;
  }
  
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .remove-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.7);
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 5;
  }
  
  .item-options {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .objects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .object-option {
    border: 2px solid #eee;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .object-option:hover {
    border-color: #ccc;
  }
  
  .object-option.selected {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  
  .object-image {
    height: 100px;
    background: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .object-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #eee;
    color: #999;
    font-size: 0.8rem;
    text-align: center;
    padding: 0.5rem;
  }
  
  .object-info {
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }
  
  .object-name {
    font-weight: 500;
  }
  
  .object-price {
    font-weight: bold;
    color: #4CAF50;
  }
  
  .preview-section {
    margin-top: 1.5rem;
  }
  
  .preview-3d {
    background: #f0f0f0;
    border-radius: 8px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5rem;
  }
  
  .preview-placeholder {
    width: 200px;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .mock-3d-object {
    position: relative;
    width: 150px;
    height: 150px;
    background: #ddd;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: #666;
    overflow: hidden;
  }
  
  .texture-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.6;
    mix-blend-mode: multiply;
  }
  
  .checkout-summary {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    height: fit-content;
    position: sticky;
    top: 2rem;
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
  
  .summary-total {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.2rem;
    margin: 1.5rem 0;
    padding-top: 1rem;
    border-top: 2px solid #eee;
  }
  
  .checkout-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Shipping Information Step Styles */
  .cart-summary {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
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
  
  .total-amount {
    color: #4CAF50;
  }
  
  .checkout-form {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    width: 100%;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }
  
  /* Success Step Styles */
  .success-message {
    background: #E8F5E9;
    border-radius: 8px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .success-message h2 {
    color: #2E7D32;
    margin-top: 1rem;
  }
  
  .success-message button {
    margin-top: 2rem;
  }
  
  /* Common Button Styles */
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .back-button, .secondary-button {
    background: none;
    border: 1px solid #ddd;
  }
  
  .back-button:hover, .secondary-button:hover {
    background: #f5f5f5;
  }
  
  .checkout-button, .primary-button {
    background: #4CAF50;
    color: white;
    border: none;
    font-weight: bold;
  }
  
  .checkout-button:hover, .primary-button:hover {
    background: #43A047;
  }
  
  .primary-button:disabled {
    background: #9E9E9E;
    cursor: not-allowed;
  }
  
  .error-message {
    background: #FFEBEE;
    color: #D32F2F;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }
  
  /* Responsive Styles */
  @media (max-width: 960px) {
    .checkout-content {
      grid-template-columns: 1fr;
    }
    
    .checkout-summary {
      position: static;
    }
  }
  
  /* Responsive Styles (continued) */
  @media (max-width: 768px) {
    .checkout-item {
      grid-template-columns: 1fr;
    }
    
    .item-image {
      height: 240px;
    }
    
    .form-row {
      flex-direction: column;
      gap: 0;
    }
    
    .form-actions {
      flex-direction: column;
      gap: 1rem;
    }
    
    button {
      width: 100%;
    }
  }
</style>