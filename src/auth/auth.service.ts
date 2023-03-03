import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByUsername(username);

    const isValid = await bcrypt.compare(pass, user.user_password);

    if (user && isValid) {
      const { user_password, ...result } = user;
      return result;
    }

    return null;
  }
}
