import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import UsersService from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    console.log(user);
    if (!user)
      throw new UnauthorizedException(
        `User with email: '${email}' does not exist`,
      );
    if (user.comparePassword(pass)) {
      return user;
    }
    return null;
  }

  async login(user: UserDto) {
    const payload = { id: user.id, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
