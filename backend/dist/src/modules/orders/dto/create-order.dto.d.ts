import { PaymentMethod } from "@prisma/client";
declare class OrderItemInputDto {
    productId: number;
    qty: number;
    size: string;
    sugar: string;
    ice: string;
    toppings?: any;
}
export declare class CreateOrderDto {
    items: OrderItemInputDto[];
    paymentMethod: PaymentMethod;
    provider: string;
    couponCode?: string;
    note?: string;
    pointsUsed?: number;
}
export {};
