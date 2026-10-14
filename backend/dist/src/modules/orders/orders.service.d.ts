import { PrismaService } from "../../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: number, dto: CreateOrderDto): Promise<{
        message: string;
        orderId: number;
        total: number;
        paymentUrl: string;
    }>;
    getOrderDetail(orderId: number): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
        };
        items: {
            id: number;
            productName: string;
            imageUrl: string;
            size: string;
            sugar: string;
            ice: string;
            toppings: import("@prisma/client/runtime/library").JsonValue;
            unitPrice: number;
            qty: number;
            lineTotal: number;
            productId: number;
            orderId: number;
        }[];
        payments: {
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            id: number;
            orderId: number;
            idempotencyKey: string;
            amount: number;
            method: import(".prisma/client").$Enums.PaymentMethod;
            provider: string;
            transactionId: string | null;
            failureReason: string | null;
        }[];
    } & {
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        pointsUsed: number;
        total: number;
        couponCode: string | null;
        note: string | null;
        pointsEarned: number;
        pointsAwarded: boolean;
        version: number;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
    handlePaymentCallback(orderId: number, status: "SUCCESS" | "FAILED", transactionId?: string, failureReason?: string): Promise<{
        items: {
            id: number;
            productName: string;
            imageUrl: string;
            size: string;
            sugar: string;
            ice: string;
            toppings: import("@prisma/client/runtime/library").JsonValue;
            unitPrice: number;
            qty: number;
            lineTotal: number;
            productId: number;
            orderId: number;
        }[];
        payments: {
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            id: number;
            orderId: number;
            idempotencyKey: string;
            amount: number;
            method: import(".prisma/client").$Enums.PaymentMethod;
            provider: string;
            transactionId: string | null;
            failureReason: string | null;
        }[];
    } & {
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        pointsUsed: number;
        total: number;
        couponCode: string | null;
        note: string | null;
        pointsEarned: number;
        pointsAwarded: boolean;
        version: number;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
    }>;
}
