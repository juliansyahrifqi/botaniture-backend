import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrUpdateQuoteDto {
  @IsString()
  @IsNotEmpty()
  quote_description: string;

  @IsString()
  @IsNotEmpty()
  quote_author: string;
  quote_image: string;
}
