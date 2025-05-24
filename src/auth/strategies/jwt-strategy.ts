import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.userProfile(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid Token');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
