import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  payment_method_name: string;

  @IsString()
  @IsNotEmpty()
  payment_method_norek: string;
  payment_method_image: string;
}
