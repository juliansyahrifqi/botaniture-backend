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
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { FileUpload } from 'src/decorator/uploadFile.decorator';
import { Request } from 'express';
import slugify from 'slugify';
import { unlink } from 'fs';
import * as path from 'path';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post('create')
  @FileUpload('category_image', 'category')
  async create(
    @Req() req: Request,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
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
        '/upload/category/' +
        file.filename;

      await this.productCategoryService.createProductCategory({
        ...createProductCategoryDto,
        category_slug: slugify(createProductCategoryDto.category_name),
        category_image: finalImageUrl,
      });

      return { status: HttpStatus.OK, message: 'Product successfully created' };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const categoryProduct =
        await this.productCategoryService.findAllProductCategory();

      if (categoryProduct.length === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };
      }

      return categoryProduct;
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const categoryProduct =
        await this.productCategoryService.findProductCategoryById(+id);

      if (categoryProduct === null)
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };

      return categoryProduct;
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }

  @Put('edit/:id')
  @FileUpload('category_image', 'category')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
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
      const productCategory =
        await this.productCategoryService.findProductCategoryById(+id);

      if (productCategory === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };
      }

      const oldImage = productCategory.category_image;

      let finalImageUrl: string;

      if (file) {
        unlink('upload/category/' + path.parse(oldImage).base, (err) => {
          if (err) throw err;
        });

        finalImageUrl =
          req.protocol +
          '://' +
          req.get('host') +
          '/product/image/' +
          req.file.filename;
      }

      const imageUpload = file ? finalImageUrl : oldImage;

      await this.productCategoryService.updateProductCategory(+id, {
        ...updateProductCategoryDto,
        category_slug: slugify(updateProductCategoryDto.category_name),
        category_image: imageUpload,
      });

      return {
        status: HttpStatus.OK,
        message: 'Category Product Successfully Update',
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const categoryProduct =
        await this.productCategoryService.findProductCategoryById(+id);

      if (categoryProduct === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };
      }

      unlink(
        'upload/category/' + path.parse(categoryProduct.category_image).base,
        (err) => {
          if (err) throw err;
        },
      );

      await this.productCategoryService.deleteProductCategory(+id);

      return {
        status: HttpStatus.OK,
        message: 'Category Product Successfully Update',
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }
}
