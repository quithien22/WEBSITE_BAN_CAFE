import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Danh mục phải là chuỗi ký tự' })
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Giá sản phẩm phải là số nguyên' })
  @Min(0, { message: 'Giá sản phẩm không được nhỏ hơn 0' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'Đường dẫn ảnh phải là chuỗi ký tự' })
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng tồn kho phải là số nguyên' })
  @Min(0, { message: 'Số lượng tồn kho không được nhỏ hơn 0' })
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái nổi bật phải là boolean' })
  isFeatured?: boolean;
}
