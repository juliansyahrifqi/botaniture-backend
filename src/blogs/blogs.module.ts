import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { blogs } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([blogs])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
