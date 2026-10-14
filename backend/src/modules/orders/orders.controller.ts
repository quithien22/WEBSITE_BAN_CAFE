// src/modules/orders/orders.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    // user.id từ JWT tương ứng với kiểu Int của model User trong Prisma[cite: 5]
    return this.ordersService.createOrder(user.id, dto);
  }

  @Get(":id")
  async getOrderDetail(@Param("id", ParseIntPipe) id: number) {
    return this.ordersService.getOrderDetail(id);
  }

  // Endpoint nhận kết quả trả về khi thanh toán thành công hoặc thất bại từ cổng thanh toán
  @Post(":id/payment-callback")
  async paymentCallback(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: "SUCCESS" | "FAILED",
    @Body("transactionId") transactionId?: string,
    @Body("failureReason") failureReason?: string,
  ) {
    return this.ordersService.handlePaymentCallback(
      id,
      status,
      transactionId,
      failureReason,
    );
  }
}
