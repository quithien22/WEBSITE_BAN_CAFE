// src/modules/orders/dto/create-order.dto.ts
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethod } from "@prisma/client";

class OrderItemInputDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;

  @IsString()
  size: string;

  @IsString()
  sugar: string;

  @IsString()
  ice: string;

  @IsOptional()
  toppings?: any; // Lưu dạng JSON trong DB
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];

  @IsNotEmpty()
  paymentMethod: PaymentMethod; // WALLET hoặc CARD

  @IsNotEmpty()
  @IsString()
  provider: string; // Tên cổng thanh toán (ví dụ: 'momo', 'vnpay')[cite: 5]

  @IsOptional()
  @IsString()
  couponCode?: string; // Ví dụ: 'CHAO10'[cite: 5]

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  pointsUsed?: number;
}
