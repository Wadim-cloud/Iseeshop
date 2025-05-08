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
export interface PurchaseResult {
    success: boolean;
    orderId?: string;
    error?: string;
}
export declare function completePurchase(buyerInfo: BuyerInfo): Promise<PurchaseResult>;
