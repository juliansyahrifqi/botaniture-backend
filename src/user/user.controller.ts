import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import Role from 'src/auth/role/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(createUserDto.user_password, salt);

      await this.userService.createUser({
        ...createUserDto,
        user_password: hashPass,
      });

      return { status: HttpStatus.OK, message: 'User success created' };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll() {
    try {
      const user = this.userService.findAllUser();

      if (user === null)
        return { status: HttpStatus.NOT_FOUND, message: 'User not found' };

      return user;
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findUserById(+id);

      if (user === null)
        return { status: HttpStatus.NOT_FOUND, message: 'User not found' };

      return user;
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Put('update/:id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.findUserById(+id);

      if (user === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'User not found' };
      }

      const salt = await bcrypt.genSalt(10);
      const passHash = await bcrypt.hash(updateUserDto.user_password, salt);

      await this.userService.updateUser(+id, {
        ...updateUserDto,
        user_password: passHash,
      });

      return { status: HttpStatus.ACCEPTED, message: 'User success updated' };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }

  @Delete('delete/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(@Param('id') id: string) {
    try {
      const user = await this.userService.findUserById(+id);

      if (user === null) {
        return { status: HttpStatus.NOT_FOUND, message: 'User not found' };
      }

      await this.userService.deleteUser(+id);

      return { status: HttpStatus.OK, message: 'User sucessfully deleted' };
    } catch (e) {
      return { status: HttpStatus.BAD_REQUEST, message: e };
    }
  }
}
