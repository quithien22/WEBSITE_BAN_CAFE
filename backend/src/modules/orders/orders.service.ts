import {
  BadRequestException, ConflictException, ForbiddenException,
  Injectable, NotFoundException, ServiceUnavailableException,
} from '@nestjs/common';
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

const includeDetail = {
  items: true,
  payments: { select: { id: true, amount: true, method: true, provider: true, status: true, transactionId: true, failureReason: true, createdAt: true } },
  statusLogs: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.OrderInclude;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async owned(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: includeDetail });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.userId !== userId) throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    return order;
  }

  async createOrder(userId: number, dto: CreateOrderDto) {
    if (!dto.items.length) throw new BadRequestException('Giỏ hàng trống');
    if ((dto.provider === 'card') !== (dto.paymentMethod === PaymentMethod.CARD)) {
      throw new BadRequestException('Phương thức thanh toán và nhà cung cấp không khớp');
    }
    // Giá, tên, ảnh luôn lấy từ DB, không tin giá frontend gửi lên.
    // Topping không nhận giá do client tự điền, phải kiểm tra bằng bảng Topping.
    const items: Array<{
      productId: number; productName: string; imageUrl: string; size: string;
      sugar: string; ice: string; toppings: Prisma.InputJsonValue;
      unitPrice: number; qty: number; lineTotal: number;
    }> = [];
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.isActive || item.qty > product.stock) {
        throw new BadRequestException(`Sản phẩm ${item.productId} không đủ hàng hoặc không còn bán`);
      }
      if (item.toppings?.length) {
        // Chưa có quy tắc tính giá topping/size được chuẩn hóa.
        // Từ chối thay vì âm thầm thu thiếu tiền.
        throw new BadRequestException('Topping chưa được hỗ trợ ở API đặt hàng an toàn');
      }
      if (item.size !== 'S') {
        throw new BadRequestException('Chỉ hỗ trợ giá size S cho đến khi cấu hình bảng giá size');
      }
      items.push({
        productId: product.id, productName: product.name, imageUrl: product.imageUrl,
        size: item.size, sugar: item.sugar, ice: item.ice, toppings: [],
        unitPrice: product.price, qty: item.qty, lineTotal: product.price * item.qty,
      });
    }
    const subtotal = items.reduce((sum, x) => sum + x.lineTotal, 0);
    if (!Number.isSafeInteger(subtotal)) throw new BadRequestException('Giá trị đơn vượt giới hạn');
    // Chưa có PromotionService xác thực mã giảm giá và giới hạn sử dụng.
    if (dto.couponCode) throw new BadRequestException('Mã khuyến mãi chưa được tích hợp');
    if (dto.pointsUsed) throw new BadRequestException('Dùng điểm thưởng chưa được tích hợp');

    const order = await this.prisma.order.create({
      data: {
        userId, subtotal, discount: 0, pointsUsed: 0, total: subtotal,
        note: dto.note, status: OrderStatus.PENDING,
        items: { create: items },
        payments: { create: {
          idempotencyKey: randomUUID(), amount: subtotal,
          method: dto.paymentMethod, provider: dto.provider, status: PaymentStatus.PENDING,
        } },
        statusLogs: { create: { status: OrderStatus.PENDING } },
      },
      include: includeDetail,
    });
    return {
      orderId: order.id, status: order.status, amount: order.total,
      paymentStatus: 'PENDING', paymentUrl: null,
      message: 'Đã tạo đơn chờ thanh toán. Chưa kết nối cổng thanh toán thật.',
    };
  }

  async listMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId }, include: includeDetail, orderBy: { createdAt: 'desc' }, take: 50,
    });
  }

  getOrderDetail(userId: number, orderId: number) {
    return this.owned(userId, orderId);
  }

  async cancelOrder(userId: number, orderId: number) {
    const order = await this.owned(userId, orderId);
    if (order.status !== OrderStatus.PENDING) {
      throw new ConflictException('Chỉ đơn chờ thanh toán mới được hủy bằng API này');
    }
    // CAS tránh 2 request đồng thời cập nhật cùng một đơn.
    return this.prisma.$transaction(async tx => {
      const changed = await tx.order.updateMany({
        where: { id: orderId, userId, status: OrderStatus.PENDING },
        data: { status: OrderStatus.CANCELLED, version: { increment: 1 } },
      });
      if (changed.count !== 1) throw new ConflictException('Trạng thái đơn đã thay đổi');
      await tx.orderStatusLog.create({ data: { orderId, status: OrderStatus.CANCELLED } });
      return tx.order.findUnique({ where: { id: orderId }, include: includeDetail });
    });
  }

  async demoPay(userId: number, orderId: number) {
    if (process.env.NODE_ENV !== 'development' || process.env.ALLOW_DEMO_PAYMENTS !== 'true') {
      throw new ForbiddenException('Thanh toán demo đã bị tắt');
    }
    const order = await this.owned(userId, orderId);
    if (order.status === OrderStatus.PAID) return order;
    if (order.status !== OrderStatus.PENDING) throw new ConflictException('Đơn không thể thanh toán');
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, status: PaymentStatus.PENDING }, orderBy: { createdAt: 'desc' },
    });
    if (!payment) throw new NotFoundException('Không tìm thấy giao dịch chờ');
    return this.prisma.$transaction(async tx => {
      const changed = await tx.order.updateMany({
        where: { id: orderId, userId, status: OrderStatus.PENDING },
        data: { status: OrderStatus.PAID, version: { increment: 1 } },
      });
      if (changed.count !== 1) throw new ConflictException('Đơn đã thay đổi trạng thái');
      await tx.payment.updateMany({
        where: { id: payment.id, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.SUCCESS, transactionId: `DEMO-${randomUUID()}` },
      });
      await tx.orderStatusLog.create({ data: { orderId, status: OrderStatus.PAID } });
      return tx.order.findUnique({ where: { id: orderId }, include: includeDetail });
    });
  }
}
