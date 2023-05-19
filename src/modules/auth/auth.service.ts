import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.user({ email });

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.name, sub: user.id };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signUp(userDto: User): Promise<any> {
    const user = await this.userService.createUser(userDto);

    return { user };
  }
}
