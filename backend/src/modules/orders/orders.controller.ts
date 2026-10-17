import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

// JwtStrategy của BrewLite kiểm tra Bearer token và gán req.user.id.
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.orders.createOrder(req.user.id, dto);
  }

  @Get()
  list(@Req() req: any) {
    return this.orders.listMyOrders(req.user.id);
  }

  @Get(':id')
  detail(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.orders.getOrderDetail(req.user.id, id);
  }

  @Post(':id/cancel')
  cancel(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.orders.cancelOrder(req.user.id, id);
  }

  // Chỉ có trong môi trường DEVELOPMENT với ALLOW_DEMO_PAYMENTS=true.
  // Không cung cấp endpoint giả mạo callback thanh toán công khai.
  @Post(':id/demo-pay')
  demoPay(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.orders.demoPay(req.user.id, id);
  }
}
