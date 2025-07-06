<script lang="ts">
  import { onMount } from 'svelte';
  import { cartStore, cartSize, cartActions } from '$lib/gallery/stores';
  import { completePurchase } from '$lib/gallery/CheckoutService';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import sanitizeHtml from 'sanitize-html';
  import { createClient } from '@supabase/supabase-js';
  import CheckoutHeader from '$lib/gallery/CheckoutHeader.svelte';
  import CheckoutItems from '$lib/gallery/CheckoutItems.svelte';
  import CheckoutSummary from '$lib/gallery/CheckoutSummary.svelte';
  import ShippingForm from '$lib/gallery/ShippingForm.svelte';
  import SuccessMessage from '$lib/gallery/SuccessMessage.svelte';
  import type { BuyerInfo, CountryConfig, Object3D } from '$lib/gallery/types';

  // Initialize Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

  // Available 3D objects
  const objects3D: Object3D[] = [
    { id: 'mug', name: 'Coffee Mug', price: 19.99, image: '/images/objects/mug.jpg' },
    { id: 'tshirt', name: 'T-Shirt', price: 24.99, image: '/images/objects/tshirt.jpg' },
    { id: 'poster', name: 'Poster', price: 14.99, image: '/images/objects/poster.jpg' },
    { id: 'phonecase', name: 'Phone Case', price: 29.99, image: '/images/objects/phonecase.jpg' },
    { id: 'pillow', name: 'Throw Pillow', price: 34.99, image: '/images/objects/pillow.jpg' }
  ];

  // Country configurations
  const countryConfigs: Record<string, CountryConfig> = {
    US: {
      currency: 'USD',
      zipPattern: '^\\d{5}(-\\d{4})?$',
      zipTitle: 'Enter a valid US ZIP code (e.g., 12345 or 12345-6789)',
      states: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    },
    NL: {
      currency: 'EUR',
      zipPattern: '^[1-9][0-9]{3}\\s?[A-Z]{2}$',
      zipTitle: 'Enter a valid Dutch postal code (e.g., 1234 AB)',
      states: []
    },
    UK: {
      currency: 'GBP',
      zipPattern: '^[A-Z]{1,2}[0-9][A-Z0-9]?\\s?[0-9][A-Z]{2}$',
      zipTitle: 'Enter a valid UK postcode (e.g., SW1A 1AA)',
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

  // Reactive state
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
  let totalAmount: number;

  $: isEmpty = $cartStore.length === 0;
  $: {
    totalAmount = calculateTotal();
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
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return null;
    }
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.warn('No authenticated user found');
        return null;
      }
      return {
        email: user.email || '',
        name: user.user_metadata?.name || '',
        country: user.user_metadata?.country || ''
      };
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  }

  onMount(async () => {
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
      totalAmount = calculateTotal();
    } else {
      goto('/gallery');
    }
  });

  function calculateTotal(): number {
    return $cartStore.reduce((total, item) => {
      const object = objects3D.find(obj => obj.id === item.selected3DObject);
      return total + (object?.price || 0);
    }, 0);
  }

  function updateTotal() {
    totalAmount = calculateTotal();
    cartStore.set([...$cartStore]);
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

  async function sendOrderEmail({ buyerInfo, orderId, totalAmount }: { buyerInfo: BuyerInfo; orderId: string; totalAmount: number }) {
    const response = await fetch('/api/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buyerInfo: { ...buyerInfo, email: 'w.v.seminsky@gmail.com' }, // Override email
        orderId,
        totalAmount
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send order email');
    }
    return result;
  }

  async function handleSubmit() {
    isSubmitting = true;
    errors = {};

    errors = validateBuyerInfo(buyerInfo);
    if (Object.keys(errors).length > 0) {
      isSubmitting = false;
      const firstInvalid = document.querySelector('input:invalid, select:invalid, [aria-invalid="true"]');
      if (firstInvalid) (firstInvalid as HTMLElement).focus();
      return;
    }

    try {
      const sanitizedInfo = sanitizeBuyerInfo(buyerInfo);
      const result = await completePurchase(sanitizedInfo, $cartStore, totalAmount);

      if (result.success) {
        orderId = result.orderId;
        try {
          await sendOrderEmail({ buyerInfo: sanitizedInfo, orderId, totalAmount });
          checkoutStep = 'success';
          cartActions.clearCart();
        } catch (emailErr) {
          console.error('Failed to send order email:', emailErr);
          errors.general = `Purchase completed (Order #${orderId}), but failed to send confirmation email.`;
        }
      } else {
        errors.general = result.error || 'Failed to process purchase';
      }
    } catch (err) {
      errors.general = err instanceof Error ? `Purchase failed: ${err.message}` : 'An unexpected error occurred';
    } finally {
      isSubmitting = false;
    }
  }

  function validateBuyerInfo(info: BuyerInfo): Record<string, string> {
    const errors: Record<string, string> = {};
    const config = countryConfigs[info.country] || countryConfigs[DEFAULT_COUNTRY];

    if (!info.name?.trim()) errors.name = 'Full name is required';
    if (!info.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) errors.email = 'Invalid email address';
    if (!info.address?.trim()) errors.address = 'Street address is required';
    if (!info.city?.trim()) errors.city = 'City is required';
    if (config.states.length > 0 && !info.state?.trim()) errors.state = 'State/Province is required';
    if (!info.zipCode?.trim()) errors.zipCode = 'Postal/ZIP code is required';
    else if (!new RegExp(config.zipPattern).test(info.zipCode)) errors.zipCode = 'Invalid format for selected country';
    if (!info.country?.trim()) errors.country = 'Country is required';

    return errors;
  }

  function sanitizeBuyerInfo(info: BuyerInfo): BuyerInfo {
    const sanitize = (str: string) =>
      sanitizeHtml(str || '', { allowedTags: [], allowedAttributes: {}, textFilter: (text) => text.trim() });

    return {
      name: sanitize(info.name),
      email: sanitize(info.email),
      address: sanitize(info.address),
      city: sanitize(info.city),
      state: sanitize(info.state),
      zipCode: sanitize(info.zipCode),
      country: sanitize(info.country)
    };
  }
</script>

<svelte:head>
  <title>Checkout | Pexos</title>
  <meta name="description" content="Complete your order" />
</svelte:head>

<div class="checkout-container">
  <CheckoutHeader {checkoutStep} />
  
  {#if isEmpty && checkoutStep !== 'success'}
    <div class="empty-checkout">
      <p>Your cart is empty.</p>
      <button class="back-button" on:click={goBackToGallery}>Return to Gallery</button>
    </div>
  {:else if checkoutStep === 'product-selection'}
    <div class="checkout-content">
      <CheckoutItems
        {objects3D}
        {selectedObjects}
        {formatCurrency}
        on:removeItem={e => cartActions.removeFromCart(e.detail)}
        on:updateSelection={e => {
          selectedObjects.update(current => {
            current[e.detail.drawingId] = e.detail.objectId;
            cartActions.updateCartItem(e.detail.drawingId, { selected3DObject: e.detail.objectId });
            return current;
          });
          totalAmount = calculateTotal();
        }}
      />
      <CheckoutSummary
        {objects3D}
        {selectedObjects}
        {totalAmount}
        {formatCurrency}
        on:updateTotal={updateTotal}
        on:goToShipping={goToShippingInfo}
        on:goBack={goBackToGallery}
      />
    </div>
  {:else if checkoutStep === 'shipping-info'}
    <CheckoutSummary
      {objects3D}
      {selectedObjects}
      {totalAmount}
      {formatCurrency}
      cartSize={$cartSize}
      showFullSummary={false}
    />
    <ShippingForm
      bind:buyerInfo
      {countryConfigs}
      {currentCountryConfig}
      {errors}
      {isSubmitting}
      on:submit={handleSubmit}
      on:goBack={goBackToProductSelection}
    />
  {:else if checkoutStep === 'success'}
    <SuccessMessage {orderId} email={buyerInfo.email} on:goBack={goBackToGallery} />
  {/if}
</div>

<style lang="scss">
  .checkout-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
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
</style>