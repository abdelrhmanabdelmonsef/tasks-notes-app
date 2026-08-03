import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/modules/auth/rolse/rolse.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('SECRET_KEY'),
    });    
  }

  async validate(payload: { sub: string; email: string; role: Role }) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}