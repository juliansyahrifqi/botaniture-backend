import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { product_category } from 'models';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(product_category)
    private productCategoryModel: typeof product_category,
  ) {}

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<void> {
    await this.productCategoryModel.create(createProductCategoryDto);
  }

  async findAllProductCategory(): Promise<product_category[]> {
    return this.productCategoryModel.findAll();
  }

  async findProductCategoryById(id: number): Promise<product_category> {
    return this.productCategoryModel.findOne({ where: { id } });
  }

  async findProductCategoryByName(name: string): Promise<product_category> {
    return this.productCategoryModel.findOne({
      where: { category_name: name },
    });
  }

  async updateProductCategory(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<void> {
    await this.productCategoryModel.update(updateProductCategoryDto, {
      where: { id },
    });
  }

  async deleteProductCategory(id: number): Promise<void> {
    await this.productCategoryModel.destroy({ where: { id } });
  }
}
