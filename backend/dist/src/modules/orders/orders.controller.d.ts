import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(user: any, dto: CreateOrderDto): Promise<{
        message: string;
        orderId: number;
        total: number;
        paymentUrl: string;
    }>;
    getOrderDetail(id: number): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
        };
        items: {
            id: number;
            imageUrl: string;
            productId: number;
            qty: number;
            size: string;
            sugar: string;
            ice: string;
            toppings: import("@prisma/client/runtime/library").JsonValue;
            productName: string;
            unitPrice: number;
            lineTotal: number;
            orderId: number;
        }[];
        payments: {
            id: number;
            createdAt: Date;
            provider: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: number;
            idempotencyKey: string;
            amount: number;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            failureReason: string | null;
        }[];
    } & {
        id: number;
        version: number;
        createdAt: Date;
        couponCode: string | null;
        note: string | null;
        pointsUsed: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        total: number;
        pointsEarned: number;
        pointsAwarded: boolean;
        updatedAt: Date;
        userId: number;
    }>;
    paymentCallback(id: number, status: "SUCCESS" | "FAILED", transactionId?: string, failureReason?: string): Promise<{
        items: {
            id: number;
            imageUrl: string;
            productId: number;
            qty: number;
            size: string;
            sugar: string;
            ice: string;
            toppings: import("@prisma/client/runtime/library").JsonValue;
            productName: string;
            unitPrice: number;
            lineTotal: number;
            orderId: number;
        }[];
        payments: {
            id: number;
            createdAt: Date;
            provider: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: number;
            idempotencyKey: string;
            amount: number;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            failureReason: string | null;
        }[];
    } & {
        id: number;
        version: number;
        createdAt: Date;
        couponCode: string | null;
        note: string | null;
        pointsUsed: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        total: number;
        pointsEarned: number;
        pointsAwarded: boolean;
        updatedAt: Date;
        userId: number;
    }>;
}
