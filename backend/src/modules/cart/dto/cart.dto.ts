// backend/src/modules/cart/dto/cart.dto.ts
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CartItemInputDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  qty: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  sugar?: string;

  @IsOptional()
  @IsString()
  ice?: string;

  @IsOptional()
  toppings?: any[];
}

export class ValidateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInputDto)
  items: CartItemInputDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class ApplyCouponDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNumber()
  @Min(0)
  subtotal: number;
}