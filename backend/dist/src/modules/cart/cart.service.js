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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getSizeExtraPrice(size) {
        if (!size)
            return 0;
        const normalized = size.toUpperCase();
        if (normalized.includes("L"))
            return 10000;
        if (normalized.includes("M"))
            return 5000;
        return 0;
    }
    async validateCart(dto) {
        let subtotal = 0;
        let isValid = true;
        const validatedItems = [];
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
            let toppingsPrice = 0;
            const normalizedToppings = [];
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
        let discount = 0;
        let couponInfo = null;
        if (dto.couponCode) {
            try {
                const couponResult = await this.applyCoupon({
                    code: dto.couponCode,
                    subtotal,
                });
                discount = couponResult.discount;
                couponInfo = couponResult;
            }
            catch (err) {
                couponInfo = {
                    code: dto.couponCode,
                    valid: false,
                    message: err?.message || "Mã giảm giá không hợp lệ",
                };
            }
        }
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
    async applyCoupon(dto) {
        const code = dto.code.trim().toUpperCase();
        const now = new Date();
        const promo = await this.prisma.promotion.findUnique({
            where: { code },
        });
        if (!promo || !promo.isActive) {
            throw new common_1.BadRequestException("Mã giảm giá không tồn tại hoặc đã khóa ");
        }
        if (now < promo.startsAt || now > promo.endsAt) {
            throw new common_1.BadRequestException("Mã giảm giá chưa đến hạn hoặc đã hết hạn");
        }
        if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
            throw new common_1.BadRequestException("Mã giảm giá đã hết lượt sử dụng");
        }
        if (dto.subtotal < promo.minOrder) {
            throw new common_1.BadRequestException(`Đơn hàng tối thiểu phải từ ${promo.minOrder.toLocaleString("vi-VN")}đ để dùng mã này`);
        }
        let discount = 0;
        if (promo.type === client_1.DiscountType.PERCENT) {
            discount = Math.round((dto.subtotal * promo.value) / 100);
            if (promo.maxDiscount !== null && discount > promo.maxDiscount) {
                discount = promo.maxDiscount;
            }
        }
        else {
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
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map