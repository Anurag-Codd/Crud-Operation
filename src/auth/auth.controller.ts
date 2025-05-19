import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/user.dto';

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
}
