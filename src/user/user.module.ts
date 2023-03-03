import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { users } from 'models';
import { UsernameExistsValidation } from 'src/validation/UsernameExists';
import { EmailExistsValidation } from 'src/validation/EmailExists';

@Module({
  imports: [SequelizeModule.forFeature([users])],
  controllers: [UserController],
  providers: [UserService, UsernameExistsValidation, EmailExistsValidation],
  exports: [UserService],
})
export class UserModule {}
