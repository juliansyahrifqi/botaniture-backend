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
  findAll() {
    return this.userService.findAllUser();
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(+id);
  }

  @Put('update/:id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete('delete/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
