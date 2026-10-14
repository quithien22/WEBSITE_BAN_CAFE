// src/modules/orders/orders.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import * as crypto from "crypto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    let subtotal = 0;
    const orderItemsData = [];

    // 1. Duyệt qua từng sản phẩm để lấy thông tin giá và tính tổng tiền
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw new BadRequestException(
          `Sản phẩm với ID ${item.productId} không tồn tại hoặc đã ngừng bán`,
        );
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

    // 2. Xử lý mã giảm giá (Promotion / couponCode)
    let discount = 0;
    if (dto.couponCode === "CHAO10") {
      discount = subtotal * 0.1; // Giảm 10% theo mã CHAO10
    }

    const pointsUsed = dto.pointsUsed || 0;
    const total = subtotal - discount - pointsUsed;
    const finalTotal = total > 0 ? total : 0;

    // Tạo chuỗi idempotencyKey để chống thanh toán trùng lặp
    const idempotencyKey = crypto.randomUUID();

    // 3. Lưu Order, OrderItem, Payment và StatusLog vào Database thông qua Prisma transaction
    const order = await this.prisma.order.create({
      data: {
        userId,
        subtotal,
        discount,
        pointsUsed,
        total: finalTotal,
        couponCode: dto.couponCode,
        note: dto.note,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsData,
        },
        payments: {
          create: {
            idempotencyKey,
            amount: finalTotal,
            method: dto.paymentMethod,
            provider: dto.provider,
            status: PaymentStatus.PENDING,
          },
        },
        statusLogs: {
          create: {
            status: OrderStatus.PENDING,
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return {
      message: "Tạo đơn hàng thành công",
      orderId: order.id,
      total: order.total,
      paymentUrl: `https://sandbox.gateway.com/pay?orderId=${order.id}&key=${idempotencyKey}`,
    };
  }

  // Lấy chi tiết đơn hàng cho trang Đặt hàng thành công hoặc Thanh toán thất bại
  async getOrderDetail(orderId: number) {
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
      throw new NotFoundException("Không tìm thấy đơn hàng");
    }

    return order;
  }

  // Xử lý khi cổng thanh toán trả về kết quả (Webhook / Callback)
  async handlePaymentCallback(
    orderId: number,
    status: "SUCCESS" | "FAILED",
    transactionId?: string,
    failureReason?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException("Không tìm thấy đơn hàng");
    }

    const payment = order.payments[0];
    if (!payment) {
      throw new NotFoundException(
        "Không tìm thấy thông tin giao dịch thanh toán",
      );
    }

    const newOrderStatus =
      status === "SUCCESS" ? OrderStatus.PAID : OrderStatus.PAYMENT_FAILED;
    const newPaymentStatus =
      status === "SUCCESS" ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

    return await this.prisma.$transaction(async (prisma) => {
      // Cập nhật trạng thái bảng Payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: newPaymentStatus,
          transactionId,
          failureReason,
        },
      });

      // Cập nhật trạng thái bảng Order và ghi log vào OrderStatusLog
      const updatedOrder = await prisma.order.update({
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
}
