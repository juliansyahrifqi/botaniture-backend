import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Put,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { FileUpload } from 'src/decorator/uploadFile.decorator';
import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import * as path from 'path';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post('create')
  @FileUpload('payment_method_image', 'payment-method')
  async create(
    @Req() req: Request,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const finalImageUrl =
        req.protocol +
        '://' +
        req.get('host') +
        '/upload/category/' +
        file.filename;

      await this.paymentMethodService.createPaymentMethod({
        ...createPaymentMethodDto,
        payment_method_image: finalImageUrl,
      });

      return {
        status: HttpStatus.OK,
        message: 'Payment Method successfully created',
      };
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
      const payments = await this.paymentMethodService.getAllPaymentMethod();

      if (payments.length === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Payment Method not found',
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Payment Method Found',
        data: payments,
      };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentMethodService.getPaymentMehodById(+id);

      if (payment === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Payment Method not found',
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Payment Method Found',
        data: payment,
      };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Put('edit/:id')
  @FileUpload('payment_method_image', 'payment-method')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const paymentMethod = await this.paymentMethodService.getPaymentMehodById(
        +id,
      );

      if (paymentMethod === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };
      }

      const oldImage = paymentMethod.payment_method_image;

      let finalImageUrl: string;

      if (file) {
        if (existsSync(`upload/payment-method/${path.parse(oldImage).base}`)) {
          unlink(
            'upload/payment-method/' + path.parse(oldImage).base,
            (err) => {
              if (err) throw err;
            },
          );
        }

        finalImageUrl =
          req.protocol +
          '://' +
          req.get('host') +
          '/product/image/' +
          req.file.filename;
      }

      const imageUpload = file ? finalImageUrl : oldImage;

      await this.paymentMethodService.updatePaymentMethod(+id, {
        ...updatePaymentMethodDto,
        payment_method_image: imageUpload,
      });

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

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const payment = await this.paymentMethodService.getPaymentMehodById(+id);

      if (payment === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Payment Method not found',
        };
      }

      if (
        existsSync(
          `upload/payment-method/${
            path.parse(payment.payment_method_image).base
          }`,
        )
      ) {
        unlink(
          'upload/payment-method/' +
            path.parse(payment.payment_method_image).base,
          (err) => {
            if (err) throw err;
          },
        );
      }

      return {
        status: HttpStatus.OK,
        message: 'Payment Method Success Deleted',
      };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }
}
