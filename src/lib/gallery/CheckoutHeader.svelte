<script lang="ts">
  export let checkoutStep: 'product-selection' | 'shipping-info' | 'success';
</script>

<h1>
  {#if checkoutStep === 'product-selection'}
    Your Custom 3D Order
  {:else if checkoutStep === 'shipping-info'}
    Shipping Information
  {:else}
    Order Complete
  {/if}
</h1>

<style lang="scss">
  h1 {
    margin-bottom: 2rem;
    text-align: center;
    color: #2c3e50;
  }
</style>