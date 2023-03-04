import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product_category.service';
import { ProductCategoryController } from './product_category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { product_category } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([product_category])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}
