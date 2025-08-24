import { IsEmail, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'tony"max.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  password: string;
}
