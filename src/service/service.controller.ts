import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FileUpload } from 'src/decorator/uploadFile.decorator';
import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import * as path from 'path';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('create')
  @FileUpload('service_icon', 'service')
  async create(
    @Req() req: Request,
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|svg|)$/ }),
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
        '/upload/service/' +
        file.filename;

      await this.serviceService.createService({
        ...createServiceDto,
        service_icon: finalImageUrl,
      });

      return { status: HttpStatus.OK, message: 'Product successfully created' };
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
      const service = await this.serviceService.getAllService();

      if (service.length <= 0) {
        return { status: HttpStatus.NOT_FOUND, message: 'Service not found' };
      }

      return service;
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const service = await this.serviceService.getServiceById(+id);

      if (service === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'Service not found' };
      }

      return service;
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }

  @Put('edit/:id')
  @FileUpload('service_icon', 'service')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|svg|)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const service = await this.serviceService.getServiceById(+id);

      if (service === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Category Product Not Found',
        };
      }

      const oldImage = service.service_icon;

      console.log(oldImage);

      let finalImageUrl: string;

      if (file) {
        if (existsSync(`upload/service/${path.parse(oldImage).base}`)) {
          unlink('upload/service/' + path.parse(oldImage).base, (err) => {
            if (err) throw err;
          });
        }

        finalImageUrl =
          req.protocol +
          '://' +
          req.get('host') +
          '/product/image/' +
          req.file.filename;
      }

      const imageUpload = file ? finalImageUrl : oldImage;

      await this.serviceService.updateService(+id, {
        ...updateServiceDto,
        service_icon: imageUpload,
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
      const service = await this.serviceService.getServiceById(+id);

      if (service === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'Service not found' };
      }

      if (
        existsSync(`upload/service/${path.parse(service.service_icon).base}`)
      ) {
        unlink(
          'upload/service/' + path.parse(service.service_icon).base,
          (err) => {
            if (err) throw err;
          },
        );
      }

      await this.serviceService.deleteService(+id);

      return { status: HttpStatus.OK, message: 'Service success deleted' };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: e,
      };
    }
  }
}
