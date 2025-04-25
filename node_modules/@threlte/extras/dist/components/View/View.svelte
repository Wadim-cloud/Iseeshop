<script lang="ts">import InnerView from './InnerView.svelte';
let { dom, children } = $props();
</script>

{#if dom}
  <InnerView {dom}>
    {@render children?.()}
  </InnerView>
{/if}
