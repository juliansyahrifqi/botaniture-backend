import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { payment_method } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([payment_method])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
