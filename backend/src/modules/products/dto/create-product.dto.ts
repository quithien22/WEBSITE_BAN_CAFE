import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsString({ message: 'Danh mục phải là chuỗi ký tự' })
  category: string;

  @Type(() => Number)
  @IsInt({ message: 'Giá sản phẩm phải là số nguyên' })
  @Min(0, { message: 'Giá sản phẩm không được nhỏ hơn 0' })
  price: number;

  @IsNotEmpty({ message: 'Đường dẫn ảnh không được để trống' })
  @IsString({ message: 'Đường dẫn ảnh phải là chuỗi ký tự' })
  imageUrl: string;

  @Type(() => Number)
  @IsInt({ message: 'Số lượng tồn kho phải là số nguyên' })
  @Min(0, { message: 'Số lượng tồn kho không được nhỏ hơn 0' })
  stock: number;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái nổi bật phải là boolean' })
  isFeatured?: boolean;
}
