import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  blog_title: string;

  @IsString()
  @IsNotEmpty()
  blog_body: string;

  @IsNotEmpty()
  user_id: number;

  blog_image: string;
  blog_slug: string;
  date_created: string;
}
