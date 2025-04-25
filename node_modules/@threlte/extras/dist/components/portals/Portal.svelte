<script lang="ts">import { T } from '@threlte/core';
import { Object3D } from 'three';
import { usePortalContext } from './usePortalContext.svelte';
import { SvelteSet } from 'svelte/reactivity';
let { id = 'default', object, children } = $props();
const { getPortal } = usePortalContext();
const portal = getPortal(id);
let target = $derived(object ?? portal.current);
const portalChildren = new SvelteSet();
const proxy = new Object3D();
proxy.add = (child) => {
    portalChildren.add(child);
    return child;
};
proxy.remove = (child) => {
    portalChildren.delete(child);
    return child;
};
proxy.clear = () => {
    portalChildren.clear();
    return proxy;
};
$effect.pre(() => {
    let targetRef = target;
    if (targetRef === undefined)
        return;
    for (const child of portalChildren) {
        if (targetRef.children.includes(child))
            continue;
        targetRef.add(child);
    }
    return () => {
        for (const child of portalChildren) {
            if (targetRef.children.includes(child)) {
                targetRef.remove(child);
            }
        }
    };
});
</script>

{#if target}
  <T
    is={proxy}
    attach={false}
  >
    {@render children?.()}
  </T>
{/if}
