import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService:ConfigService
  ) {}

  async registerUser(
    data: RegisterDto,
  ): Promise<{ message: string; userId: unknown }> {
    const existedUser = await this.userModel.findOne({ email: data.email });

    if (existedUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword: string = await bcrypt.hash(data.password, 10);

    const newUser = await this.userModel.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      userId: newUser._id,
    };
  }

  async loginUser(
    data: LoginDto,
  ): Promise<{ message: string; userId: unknown }> {
    const user = await this.userModel
      .findOne({ email: data.email })
      .select('+password');

    if (!user) {
      throw new NotFoundException(
        'Invalid Credentials.Please check and try again',
      );
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid Credentials.Please check and try again',
      );
    }
    const tokens = this.genTokens(user);
    return {
      message: 'Login successful',
      userId: user._id,
      ...tokens,
    };
  }

  async refreshToken(token: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify<{
        sub: string;
        role: string;
      }>(token, {
        secret: 'jwt_refresh_secret',
      });
      const user = await this.userModel.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return this.genAccessToken(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async userProfile(id: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private genTokens(user: User) {
    return {
      access_token: this.genAccessToken(user),
      refresh_token: this.genRefreshToken(user),
    };
  }

  private genAccessToken(user: User): string {
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  private genRefreshToken(user: User): string {
    const payload = {
      sub: user._id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}
