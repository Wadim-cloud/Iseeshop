// src/lib/gallery/stores.ts
import { writable, get } from 'svelte/store';
import Drawing from './GalleryContainer.svelte';
// Likes store with string keys
export const likesStore = writable({});
export const cartStore = writable([]);
// Helper functions for cart operations
export const cartActions = {
    addToCart: (drawing) => {
        const cart = get(cartStore);
        // Check if drawing is already in cart
        if (!cart.some(item => item.drawingId === drawing.id)) {
            cartStore.update(items => [...items, {
                    drawingId: drawing.id,
                    imageData: drawing.image_data
                }]);
        }
    },
    removeFromCart: (drawingId) => {
        cartStore.update(items => items.filter(item => item.drawingId !== drawingId));
    },
    clearCart: () => {
        cartStore.set([]);
    },
    updateCartItem: (drawingId, updates) => {
        cartStore.update(items => items.map(item => item.drawingId === drawingId
            ? { ...item, ...updates }
            : item));
    }
};
// Cart size for badge display
export const cartSize = writable(0);
// Subscribe to cart changes to update size
cartStore.subscribe(items => {
    cartSize.set(items.length);
});
