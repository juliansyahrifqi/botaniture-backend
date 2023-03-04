import {
  Controller,
  Get,
  Body,
  Param,
  HttpStatus,
  Put,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateOrUpdateQuoteDto } from './dto/create-update-quote.dto';
import { FileUpload } from 'src/decorator/uploadFile.decorator';
import { Request } from 'express';
import { existsSync, unlink } from 'fs';
import * as path from 'path';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get()
  async findAll() {
    try {
      const quote = await this.quoteService.getQuote();

      if (quote === null) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Quote Not Found',
        };
      }

      return quote;
    } catch (e) {
      return e;
    }
  }

  @Put('edit/:id')
  @FileUpload('quote_image', 'quote')
  async update(
    @Req() req: Request,
    @Param('id') id = 1,
    @Body() createOrUpdateQuoteDto: CreateOrUpdateQuoteDto,
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
    const quote = await this.quoteService.getQuote();

    let oldImage: string;
    if (quote !== null) {
      oldImage = quote.quote_image;
    } else {
      oldImage = '';
    }

    let finalImageUrl: string;

    if (file) {
      if (
        existsSync(`upload/quote/${path.parse(oldImage).base}`) &&
        oldImage !== ''
      ) {
        unlink('upload/quote/' + path.parse(oldImage).base, (err) => {
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

    await this.quoteService.update(+id, {
      ...createOrUpdateQuoteDto,
      quote_image: imageUpload,
    });

    return {
      status: HttpStatus.OK,
      message: 'Category Product Successfully Update',
    };
  }
}
