import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { users } from 'models';

@Injectable()
export class UserService {
  constructor(@InjectModel(users) private usersModel: typeof users) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    await this.usersModel.create(createUserDto);
  }

  async findAllUser(): Promise<users[]> {
    return await this.usersModel.findAll();
  }

  async findUserById(id: number): Promise<users> {
    return await this.usersModel.findOne({ where: { id } });
  }

  async findUserByUsername(username: string): Promise<users> {
    return await this.usersModel.findOne({
      where: { user_username: username },
    });
  }

  async findUserByEmail(email: string): Promise<users> {
    return await this.usersModel.findOne({
      where: { user_email: email },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersModel.update(updateUserDto, {
      where: { id },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersModel.destroy({
      where: { id },
    });
  }
}
