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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUpload } from 'src/decorator/uploadFile.decorator';
import { Request } from 'express';
import slugify from 'slugify';
import { existsSync, unlink } from 'fs';
import * as path from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @FileUpload('product_image', 'product')
  async create(
    @Req() req: Request,
    @Body() createProductDto: CreateProductDto,
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
        '/upload/product/' +
        file.filename;

      await this.productService.createProduct({
        ...createProductDto,
        product_slug: slugify(createProductDto.product_name),
        product_image: finalImageUrl,
      });

      return { status: HttpStatus.OK, message: 'Product Success Added' };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Get()
  async findAll(): Promise<any> {
    try {
      const product = await this.productService.getAllProduct();

      if (product.length === 0) {
        return { status: HttpStatus.NOT_FOUND, message: 'Product Not Found' };
      }

      return { status: HttpStatus.OK, message: 'Product Found', data: product };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productService.getProductById(+id);

      if (product === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'Product not found' };
      }

      return { status: HttpStatus.OK, message: 'Product Found', data: product };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Put('edit/:id')
  @FileUpload('product_image', 'product')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
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
      const product = await this.productService.getProductById(+id);

      if (product === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Product Not Found',
        };
      }

      const oldImage = product.product_image;

      let finalImageUrl: string;

      if (file) {
        if (existsSync(`upload/product/${path.parse(oldImage).base}`)) {
          unlink('upload/product/' + path.parse(oldImage).base, (err) => {
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

      await this.productService.updateProduct(+id, {
        ...updateProductDto,
        product_slug: slugify(updateProductDto.product_name),
        product_image: imageUpload,
      });

      return {
        status: HttpStatus.OK,
        message: 'Product Successfully Update',
      };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const product = await this.productService.getProductById(+id);

      if (product === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Product Not Found',
        };
      }

      if (
        existsSync(`upload/product/${path.parse(product.product_image).base}`)
      ) {
        unlink(
          'upload/product/' + path.parse(product.product_image).base,
          (err) => {
            if (err) throw err;
          },
        );
      }

      await this.productService.deleteProduct(+id);

      return {
        status: HttpStatus.OK,
        message: 'Product Successfully Update',
      };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }
}
