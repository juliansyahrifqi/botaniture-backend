import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  product_slug: string;

  @IsString()
  @IsNotEmpty()
  product_description: string;

  @IsNotEmpty()
  product_price: string;

  @IsNotEmpty()
  product_discount: string;
  product_image: string;

  @IsNotEmpty()
  category_id: number;
}
