import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/sequelize';
import { blogs } from 'models';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(blogs) private blogsModel: typeof blogs) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<void> {
    await this.blogsModel.create(createBlogDto);
  }

  async getAllBlogs(): Promise<blogs[]> {
    return await this.blogsModel.findAll();
  }

  async getBlogById(id: number): Promise<blogs> {
    return await this.blogsModel.findOne({ where: { id } });
  }

  async updateBlog(id: number, updateBlogDto: UpdateBlogDto): Promise<void> {
    await this.blogsModel.update(updateBlogDto, { where: { id } });
  }

  async deleteBlog(id: number): Promise<void> {
    await this.blogsModel.destroy({ where: { id } });
  }
}
