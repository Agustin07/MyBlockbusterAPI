import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { UpdateUserDto, CreateUserDto } from '../dto/user.dto';

export const roleAdmin: Role = { id: 1, name: 'ADMIN', users: [] };
export const roleClient: Role = { id: 2, name: 'CLIENT', users: [] };

export const userDTo1 = {
  id: 1,
  username: 'admin',
  email: 'admin@admin.com',
  role: roleAdmin,
};
export const userDto2 = {
  id: 2,
  username: 'agusxx',
  email: 'rigoomartinez@gmail.com',
  role: roleClient,
};

export const authAdmin = { id: 1, role: 'ADMIN' };
export const authUser = { id: 2, role: 'CLIENT' };

export const updteUserDto: UpdateUserDto = {
  email: 'rigoomartinez@gmail.com',
  username: 'agus51',
};

export const createUser: CreateUserDto = {
  email: 'rigoomartinez@gmail.com',
  username: 'agus51',
  password: 'pineapple',
};

export const user1: User = {
  id: 2,
  email: 'rigoomartinez@gmail.com',
  username: 'agusxx',
  password: '$2b$10$6XTNFrDUvqtfdbpn7kdH0eXcl1nnkcRToVJwNIIyDjZEquY56jyxG',
  isActive: true,
  createdAt: new Date('2020-06-25 12:47:12.422'),
  modifiedAt: new Date('2020-06-25 12:47:12.422'),
  deletedAt: new Date('2020-06-25 12:47:12.422'),
  role: roleClient,
  rentals: [],
  async hashPassword() {},
  async comparePassword(attemp: string) {
    return true;
  },
};
