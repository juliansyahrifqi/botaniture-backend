import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { service } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([service])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
