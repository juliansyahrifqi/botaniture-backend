import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/sequelize';
import { service } from 'models';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(service) private serviceModel: typeof service) {}

  async createService(createServiceDto: CreateServiceDto): Promise<void> {
    await this.serviceModel.create(createServiceDto);
  }

  async getAllService(): Promise<service[]> {
    return await this.serviceModel.findAll();
  }

  async getServiceById(id: number): Promise<service> {
    return await this.serviceModel.findOne({ where: { id } });
  }

  async updateService(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<void> {
    await this.serviceModel.update(updateServiceDto, { where: { id } });
  }

  async deleteService(id: number): Promise<void> {
    await this.serviceModel.destroy({ where: { id } });
  }
}
