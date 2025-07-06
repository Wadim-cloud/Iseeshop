<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { BuyerInfo, CountryConfig } from '$lib/gallery/types';

  export let buyerInfo: BuyerInfo;
  export let countryConfigs: Record<string, CountryConfig>;
  export let currentCountryConfig: CountryConfig;
  export let errors: Record<string, string>;
  export let isSubmitting: boolean;

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('submit');
  }

  function goBack() {
    dispatch('goBack');
  }
</script>

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
          required={countryConfigs[buyerInfo.country]?.states?.length > 0}
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
      <button type="button" class="secondary-button" on:click={goBack}>Back to Products</button>
      <button type="submit" class="primary-button" disabled={isSubmitting}>
        {#if isSubmitting}
          <span class="spinner"></span> Processing...
        {:else}
          Complete Purchase
        {/if}
      </button>
    </div>
  </form>
</div>

<style lang="scss">
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

  .error-message {
    background: rgba(244, 67, 54, 0.5);
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
    
    &:disabled {
      background-color: #a5d6a7;
      cursor: not-allowed;
    }
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
</style>