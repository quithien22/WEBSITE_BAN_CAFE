import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class OrderItemInputDto {
  @Type(() => Number) @IsInt() @Min(1) productId!: number;
  @Type(() => Number) @IsInt() @Min(1) @Max(100) qty!: number;
  @IsString() size!: string;
  @IsString() sugar!: string;
  @IsString() ice!: string;
  @IsOptional() @IsArray() toppings?: unknown[];
}

export class CreateOrderDto {
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];

  @IsEnum(PaymentMethod) paymentMethod!: PaymentMethod;
  @IsIn(['momo', 'vnpay', 'card']) provider!: 'momo' | 'vnpay' | 'card';
  @IsOptional() @IsString() couponCode?: string;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) pointsUsed?: number;
}
