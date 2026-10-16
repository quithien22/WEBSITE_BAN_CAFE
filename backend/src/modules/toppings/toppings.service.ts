import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';

@Injectable()
export class ToppingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách toàn bộ topping
   * @param onlyActive Mặc định là true (chỉ lấy topping đang mở bán cho khách)
   */
  async findAll(onlyActive: boolean = true) {
    return this.prisma.topping.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { price: 'asc' },
    });
  }

  /**
   * Lấy chi tiết một topping theo ID
   */
  async findOne(id: number) {
    const topping = await this.prisma.topping.findUnique({
      where: { id },
    });

    if (!topping) {
      throw new NotFoundException(`Không tìm thấy topping với ID ${id}`);
    }

    return topping;
  }

  /**
   * Thêm mới topping (kiểm tra chống trùng tên)
   */
  async create(dto: CreateToppingDto) {
    const existed = await this.prisma.topping.findUnique({
      where: { name: dto.name },
    });

    if (existed) {
      throw new ConflictException(`Topping với tên "${dto.name}" đã tồn tại`);
    }

    return this.prisma.topping.create({
      data: {
        name: dto.name,
        price: dto.price,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Cập nhật thông tin topping
   */
  async update(id: number, dto: UpdateToppingDto) {
    await this.findOne(id);

    if (dto.name) {
      const existed = await this.prisma.topping.findUnique({
        where: { name: dto.name },
      });

      if (existed && existed.id !== id) {
        throw new ConflictException(
          `Topping với tên "${dto.name}" đã được sử dụng bởi topping khác`,
        );
      }
    }

    return this.prisma.topping.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Ngừng phục vụ topping (Soft delete)
   */
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.topping.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Xác thực và tính lại giá chuẩn từ DB cho danh sách topping trong đơn hàng
   * Dùng cho OrdersService khi khách tạo đơn hàng để chống gian lận giá từ frontend
   */
  async validateAndCalculateToppings(toppingIds: number[]): Promise<{
    validToppings: { id: number; name: string; price: number }[];
    toppingsTotal: number;
  }> {
    if (!toppingIds || toppingIds.length === 0) {
      return { validToppings: [], toppingsTotal: 0 };
    }

    // Loại bỏ ID trùng lặp nếu khách gửi trùng
    const uniqueIds = Array.from(new Set(toppingIds));

    const toppings = await this.prisma.topping.findMany({
      where: {
        id: { in: uniqueIds },
        isActive: true,
      },
    });

    if (toppings.length !== uniqueIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều topping được chọn không tồn tại hoặc đã ngừng phục vụ',
      );
    }

    const validToppings = toppings.map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
    }));

    const toppingsTotal = validToppings.reduce(
      (sum, item) => sum + item.price,
      0,
    );

    return { validToppings, toppingsTotal };
  }
}

