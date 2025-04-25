<script lang="ts">
  import { onMount } from 'svelte';
  import { cartStore, cartSize, cartActions } from '$lib/gallery/stores';
  import { completePurchase, type BuyerInfo } from '$lib/gallery/CheckoutService';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import sanitizeHtml from 'sanitize-html'; // For input sanitization

  // Available 3D objects
  const objects3D = [
    { id: 'mug', name: 'Coffee Mug', price: 19.99, image: '/images/objects/mug.jpg' },
    { id: 'tshirt', name: 'T-Shirt', price: 24.99, image: '/images/objects/tshirt.jpg' },
    { id: 'poster', name: 'Poster', price: 14.99, image: '/images/objects/poster.jpg' },
    { id: 'phonecase', name: 'Phone Case', price: 29.99, image: '/images/objects/phonecase.jpg' },
    { id: 'pillow', name: 'Throw Pillow', price: 34.99, image: '/images/objects/pillow.jpg' }
  ];

  // Reactive store for selected objects
  const selectedObjects = writable<Record<string, string>>({});

  // Track checkout step
  let checkoutStep: 'product-selection' | 'shipping-info' | 'success' = 'product-selection';

  // Buyer information
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
  let errors: Record<string, string> = {};
  let orderId: string | undefined;

  // Check if cart is empty
  $: isEmpty = $cartStore.length === 0;

  // Calculate total price
  $: totalAmount = calculateTotal();

  // Consolidated onMount
  onMount(async () => {
    // Fetch user profile
    try {
      const userProfile = await getUserProfile();
      if (userProfile?.email) {
        buyerInfo.email = userProfile.email;
        buyerInfo.name = userProfile.name || userProfile.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }

    // Initialize cart
    if ($cartStore.length > 0) {
      $cartStore.forEach(item => {
        selectedObjects.update(current => {
          if (!current[item.drawingId]) {
            const objectId = item.selected3DObject || objects3D[0].id;
            current[item.drawingId] = objectId;
            cartActions.updateCartItem(item.drawingId, { selected3DObject: objectId });
          }
          return current;
        });
      });
    } else {
      goto('/gallery');
    }

    // Debug logs
    console.log('Cart Store:', $cartStore);
    console.log('Selected Objects:', $selectedObjects);
  });

  // Update cart item with selected 3D object
  function updateSelection(drawingId: string, objectId: string) {
    selectedObjects.update(current => {
      current[drawingId] = objectId;
      return current;
    });
    cartActions.updateCartItem(drawingId, { selected3DObject: objectId });
    console.log(`Updated selection for drawing ${drawingId}: ${objectId}`);
  }

  // Remove item from cart
  function removeItem(drawingId: string) {
    cartActions.removeFromCart(drawingId);
    selectedObjects.update(current => {
      delete current[drawingId];
      return current;
    });
    if ($cartStore.length === 0) {
      goto('/gallery');
    }
  }

  // Calculate total price
  function calculateTotal() {
    let total = 0;
    $cartStore.forEach(item => {
      const objectId = item.selected3DObject;
      const object = objects3D.find(obj => obj.id === objectId);
      if (object) {
        total += object.price;
      } else {
        console.warn(`No object found for drawing ${item.drawingId}, objectId: ${objectId}`);
      }
    });
    console.log('Calculated total:', total);
    return total;
  }

  // Update totals (redundant with reactive $: totalAmount, but kept for button action)
  function updateTotals() {
    totalAmount = calculateTotal();
    console.log('Totals updated:', totalAmount);
  }

  // Go to shipping info step
  function goToShippingInfo() {
    checkoutStep = 'shipping-info';
  }

  // Validate buyer info
  function validateBuyerInfo(info: BuyerInfo): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!info.name.trim()) errors.name = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) errors.email = 'Invalid email address';
    if (!info.address.trim()) errors.address = 'Street address is required';
    if (!info.city.trim()) errors.city = 'City is required';
    if (!info.state.trim()) errors.state = 'State/Province is required';
    if (!info.zipCode.trim()) errors.zipCode = 'Zip/Postal code is required';
    if (!info.country.trim()) errors.country = 'Country is required';
    return errors;
  }

  // Sanitize buyer info
  function sanitizeBuyerInfo(info: BuyerInfo): BuyerInfo {
    return {
      name: sanitizeHtml(info.name),
      email: sanitizeHtml(info.email),
      address: sanitizeHtml(info.address),
      city: sanitizeHtml(info.city),
      state: sanitizeHtml(info.state),
      zipCode: sanitizeHtml(info.zipCode),
      country: sanitizeHtml(info.country)
    };
  }

  // Process checkout
  async function handleSubmit() {
    isSubmitting = true;
    errors = {};

    // Client-side validation
    errors = validateBuyerInfo(buyerInfo);
    if (Object.keys(errors).length > 0) {
      isSubmitting = false;
      const firstInvalid = document.querySelector('input:invalid, input[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    try {
      const sanitizedInfo = sanitizeBuyerInfo(buyerInfo);
      const result = await completePurchase(sanitizedInfo);
      if (result.success) {
        checkoutStep = 'success';
        orderId = result.orderId;
      } else {
        errors.general = result.error || 'Purchase failed';
      }
    } catch (err) {
      errors.general = err instanceof Error ? err.message : 'An unexpected error occurred';
    } finally {
      isSubmitting = false;
    }
  }

  // Go back to product selection
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
              <button class="remove-button" on:click={() => removeItem(item.drawingId)} aria-label="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="item-options">
              <h3>Select 3D Object</h3>
              <div class="objects-grid">
                {#each objects3D as object}
                  <div
                    class="object-option {$selectedObjects[item.drawingId] === object.id ? 'selected' : ''}"
                    on:click={() => updateSelection(item.drawingId, object.id)}
                    role="button"
                    tabindex="0"
                    on:keydown={e => e.key === 'Enter' && updateSelection(item.drawingId, object.id)}
                    aria-label={`Select ${object.name}`}
                  >
                    <div class="object-image">
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
                  <div class="preview-placeholder">
                    {#if $selectedObjects[item.drawingId]}
                      {@const selectedObject = objects3D.find(obj => obj.id === $selectedObjects[item.drawingId])}
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
            {@const selectedObject = objects3D.find(obj => obj.id === $selectedObjects[item.drawingId])}
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
          <button class="update-totals-button" on:click={updateTotals}>Update Totals</button>
          <button class="checkout-button" on:click={goToShippingInfo}>Continue to Shipping</button>
        </div>
      </div>
    </div>
  {:else if checkoutStep === 'shipping-info'}
    <div class="cart-summary">
      <h2>Order Summary</h2>

      <div class="summary-items">
        {#each $cartStore as item}
          {@const selectedObject = objects3D.find(obj => obj.id === $selectedObjects[item.drawingId])}
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
      <h2 id="shipping-info-heading">Shipping Information</h2>

      {#if errors.general}
        <div class="error-message" aria-live="polite">{errors.general}</div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} aria-labelledby="shipping-info-heading">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            bind:value={buyerInfo.name}
            required
            autocomplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {#if errors.name}
            <span id="name-error" class="error-text">{errors.name}</span>
          {/if}
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            bind:value={buyerInfo.email}
            required
            autocomplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {#if errors.email}
            <span id="email-error" class="error-text">{errors.email}</span>
          {/if}
        </div>

        <div class="form-group">
          <label for="address">Street Address</label>
          <input
            type="text"
            id="address"
            bind:value={buyerInfo.address}
            required
            autocomplete="street-address"
            aria-invalid={errors.address ? 'true' : 'false'}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {#if errors.address}
            <span id="address-error" class="error-text">{errors.address}</span>
          {/if}
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="city">City</label>
            <input
              type="text"
              id="city"
              bind:value={buyerInfo.city}
              required
              autocomplete="address-level2"
              aria-invalid={errors.city ? 'true' : 'false'}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {#if errors.city}
              <span id="city-error" class="error-text">{errors.city}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="state">State/Province</label>
            <input
              type="text"
              id="state"
              bind:value={buyerInfo.state}
              required
              autocomplete="address-level1"
              aria-invalid={errors.state ? 'true' : 'false'}
              aria-describedby={errors.state ? 'state-error' : undefined}
            />
            {#if errors.state}
              <span id="state-error" class="error-text">{errors.state}</span>
            {/if}
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
              pattern="[0-9]{5}(-[0-9]{4})?"
              title="Enter a valid ZIP code (e.g., 12345 or 12345-6789)"
              autocomplete="postal-code"
              aria-invalid={errors.zipCode ? 'true' : 'false'}
              aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
            />
            {#if errors.zipCode}
              <span id="zipCode-error" class="error-text">{errors.zipCode}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <input
              type="text"
              id="country"
              bind:value={buyerInfo.country}
              required
              autocomplete="country-name"
              aria-invalid={errors.country ? 'true' : 'false'}
              aria-describedby={errors.country ? 'country-error' : undefined}
            />
            {#if errors.country}
              <span id="country-error" class="error-text">{errors.country}</span>
            {/if}
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="secondary-button" on:click={goBackToProductSelection}>Back to Products</button>
          <button type="submit" class="primary-button" disabled={isSubmitting}>
            {#if isSubmitting}
              <span class="spinner"></span> Processing...
            {:else}
              Complete Purchase - ${totalAmount.toFixed(2)}
            {/if}
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

<style lang="scss">
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