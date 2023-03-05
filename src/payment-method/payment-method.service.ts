import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { InjectModel } from '@nestjs/sequelize';
import { payment_method } from 'models';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectModel(payment_method)
    private paymentMethodModel: typeof payment_method,
  ) {}

  async createPaymentMethod(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<void> {
    await this.paymentMethodModel.create(createPaymentMethodDto);
  }

  async getAllPaymentMethod(): Promise<payment_method[]> {
    return await this.paymentMethodModel.findAll();
  }

  async getPaymentMehodById(id: number): Promise<payment_method> {
    return await this.paymentMethodModel.findOne({ where: { id } });
  }

  async updatePaymentMethod(
    id: number,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<void> {
    await this.paymentMethodModel.update(updatePaymentMethodDto, {
      where: { id },
    });
  }

  async deletePaymenMethod(id: number): Promise<void> {
    await this.paymentMethodModel.destroy({
      where: { id },
    });
  }
}
