import { CartService } from "./cart.service";
import { ValidateCartDto, ApplyCouponDto } from "./dto/cart.dto";
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    validateCart(dto: ValidateCartDto): Promise<{
        isValid: boolean;
        items: any[];
        subtotal: number;
        shippingFee: number;
        discount: number;
        total: number;
        coupon: any;
    }>;
    applyCoupon(dto: ApplyCouponDto): Promise<{
        valid: boolean;
        code: string;
        title: string;
        discount: number;
        subtotal: number;
        total: number;
        message: string;
    }>;
    getPromotions(): Promise<{
        id: number;
        description: string;
        isActive: boolean;
        code: string;
        title: string;
        type: import(".prisma/client").$Enums.DiscountType;
        value: number;
        minOrder: number;
        maxDiscount: number | null;
        startsAt: Date;
        endsAt: Date;
        usageLimit: number | null;
        usedCount: number;
    }[]>;
}
