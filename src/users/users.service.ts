import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../userss/dto/create-user.dto';
import { UserResponseDto } from '../userss/dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { getPasswordHash } from '../utils/auth';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { password } = createUserDto;
    const existingUser = await this.prisma.user.findMany({
      where: { email: createUserDto.email },
    });
    if (existingUser.length) {
      throw new ConflictException(
        `user with this ${createUserDto.email} already exist`,
      );
    }
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: {
          create: {
            hash: await getPasswordHash(password),
          },
        },
      },
    });

    return new UserResponseDto(user);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? new UserResponseDto(user) : null;
  }

  async getUserPassword(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: {
          select: {
            hash: true,
          },
        },
      },
    });
    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    return new UserResponseDto(user);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { password: true },
    });
    if (!user) {
      throw new NotFoundException(`user with the email: ${email} not found`);
    }
    if (user && (await bcrypt.compare(password, user.password!.hash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restUser } = user;
      return { ...restUser };
    }
    return null;
  }
}
