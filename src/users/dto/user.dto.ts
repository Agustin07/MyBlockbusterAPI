import {
  IsString,
  Length,
  IsNotEmpty,
  IsDefined,
  IsEmail,
} from 'class-validator';
import { Role } from '../entities/role.entity';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  password: string;
}

export class UpdateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class UserDto {
  id: number;
  email: string;
  username: string;
  role: Role;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class AuthedUserDto {
  id: number;
  role: string;

  constructor(partial: Partial<AuthedUserDto>) {
    Object.assign(this, partial);
  }
}
