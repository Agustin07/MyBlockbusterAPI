import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  poster: string;

  @IsNotEmpty()
  @IsNumberString()
  stock: number;

  @IsNotEmpty()
  @IsUrl()
  trailer: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}

export class UpdateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  poster: string;

  @IsNotEmpty()
  @IsNumberString()
  stock: number;

  @IsNotEmpty()
  @IsUrl()
  trailer: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
