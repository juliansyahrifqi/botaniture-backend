import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post('create')
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    try {
      return await this.productCategoryService.createProductCategory(
        createProductCategoryDto,
      );
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

      if (categoryProduct === null) {
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
  async update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    try {
      const productCategory =
        this.productCategoryService.findProductCategoryById(+id);

      if (productCategory === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };
      }

      await this.productCategoryService.updateProductCategory(
        +id,
        updateProductCategoryDto,
      );

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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const categoryProduct =
        this.productCategoryService.findProductCategoryById(+id);

      if (categoryProduct === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };
      }

      this.productCategoryService.deleteProductCategory(+id);

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
