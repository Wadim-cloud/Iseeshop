<script lang="ts">
  import { onMount } from 'svelte';
  import { cartStore, cartSize, cartActions } from '$lib/gallery/stores';
  import { completePurchase, type BuyerInfo } from '$lib/gallery/CheckoutService';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import sanitizeHtml from 'sanitize-html';

  // Available 3D objects
  const objects3D = [
    { id: 'mug', name: 'Coffee Mug', price: 19.99, image: '/images/objects/mug.jpg' },
    { id: 'tshirt', name: 'T-Shirt', price: 24.99, image: '/images/objects/tshirt.jpg' },
    { id: 'poster', name: 'Poster', price: 14.99, image: '/images/objects/poster.jpg' },
    { id: 'phonecase', name: 'Phone Case', price: 29.99, image: '/images/objects/phonecase.jpg' },
    { id: 'pillow', name: 'Throw Pillow', price: 34.99, image: '/images/objects/pillow.jpg' }
  ];

  // Country-specific configurations
  const countryConfigs = {
    US: {
      currency: 'USD',
      zipPattern: '^\\d{5}(-\\d{4})?$',
      zipTitle: 'Enter a valid US ZIP code (e.g. 12345 or 12345-6789)',
      states: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    },
    NL: {
      currency: 'EUR',
      zipPattern: '^[1-9][0-9]{3}\\s?[A-Z]{2}$',
      zipTitle: 'Enter a valid Dutch postal code (e.g. 1234 AB)',
      states: []
    },
    UK: {
      currency: 'GBP',
      zipPattern: '^[A-Z]{1,2}[0-9][A-Z0-9]?\\s?[0-9][A-Z]{2}$',
      zipTitle: 'Enter a valid UK postcode (e.g. SW1A 1AA)',
      states: []
    },
    DE: {
      currency: 'EUR',
      zipPattern: '^\\d{5}$',
      zipTitle: 'Enter a valid German postal code (5 digits)',
      states: []
    }
  };

  const DEFAULT_COUNTRY = 'NL';

  // Reactive store for selected objects
  const selectedObjects = writable<Record<string, string>>({});
  let checkoutStep: 'product-selection' | 'shipping-info' | 'success' = 'product-selection';
  let buyerInfo: BuyerInfo = {
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: DEFAULT_COUNTRY
  };
  let isSubmitting = false;
  let errors: Record<string, string> = {};
  let orderId: string | undefined;
  let currentCountryConfig = countryConfigs[DEFAULT_COUNTRY];

  $: isEmpty = $cartStore.length === 0;
  $: totalAmount = calculateTotal();
  $: {
    if (buyerInfo.country && countryConfigs[buyerInfo.country]) {
      currentCountryConfig = countryConfigs[buyerInfo.country];
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currentCountryConfig.currency
    }).format(amount);
  }

  async function getUserProfile() {
    // Mock implementation - replace with actual user profile fetch
    return { email: 'user@example.com', name: 'John Doe' };
  }

  onMount(async () => {
    try {
      const userProfile = await getUserProfile();
      if (userProfile?.email) {
        buyerInfo.email = userProfile.email;
        buyerInfo.name = userProfile.name || 
          userProfile.email.split('@')[0]
            .replace('.', ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
        if (userProfile.country) {
          buyerInfo.country = userProfile.country;
        }
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }

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
  });

  function updateSelection(drawingId: string, objectId: string) {
    selectedObjects.update(current => {
      current[drawingId] = objectId;
      return current;
    });
    cartActions.updateCartItem(drawingId, { selected3DObject: objectId });
    // Force reactivity by reassigning cartStore (if needed)
    cartStore.set([...$cartStore]);
  }

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

  function calculateTotal(): number {
    return $cartStore.reduce((total, item) => {
      const object = objects3D.find(obj => obj.id === item.selected3DObject);
      return total + (object?.price || 0);
    }, 0);
  }

  function goToShippingInfo() {
    checkoutStep = 'shipping-info';
  }

  function goBackToProductSelection() {
    checkoutStep = 'product-selection';
  }

  function goBackToGallery() {
    goto('/gallery');
  }

  function validateBuyerInfo(info: BuyerInfo): Record<string, string> {
    const errors: Record<string, string> = {};
    const config = countryConfigs[info.country] || countryConfigs[DEFAULT_COUNTRY];

    if (!info.name?.trim()) errors.name = 'Full name is required';
    if (!info.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) errors.email = 'Invalid email address';
    if (!info.address?.trim()) errors.address = 'Street address is required';
    if (!info.city?.trim()) errors.city = 'City is required';
    if (!info.state?.trim()) errors.state = 'State/Province is required';
    if (!info.zipCode?.trim()) errors.zipCode = 'Postal/ZIP code is required';
    else if (!new RegExp(config.zipPattern).test(info.zipCode)) errors.zipCode = 'Invalid format for selected country';
    if (!info.country?.trim()) errors.country = 'Country is required';

    console.log('Validation errors:', errors);
    return errors;
  }

  function sanitizeBuyerInfo(info: BuyerInfo): BuyerInfo {
    const sanitize = (str: string) => {
      const result = sanitizeHtml(str || '', {
        allowedTags: [],
        allowedAttributes: {},
        textFilter: (text) => text.trim() // Preserve valid text
      });
      console.log(`Sanitizing "${str}" -> "${result}"`);
      return result;
    };
    const sanitized = {
      name: sanitize(info.name),
      email: sanitize(info.email),
      address: sanitize(info.address),
      city: sanitize(info.city),
      state: sanitize(info.state),
      zipCode: sanitize(info.zipCode),
      country: sanitize(info.country)
    };
    console.log('Sanitized buyerInfo:', sanitized);
    return sanitized;
  }

  async function handleSubmit() {
    isSubmitting = true;
    errors = {};

    console.log('BuyerInfo before validation:', buyerInfo);
    errors = validateBuyerInfo(buyerInfo);
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      isSubmitting = false;
      const firstInvalid = document.querySelector('input:invalid, select:invalid, [aria-invalid="true"]');
      if (firstInvalid) (firstInvalid as HTMLElement).focus();
      return;
    }

    try {
      const sanitizedInfo = sanitizeBuyerInfo(buyerInfo);
      const result = await completePurchase(sanitizedInfo);
      if (result.success) {
        checkoutStep = 'success';
        orderId = result.orderId;
        cartActions.clearCart();
      } else {
        errors.general = result.error || 'Purchase failed';
        console.log('Purchase error:', result.error);
      }
    } catch (err) {
      errors.general = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.log('Unexpected error:', err);
    } finally {
      isSubmitting = false;
    }
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

  {#if isEmpty && checkoutStep !== 'success'}
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
                    aria-label={"Select " + object.name}
                  >
                    <div class="object-image">
                      <div class="object-placeholder">
                        <span>{object.name}</span>
                      </div>
                    </div>
                    <div class="object-info">
                      <span class="object-name">{object.name}</span>
                      <span class="object-price">{formatCurrency(object.price)}</span>
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
              <span>{formatCurrency(selectedObject?.price || 0)}</span>
            </div>
          {/each}
        </div>

        <div class="summary-total">
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
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
          {@const selectedObject = objects3D.find(obj => obj.id === $selectedObjects[item.drawingId])}
          <div class="summary-item">
            <img src={item.imageData} alt="Drawing preview" class="item-thumbnail" />
            <div class="item-details">
              <span class="item-id">{selectedObject?.name || 'Custom Object'}</span>
              <span class="item-price">{formatCurrency(selectedObject?.price || 0)}</span>
            </div>
          </div>
        {/each}
      </div>

      <div class="summary-total">
        <span>Total ({$cartSize} {($cartSize === 1 ? 'item' : 'items')}):</span>
        <span class="total-amount">{formatCurrency(totalAmount)}</span>
      </div>
    </div>

    <div class="checkout-form">
      <h2 id="shipping-info-heading">Shipping Information</h2>

      {#if errors.general}
        <div class="error-message" aria-live="polite">{errors.general}</div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} aria-labelledby="shipping-info-heading" novalidate>
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            bind:value={buyerInfo.name}
            required
            autocomplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : ''}
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
            aria-describedby={errors.email ? 'email-error' : ''}
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
            aria-describedby={errors.address ? 'address-error' : ''}
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
              aria-describedby={errors.city ? 'city-error' : ''}
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
              aria-describedby={errors.state ? 'state-error' : ''}
            />
            {#if errors.state}
              <span id="state-error" class="error-text">{errors.state}</span>
            {/if}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="zipCode">Postal/ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              bind:value={buyerInfo.zipCode}
              required
              pattern={currentCountryConfig.zipPattern}
              title={currentCountryConfig.zipTitle}
              autocomplete="postal-code"
              aria-invalid={errors.zipCode ? 'true' : 'false'}
              aria-describedby={errors.zipCode ? 'zipCode-error' : ''}
            />
            {#if errors.zipCode}
              <span id="zipCode-error" class="error-text">{errors.zipCode}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <select
              id="country"
              bind:value={buyerInfo.country}
              required
              aria-invalid={errors.country ? 'true' : 'false'}
              aria-describedby={errors.country ? 'country-error' : ''}
            >
              {#each Object.keys(countryConfigs) as countryCode}
                <option value={countryCode}>{countryCode}</option>
              {/each}
            </select>
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
              Complete Purchase - {formatCurrency(totalAmount)}
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
      <p>A confirmation has been sent to {buyerInfo.email}.</p>
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
    color: #2c3e50;
  }
  
  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #2c3e50;
  }
  
  .empty-checkout {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .checkout-content {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
    
    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
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
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .item-image {
    position: relative;
    height: 100%;
    
    @media (max-width: 768px) {
      height: 240px;
    }
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
    transition: background-color 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
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
    
    &:hover {
      border-color: #ccc;
    }
    
    &.selected {
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
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
    
    @media (max-width: 960px) {
      position: static;
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
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }
    
    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
      
      &:focus {
        border-color: #4CAF50;
        outline: none;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
      }
      
      &[aria-invalid="true"] {
        border-color: #f44336;
      }
    }
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
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
    
    button {
      margin-top: 2rem;
    }
  }
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  
  .back-button, .secondary-button {
    background: white;
    border: 1px solid #ddd;
    color: #333;
    
    &:hover {
      background: #f5f5f5;
    }
  }
  
  .checkout-button, .primary-button {
    background: #4CAF50;
    color: white;
    font-weight: bold;
    
    &:hover {
      background: #43A047;
    }
    
    &:disabled {
      background: #9E9E9E;
    }
  }
  
  .error-message {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
  }
  
  .error-text {
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 0.5rem;
    vertical-align: middle;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
