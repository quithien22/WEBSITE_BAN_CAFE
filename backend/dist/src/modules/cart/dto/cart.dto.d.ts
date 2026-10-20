export declare class CartItemInputDto {
    productId: number;
    qty: number;
    size?: string;
    sugar?: string;
    ice?: string;
    toppings?: any[];
}
export declare class ValidateCartDto {
    items: CartItemInputDto[];
    couponCode?: string;
}
export declare class ApplyCouponDto {
    code: string;
    subtotal: number;
}
