// backend/src/modules/cart/cart.controller.ts
import { Controller, Post, Get, Body } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ValidateCartDto, ApplyCouponDto } from "./dto/cart.dto";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("validate")
  async validateCart(@Body() dto: ValidateCartDto) {
    return this.cartService.validateCart(dto);
  }

  @Post("apply-coupon")
  async applyCoupon(@Body() dto: ApplyCouponDto) {
    return this.cartService.applyCoupon(dto);
  }

  @Get("promotions")
  async getPromotions() {
    return this.cartService.getAvailablePromotions();
  }
}