import { Module } from '@nestjs/common';
import UsersService from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Rental } from '../movies/entities/rental.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Rental])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
