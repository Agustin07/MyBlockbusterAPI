import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UserDto, AuthedUserDto } from './users/dto/user.dto';
import { User } from './users/user.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Role } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserDto) {
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENT')
  @Get('pineapple')
  pineapple(@User() user: AuthedUserDto): string {
    return 'I am a 🍍 ';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
