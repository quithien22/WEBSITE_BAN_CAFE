import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách sản phẩm có bộ lọc (danh mục, từ khóa, nổi bật, trạng thái) và phân trang
   */
  async findAll(query: QueryProductDto) {
    const {
      category,
      search,
      isFeatured,
      isActive,
      page = 1,
      limit = 20,
    } = query;

    const where: Prisma.ProductWhereInput = {};

    // Lọc theo danh mục (bỏ qua nếu là 'Tất cả')
    if (category && category !== 'Tất cả') {
      where.category = category;
    }

    // Tìm kiếm theo tên sản phẩm (không phân biệt chữ hoa/thường)
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Lọc theo món nổi bật
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Lọc theo trạng thái kinh doanh (mặc định chỉ lấy món đang bán)
    if (isActive !== undefined) {
      where.isActive = isActive;
    } else {
      where.isActive = true;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy danh sách toàn bộ các nhóm/danh mục sản phẩm hiện có
   */
  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map((c) => c.category);
  }

  /**
   * Lấy chi tiết một sản phẩm theo ID
   */
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
    }

    return product;
  }

  /**
   * Thêm mới sản phẩm (Dành cho STAFF / Quản lý)
   */
  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description ?? '',
        category: dto.category,
        price: dto.price,
        imageUrl: dto.imageUrl,
        stock: dto.stock,
        isFeatured: dto.isFeatured ?? false,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Cập nhật thông tin sản phẩm
   */
  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Xóa hoặc ngừng bán sản phẩm (Soft delete)
   */
  async remove(id: number) {
    await this.findOne(id);

    // Đánh dấu ngừng bán để bảo toàn toàn vẹn dữ liệu đơn hàng đã tạo trước đó
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Kiểm tra và trừ tồn kho bằng Optimistic Locking (dùng cho OrdersService khi tạo đơn hàng)
   */
  async deductStock(
    items: { productId: number; qty: number }[],
    tx?: Prisma.TransactionClient,
  ) {
    const prismaClient = tx || this.prisma;

    for (const item of items) {
      const product = await prismaClient.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw new BadRequestException(
          `Sản phẩm "${product?.name ?? item.productId}" không tồn tại hoặc đã ngừng bán`,
        );
      }

      if (product.stock < item.qty) {
        throw new BadRequestException(
          `Sản phẩm "${product.name}" không đủ số lượng trong kho (còn ${product.stock}, yêu cầu ${item.qty})`,
        );
      }

      // Cập nhật tồn kho với optimistic lock dựa trên version
      const result = await prismaClient.product.updateMany({
        where: {
          id: product.id,
          version: product.version,
        },
        data: {
          stock: { decrement: item.qty },
          version: { increment: 1 },
        },
      });

      if (result.count === 0) {
        throw new ConflictException(
          `Sản phẩm "${product.name}" vừa được cập nhật bởi đơn khác. Vui lòng thử lại.`,
        );
      }
    }
  }
}
