import { supabase } from '$lib/supabase';
import { get } from 'svelte/store';
import { cartStore, cartActions } from './stores';

// Define 3D objects with their prices to match the Svelte component
const objects3D = [
  { id: 'mug', name: 'Coffee Mug', price: 19.99 },
  { id: 'tshirt', name: 'T-Shirt', price: 24.99 },
  { id: 'poster', name: 'Poster', price: 14.99 },
  { id: 'phonecase', name: 'Phone Case', price: 29.99 },
  { id: 'pillow', name: 'Throw Pillow', price: 34.99 }
];

export interface BuyerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  drawingId: string;
  price: number;
  selected3DObject?: string;
}

export interface Order {
  buyerInfo: BuyerInfo;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PurchaseResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export async function completePurchase(buyerInfo: BuyerInfo): Promise<PurchaseResult> {
  try {
    const cartItems = get(cartStore);
    
    if (!cartItems || cartItems.length === 0) {
      return {
        success: false,
        error: 'Cart is empty'
      };
    }

    // Map cart items to order items with prices based on selected 3D objects
    const orderItems: OrderItem[] = cartItems.map(item => {
      const selectedObject = objects3D.find(obj => obj.id === item.selected3DObject);
      if (!selectedObject) {
        throw new Error(`Invalid 3D object selected for drawing ${item.drawingId}`);
      }
      return {
        drawingId: item.drawingId,
        price: selectedObject.price,
        selected3DObject: item.selected3DObject
      };
    });

    // Calculate total amount
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_name: buyerInfo.name,
        buyer_email: buyerInfo.email,
        buyer_address: buyerInfo.address,
        buyer_city: buyerInfo.city,
        buyer_state: buyerInfo.state,
        buyer_zip: buyerInfo.zipCode,
        buyer_country: buyerInfo.country,
        total_amount: totalAmount,
        status: 'pending',
        order_date: new Date().toISOString()
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      return {
        success: false,
        error: 'Failed to create order'
      };
    }

    const orderId = orderData.id;

    // Create order items
    const orderItemsData = orderItems.map(item => ({
      order_id: orderId,
      drawing_id: item.drawingId,
      price: item.price,
      selected_3d_object: item.selected3DObject || null
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Clean up by deleting the created order
      await supabase.from('orders').delete().eq('id', orderId);
      return {
        success: false,
        error: 'Failed to create order items'
      };
    }

    // Update order status to completed
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order status:', updateError);
      // Note: Order and items were created successfully, but status update failed
    }

    // Clear the cart
    cartActions.clearCart();

    return {
      success: true,
      orderId
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during checkout'
    };
  }
}