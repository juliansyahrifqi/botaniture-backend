import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByUsername(username);

    const isValid = await bcrypt.compare(pass, user.user_password);

    if (user && isValid) {
      const { user_password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.user_username, sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
