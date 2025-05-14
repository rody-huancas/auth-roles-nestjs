import { Controller, Post, Body, Get } from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
