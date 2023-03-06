import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { product } from 'models';

@Injectable()
export class ProductService {
  constructor(@InjectModel(product) private productModel: typeof product) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    await this.productModel.create(createProductDto);
  }

  async getAllProduct(): Promise<product[]> {
    return await this.productModel.findAll();
  }

  async getProductById(id: number): Promise<product> {
    return await this.productModel.findOne({ where: { id } });
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    await this.productModel.update(updateProductDto, { where: { id } });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }
}
