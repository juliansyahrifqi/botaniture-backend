import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  payment_method_name: string;

  @IsString()
  @IsNotEmpty()
  payment_method_norek: string;
  payment_method_image: string;
}
