export declare const likesStore: import("svelte/store").Writable<Record<number, number>>;
import type { Drawing } from './GalleryContainer.svelte';
export type CartItem = {
    drawingId: string;
    imageData: string;
    selected3DObject?: string;
};
export declare const cartStore: import("svelte/store").Writable<CartItem[]>;
export declare const cartActions: {
    addToCart: (drawing: Drawing) => void;
    removeFromCart: (drawingId: string) => void;
    clearCart: () => void;
    updateCartItem: (drawingId: string, updates: Partial<CartItem>) => void;
};
export declare const cartSize: import("svelte/store").Writable<number>;
