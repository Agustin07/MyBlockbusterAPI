import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Put,
  HttpException,
  HttpStatus,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UserDto,
  UpdateUserDto,
  AuthedUserDto,
} from './dto/user.dto';
import UsersService from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.decorator';
import { Role } from './../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    const savedUser = new UserDto(await this.usersService.createUser(user));
    return savedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUserWithRentalOrThrow(id);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENT')
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @User() user: AuthedUserDto,
  ) {
    if (user.id !== id)
      throw new BadRequestException(
        `You only can modify your own information! Your id is: ${user.id} `,
      );
    const response = await this.usersService.updateUser(id, data);
    return response;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENT')
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthedUserDto,
  ) {
    if (user.id !== id)
      throw new BadRequestException(
        `You only can delete yourself! Your id is: ${user.id} `,
      );
    const response = await this.usersService.deleteUser(id);
    return response;
  }
}
