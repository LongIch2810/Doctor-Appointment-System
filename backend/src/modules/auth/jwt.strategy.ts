import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private redisService: RedisCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('ACCESS_TOKEN_SECRET') || 'your_secret',
    });
  }

  async validate(payload: any) {
    const { sub: userId, roles, tokenId, sessionVersion } = payload;

    const currentVersion = await this.redisService.getData(
      `session_version:${userId}`,
    );
    if (sessionVersion !== currentVersion) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ !');
    }

    const isBlacklisted = await this.redisService.getData(
      `blacklist:${tokenId}`,
    );
    if (isBlacklisted) {
      throw new UnauthorizedException('Token đã bị thu hồi !');
    }

    return { userId, roles };
  }
}
