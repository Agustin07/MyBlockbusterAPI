import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, CreateTagDto } from './dto/movie.dto';
import { User } from '../users/user.decorator';
import { AuthedUserDto } from '../users/dto/user.dto';
import { Role } from './../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies() {
    const movies = this.moviesService.getMovies();
    return movies;
  }

  @Get(':id')
  getMovie(@Param('id', ParseIntPipe) id: number) {
    const movie = this.moviesService.findOneByIdOrThrow(id);
    return movie;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post()
  createMovie(@Body() movie: CreateMovieDto) {
    const createdMovie = this.moviesService.createOne(movie);
    return createdMovie;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Put(':id')
  updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() movie: CreateMovieDto,
  ) {
    const updatedMovie = this.moviesService.updateOne(id, movie);
    return updatedMovie;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.removeOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post(':id/tag')
  addTag(@Param('id', ParseIntPipe) id: number, @Body() tag: CreateTagDto) {
    const movie = this.moviesService.addTag(id, tag);
    return movie;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id/tag')
  deleteTag(@Param('id', ParseIntPipe) id: number, @Body() tag: CreateTagDto) {
    const movie = this.moviesService.deleteTag(id, tag);
    return movie;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENT')
  @Post(':id/rent')
  async rentMovie(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthedUserDto,
  ) {
    const userWithRentals = await this.moviesService.rentOneMovie(id, user.id);
    return userWithRentals;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENT')
  @Post(':id/return')
  async returnMovie(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthedUserDto,
  ) {
    const message = await this.moviesService.returnOneMovie(id, user.id);
    return message;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('CLIENT')
  @Post(':id/buy')
  async buyMovie(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthedUserDto,
  ) {
    const message = await this.moviesService.buyOneMovie(id, user.id);
    return message;
  }
}
