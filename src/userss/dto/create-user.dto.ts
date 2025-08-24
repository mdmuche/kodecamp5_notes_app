import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 100;
export const USER_PASSWORD_MIN_LENGTH = 8;
export const USER_PASSWORD_MAX_LENGTH = 30;

export class CreateUserDto {
  @ApiProperty({
    description: 'user name',
    example: 'tony max',
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
  })
  @IsString()
  @MinLength(USERNAME_MIN_LENGTH, { message: 'Name is too short' })
  @MaxLength(USERNAME_MAX_LENGTH, { message: 'Name is too long' })
  name: string;

  @ApiProperty({
    description: 'user email',
    example: 'tony@max.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'user password',
    example: 'password123',
    minLength: USER_PASSWORD_MIN_LENGTH,
    maxLength: USER_PASSWORD_MAX_LENGTH,
  })
  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH, { message: 'Password too short' })
  password: string;
}
