import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Put,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileUpload } from 'src/decorator/uploadFile.decorator';
import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import * as path from 'path';
import slugify from 'slugify';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post('create')
  @FileUpload('blog_image', 'blogs')
  async create(
    @Req() req: Request,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const finalImageUrl =
        req.protocol +
        '://' +
        req.get('host') +
        '/upload/blog/' +
        file.filename;

      console.log(finalImageUrl);
      await this.blogsService.createBlog({
        ...createBlogDto,
        blog_slug: slugify(createBlogDto.blog_title),
        blog_image: finalImageUrl,
        date_created: new Date().toDateString(),
      });

      return {
        status: HttpStatus.OK,
        message: 'Payment Method successfully created',
      };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Get()
  async findAll(): Promise<any> {
    try {
      const blogs = await this.blogsService.getAllBlogs();

      if (blogs.length <= 0) {
        return { status: HttpStatus.NOT_FOUND, message: 'Blogs Not Found' };
      }

      return { status: HttpStatus.OK, message: 'Blogs found', data: blogs };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const blog = await this.blogsService.getBlogById(+id);

      if (blog === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'Blogs Not Found' };
      }

      return { status: HttpStatus.OK, message: 'Blog found', data: blog };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Put('edit/:id')
  @FileUpload('blog_image', 'blog')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const blog = await this.blogsService.getBlogById(+id);

      if (blog === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'Blogs Not Found' };
      }

      const oldImage = blog.blog_image;

      let finalImageUrl: string;

      if (file) {
        if (existsSync(`upload/blog/${path.parse(oldImage).base}`)) {
          unlink('upload/blog/' + path.parse(oldImage).base, (err) => {
            if (err) throw err;
          });
        }

        finalImageUrl =
          req.protocol +
          '://' +
          req.get('host') +
          '/product/image/' +
          req.file.filename;
      }

      const imageUpload = file ? finalImageUrl : oldImage;

      await this.blogsService.updateBlog(+id, {
        ...updateBlogDto,
        blog_slug: slugify(updateBlogDto.blog_title),
        blog_image: imageUpload,
        date_created: new Date().toDateString(),
      });

      return {
        status: HttpStatus.OK,
        message: 'Blog Successfully Update',
      };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const blog = await this.blogsService.getBlogById(+id);

      if (blog === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'Blogs Not Found' };
      }

      if (existsSync(`upload/blog/${path.parse(blog.blog_image).base}`)) {
        unlink('upload/blog/' + path.parse(blog.blog_image).base, (err) => {
          if (err) throw err;
        });
      }

      await this.blogsService.deleteBlog(+id);

      return { status: HttpStatus.OK, message: 'Blog Success Deleted' };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }
}
