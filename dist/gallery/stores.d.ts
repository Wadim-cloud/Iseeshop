export declare const likesStore: import("svelte/store").Writable<Record<number, number>>;
import type { Drawing } from './GalleryContainer.svelte';
export type CartItem = {
    drawingId: number;
    imageData: string;
    selected3DObject?: string;
};
export declare const cartStore: import("svelte/store").Writable<CartItem[]>;
export declare const cartActions: {
    addToCart: (drawing: Drawing) => void;
    removeFromCart: (drawingId: number) => void;
    clearCart: () => void;
    updateCartItem: (drawingId: number, updates: Partial<CartItem>) => void;
};
export declare const cartSize: import("svelte/store").Writable<number>;
