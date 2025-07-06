<script lang="ts">
  import { cartStore } from '$lib/gallery/stores';
  import type { Object3D } from '$lib/gallery/types';
  import { createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';

  export let objects3D: Object3D[];
  export let selectedObjects: { subscribe: any; update: any };
  export let formatCurrency: (amount: number) => string;

  const dispatch = createEventDispatcher();

  function removeItem(drawingId: string) {
    dispatch('removeItem', drawingId);
  }

  function updateSelection(drawingId: string, objectId: string) {
    dispatch('updateSelection', { drawingId, objectId });
  }
</script>

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
              class="object-option {get(selectedObjects)[item.drawingId] === object.id ? 'selected' : ''}"
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
              {#if get(selectedObjects)[item.drawingId]}
                {@const selectedObject = objects3D.find(obj => obj.id === get(selectedObjects)[item.drawingId])}
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

<style lang="scss">
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
</style>