import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateToppingDto {
  @IsOptional()
  @IsString({ message: 'Tên topping phải là chuỗi ký tự' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Giá topping phải là số nguyên' })
  @Min(0, { message: 'Giá topping không được nhỏ hơn 0' })
  price?: number;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;
}

