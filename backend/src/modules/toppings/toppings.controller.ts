import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ToppingsService } from './toppings.service';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('toppings')
export class ToppingsController {
  constructor(private readonly toppingsService: ToppingsService) {}

  /**
   * GET /toppings
   * Lấy danh sách toàn bộ topping đang phục vụ (dành cho modal chọn món trên Thực đơn)
   * Public: Khách hàng và nhân viên đều truy cập được
   */
  @Public()
  @Get()
  async findAll() {
    return this.toppingsService.findAll();
  }

  /**
   * GET /toppings/:id
   * Xem chi tiết một loại topping theo ID
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toppingsService.findOne(id);
  }

  /**
   * POST /toppings
   * Thêm loại topping mới vào menu
   * Phân quyền: Chỉ tài khoản STAFF mới có quyền tạo
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @Post()
  async create(@Body() dto: CreateToppingDto) {
    return this.toppingsService.create(dto);
  }

  /**
   * PATCH /toppings/:id
   * Cập nhật thông tin/giá của topping
   * Phân quyền: Chỉ tài khoản STAFF mới có quyền cập nhật
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateToppingDto,
  ) {
    return this.toppingsService.update(id, dto);
  }

  /**
   * DELETE /toppings/:id
   * Ngừng phục vụ topping (Soft delete)
   * Phân quyền: Chỉ tài khoản STAFF mới có quyền thao tác
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.toppingsService.remove(id);
  }
}
