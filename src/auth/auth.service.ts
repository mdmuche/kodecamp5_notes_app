import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    try {
      return await this.userService.createUser(registerDto);
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'p2002') {
          throw new BadRequestException('User with this email already exists');
        }
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<UserResponseDto> {
    try {
      const user = await this.userService.validateUser(loginDto);
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      return user;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occured while logging in the user',
      );
    }
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    return await this.userService.findById(userId);
  }
}
