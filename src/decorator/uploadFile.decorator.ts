import {
  UnsupportedMediaTypeException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function FileUpload(fieldName: string, destFolder: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        fileFilter(req, file, callback) {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(
              new UnsupportedMediaTypeException('File is not an image'),
              false,
            );
          }

          callback(null, true);
        },
        limits: { fileSize: 2000000 },
        storage: diskStorage({
          destination: `./upload/${destFolder}`,
          filename(req, file, callback) {
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
            callback(
              null,
              uniqueSuffix + '.' + file.originalname.split('.').pop(),
            );
          },
        }),
      }),
    ),
  );
}
