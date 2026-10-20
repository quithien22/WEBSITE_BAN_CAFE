"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = require("crypto");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId, dto) {
        let subtotal = 0;
        const orderItemsData = [];
        for (const item of dto.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product || !product.isActive) {
                throw new common_1.BadRequestException(`Sản phẩm với ID ${item.productId} không tồn tại hoặc đã ngừng bán`);
            }
            if (product.stock < item.qty) {
                throw new common_1.BadRequestException(`Sản phẩm "${product.name}" không đủ số lượng tồn kho (chỉ còn lại ${product.stock} phần)`);
            }
            const unitPrice = product.price;
            const lineTotal = unitPrice * item.qty;
            subtotal += lineTotal;
            orderItemsData.push({
                productId: product.id,
                productName: product.name,
                imageUrl: product.imageUrl,
                size: item.size,
                sugar: item.sugar,
                ice: item.ice,
                toppings: item.toppings || [],
                unitPrice,
                qty: item.qty,
                lineTotal,
            });
        }
        let discount = 0;
        if (dto.couponCode === "CHAO10") {
            discount = Math.round(subtotal * 0.1);
        }
        const pointsUsed = dto.pointsUsed || 0;
        const total = subtotal - discount - pointsUsed;
        const finalTotal = total > 0 ? total : 0;
        const idempotencyKey = crypto.randomUUID();
        const order = await this.prisma.$transaction(async (tx) => {
            for (const item of dto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.qty,
                        },
                    },
                });
            }
            return await tx.order.create({
                data: {
                    userId,
                    subtotal,
                    discount,
                    pointsUsed,
                    total: finalTotal,
                    couponCode: dto.couponCode,
                    note: dto.note,
                    status: client_1.OrderStatus.PENDING,
                    items: {
                        create: orderItemsData,
                    },
                    payments: {
                        create: {
                            idempotencyKey,
                            amount: finalTotal,
                            method: dto.paymentMethod,
                            provider: dto.provider,
                            status: client_1.PaymentStatus.PENDING,
                        },
                    },
                    statusLogs: {
                        create: {
                            status: client_1.OrderStatus.PENDING,
                        },
                    },
                },
                include: {
                    items: true,
                    payments: true,
                },
            });
        });
        return {
            message: "Tạo đơn hàng thành công",
            orderId: order.id,
            total: order.total,
            paymentUrl: `https://sandbox.gateway.com/pay?orderId=${order.id}&key=${idempotencyKey}`,
        };
    }
    async getOrderDetail(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                payments: true,
                user: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException("Không tìm thấy đơn hàng");
        }
        return order;
    }
    async handlePaymentCallback(orderId, status, transactionId, failureReason) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                payments: true,
                items: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException("Không tìm thấy đơn hàng");
        }
        const payment = order.payments[0];
        if (!payment) {
            throw new common_1.NotFoundException("Không tìm thấy thông tin giao dịch thanh toán");
        }
        const newOrderStatus = status === "SUCCESS" ? client_1.OrderStatus.PAID : client_1.OrderStatus.PAYMENT_FAILED;
        const newPaymentStatus = status === "SUCCESS" ? client_1.PaymentStatus.SUCCESS : client_1.PaymentStatus.FAILED;
        return await this.prisma.$transaction(async (tx) => {
            if (status === "FAILED") {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.qty,
                            },
                        },
                    });
                }
            }
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: newPaymentStatus,
                    transactionId,
                    failureReason,
                },
            });
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: newOrderStatus,
                    statusLogs: {
                        create: {
                            status: newOrderStatus,
                        },
                    },
                },
                include: {
                    items: true,
                    payments: true,
                },
            });
            return updatedOrder;
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map