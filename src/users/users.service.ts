import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Role } from './entities/role.entity';

@Injectable()
class UsersService {
  constructor(
    @InjectRepository(User)
    private repoUsers: Repository<User>,
    @InjectRepository(Role)
    private repoRole: Repository<Role>,
  ) {}

  getUsers() {
    return this.repoUsers.find({ where: { isActive: true } });
  }

  async getUserByIdOrThrow(id: number) {
    const user = await this.repoUsers
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new NotFoundException(`No user with id:${id} found!`);
    }
    return user;
  }

  async getUserWithRentalOrThrow(id: number) {
    const user = await this.repoUsers
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.rentals',
        'rentals',
        'rentals.status = :status',
        { status: 1 },
      )
      .leftJoinAndSelect('rentals.movie', 'movie')
      .where('user.id = :id', { id: id })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new NotFoundException(`No user with id:${id} found!`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.repoUsers
      .createQueryBuilder('user')
      .addSelect('user.password')
      .innerJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: email })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();
  }

  async createUser(data: CreateUserDto) {
    let userExists = await this.findOneByEmail(data.email);
    if (userExists) {
      throw new ConflictException(
        `User with email: ${data.email} already exists!`,
      );
    }
    const role = await this.repoRole.findOne(2);
    const user = this.repoUsers.create({
      email: data.email,
      username: data.username,
      password: data.password,
      role: role,
    });
    return await this.repoUsers.save(user);
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.getUserByIdOrThrow(id);
    const mergeUser = this.repoUsers.create({
      ...user,
      ...data,
      modifiedAt: new Date(),
    });
    const updatedUser = await this.repoUsers.save(mergeUser);
    return updatedUser;
  }

  async deleteUser(id: number) {
    const user = await this.getUserByIdOrThrow(id);

    const mergeUser = this.repoUsers.create({
      ...user,
      isActive: false,
      deletedAt: new Date(),
    });
    const deletedUser = await this.repoUsers.save(mergeUser);
    return null;
  }
}

export default UsersService;
