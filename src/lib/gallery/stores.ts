// src/lib/gallery/stores.ts
import { writable, get } from 'svelte/store';
import type { Drawing } from './GalleryContainer.svelte';

// Likes store with string keys
export const likesStore = writable<Record<string, number>>({});

// Comment Counts Store
export const commentCounts = writable<{ [key: string]: number }>({});

export const commentActions = {
  incrementCommentCount: (drawingId: string) => {
    commentCounts.update(current => ({
      ...current,
      [drawingId]: (current[drawingId] || 0) + 1
    }));
  },
  setCommentCount: (drawingId: string, count: number) => {
    commentCounts.update(current => ({
      ...current,
      [drawingId]: count
    }));
  }
};

// Cart store
export type CartItem = {
  drawingId: string;
  imageData: string;
  selected3DObject?: string; // Optional 3D object type to place the drawing on
};

export const cartStore = writable<CartItem[]>([]);

// Helper functions for cart operations
export const cartActions = {
  addToCart: (drawing: Drawing) => {
    const cart = get(cartStore);
    // Check if drawing is already in cart
    if (!cart.some(item => item.drawingId === drawing.id)) {
      cartStore.update(items => [
        ...items,
        {
          drawingId: drawing.id, // Use UUID (id) for consistency
          imageData: drawing.image_data
        }
      ]);
    }
  },
  
  removeFromCart: (drawingId: string) => {
    cartStore.update(items => items.filter(item => item.drawingId !== drawingId));
  },
  
  clearCart: () => {
    cartStore.set([]);
  },
  
  updateCartItem: (drawingId: string, updates: Partial<CartItem>) => {
    cartStore.update(items => 
      items.map(item => 
        item.drawingId === drawingId 
          ? { ...item, ...updates } 
          : item
      )
    );
  }
};

// Cart size for badge display
export const cartSize = writable(0);

// Subscribe to cart changes to update size
cartStore.subscribe(items => {
  cartSize.set(items.length);
});