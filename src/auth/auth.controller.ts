import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { SessionAuthGuard } from './dto/guards/session-auth.guard';
import { CurrentUserId } from './decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user
   * @param registerDto - The registration data
   * @param session - The session object
   * @returns The registered user
   */
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User with this email already exists',
  })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Session() session: Record<string, any>,
  ): Promise<UserResponseDto> {
    const user = await this.authService.register(registerDto);
    session.userId = user.id;
    session.user = user;
    return user;
  }

  /**
   * Login a user
   * @param loginDto -The login credentials
   * @param session - The session object
   * @returns The logged-in user
   */
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ): Promise<UserResponseDto> {
    const user = await this.authService.login(loginDto);
    session.userId = user.id;
    session.user = user;
    return user;
  }

  /**
   * Get current user profile
   * @param userId - the ID of the user
   * @returns The current user profile
   */
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SessionAuthGuard)
  @Get('me')
  async getProfile(@CurrentUserId() userId: string): Promise<UserResponseDto> {
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      return this.authService.getUserProfile(userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occured while trying to fetch user profile',
      );
    }
  }

  /**
   * Logout user
   * @param session - The session object
   * @returns A message indicating the logout status
   */
  @ApiOperation({ summary: 'logout user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  @Post('logout')
  logout(@Session() session: Record<string, any>): { message: string } {
    session.userId = null;
    session.user = null;
    return { message: 'Successfully logged out' };
  }
}
