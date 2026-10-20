// backend/src/modules/cart/cart.service.ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ValidateCartDto, ApplyCouponDto } from "./dto/cart.dto";
import { DiscountType } from "@prisma/client";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Phụ thu theo size chuẩn của quán
  private getSizeExtraPrice(size?: string): number {
    if (!size) return 0;
    const normalized = size.toUpperCase();
    if (normalized.includes("L")) return 10000;
    if (normalized.includes("M")) return 5000;
    return 0; // Size S mặc định +0đ
  }

  // 1. Kiểm tra giỏ hàng, đối chiếu giá DB, tồn kho và tính tổng tiền
  async validateCart(dto: ValidateCartDto) {
    let subtotal = 0;
    let isValid = true;
    const validatedItems: any[] = [];

    // Lấy toàn bộ topping đang bán từ DB để đối chiếu giá chuẩn
    const dbToppings = await this.prisma.topping.findMany({
      where: { isActive: true },
    });
    const toppingMap = new Map(dbToppings.map((t) => [t.id, t]));

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        isValid = false;
        validatedItems.push({
          ...item,
          isValid: false,
          errorMessage: "Sản phẩm không tồn tại hoặc đã ngừng bán",
        });
        continue;
      }

      const isEnoughStock = product.stock >= item.qty;
      if (!isEnoughStock) {
        isValid = false;
      }

      // Tính giá topping (ưu tiên đối chiếu từ bảng Topping trong DB)
      let toppingsPrice = 0;
      const normalizedToppings: any[] = [];

      if (Array.isArray(item.toppings)) {
        for (const t of item.toppings) {
          const dbTopping = t?.id ? toppingMap.get(Number(t.id)) : undefined;
          const price = dbTopping
            ? dbTopping.price
            : typeof t?.price === "number"
              ? t.price
              : 0;

          toppingsPrice += price;
          normalizedToppings.push({
            id: dbTopping?.id ?? t?.id,
            name: dbTopping?.name ?? t?.name ?? "Topping",
            price,
          });
        }
      }

      const sizeExtra = this.getSizeExtraPrice(item.size);
      const unitPrice = product.price + sizeExtra + toppingsPrice;
      const lineTotal = unitPrice * item.qty;
      subtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        size: item.size || "S",
        sugar: item.sugar || "100%",
        ice: item.ice || "100%",
        toppings: normalizedToppings,
        basePrice: product.price,
        sizeExtra,
        toppingsPrice,
        unitPrice,
        qty: item.qty,
        maxStock: product.stock,
        lineTotal,
        isValid: isEnoughStock,
        errorMessage: isEnoughStock
          ? null
          : `Chỉ còn ${product.stock} sản phẩm trong kho`,
      });
    }

    // Kiểm tra mã giảm giá nếu gửi kèm
    let discount = 0;
    let couponInfo: any = null;
    if (dto.couponCode) {
      try {
        const couponResult = await this.applyCoupon({
          code: dto.couponCode,
          subtotal,
        });
        discount = couponResult.discount;
        couponInfo = couponResult;
      } catch (err: any) {
        couponInfo = {
          code: dto.couponCode,
          valid: false,
          message: err?.message || "Mã giảm giá không hợp lệ",
        };
      }
    }

    // Tính phí ship (Miễn phí cho đơn từ 100.000đ, ngược lại 15.000đ)
    const shippingFee = subtotal === 0 || subtotal >= 100000 ? 0 : 15000;
    const total = Math.max(subtotal + shippingFee - discount, 0);

    return {
      isValid,
      items: validatedItems,
      subtotal,
      shippingFee,
      discount,
      total,
      coupon: couponInfo,
    };
  }

  // 2. Kiểm tra và tính tiền mã khuyến mãi từ bảng Promotion
  async applyCoupon(dto: ApplyCouponDto) {
    const code = dto.code.trim().toUpperCase();
    const now = new Date();

    const promo = await this.prisma.promotion.findUnique({
      where: { code },
    });

    if (!promo || !promo.isActive) {
      throw new BadRequestException("Mã giảm giá không tồn tại hoặc đã khóa ");
    }

    if (now < promo.startsAt || now > promo.endsAt) {
      throw new BadRequestException("Mã giảm giá chưa đến hạn hoặc đã hết hạn");
    }

    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
      throw new BadRequestException("Mã giảm giá đã hết lượt sử dụng");
    }

    if (dto.subtotal < promo.minOrder) {
      throw new BadRequestException(
        `Đơn hàng tối thiểu phải từ ${promo.minOrder.toLocaleString("vi-VN")}đ để dùng mã này`,
      );
    }

    let discount = 0;
    if (promo.type === DiscountType.PERCENT) {
      discount = Math.round((dto.subtotal * promo.value) / 100);
      if (promo.maxDiscount !== null && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = promo.value;
    }

    const finalTotal = Math.max(dto.subtotal - discount, 0);

    return {
      valid: true,
      code: promo.code,
      title: promo.title,
      discount,
      subtotal: dto.subtotal,
      total: finalTotal,
      message: `Áp dụng mã ${promo.code} thành công`,
    };
  }

  // 3. Lấy danh sách mã khuyến mãi đang hoạt động
  async getAvailablePromotions() {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { minOrder: "asc" },
    });
  }
}