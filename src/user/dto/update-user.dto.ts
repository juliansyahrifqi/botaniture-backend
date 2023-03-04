import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { IsEmailExists } from 'src/validation/EmailExists';
import { IsUsernameExists } from 'src/validation/UsernameExists';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  user_firstname: string;

  @IsString()
  @IsNotEmpty()
  user_lastname: string;

  @IsEmailExists('user_email')
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @IsUsernameExists('user_username')
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  user_username: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 15)
  user_phone_number: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  user_password: string;

  @IsNotEmpty()
  @Length(1, 1)
  user_role: number;
}
