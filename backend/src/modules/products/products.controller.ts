import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products
   * Lấy danh sách sản phẩm (có lọc category, search, phân trang)
   * Public: Khách hàng và nhân viên đều xem được
   */
  @Public()
  @Get()
  async findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  /**
   * GET /products/categories
   * Lấy danh sách toàn bộ các nhóm danh mục hiện có trong thực đơn
   * Chú ý: Đặt trước route :id để tránh bị parse nhầm thành id = "categories"
   */
  @Public()
  @Get('categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  /**
   * GET /products/:id
   * Xem chi tiết một sản phẩm theo ID
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * POST /products
   * Thêm sản phẩm mới vào thực đơn
   * Phân quyền: Chỉ tài khoản STAFF mới có quyền tạo
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  /**
   * PATCH /products/:id
   * Cập nhật thông tin/giá/tồn kho của một sản phẩm
   * Phân quyền: Chỉ tài khoản STAFF mới có quyền cập nhật
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  /**
   * DELETE /products/:id
   * Ngừng bán sản phẩm (Soft delete)
   * Phân quyền: Chỉ tài khoản STAFF mới có quyền thao tác
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
