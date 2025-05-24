import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { CurrentUser } from './decorators/currentUser-decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<any> {
    return await this.authService.registerUser(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto): Promise<any> {
    return await this.authService.loginUser(data);
  }

  @Post('refresh')
  async refresh(@Body('token') token: string) {
    return await this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
