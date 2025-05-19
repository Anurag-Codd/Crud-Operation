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

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      message: 'Login successful',
      userId: user._id,
    };
  }
}
