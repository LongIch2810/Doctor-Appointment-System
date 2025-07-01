import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import User from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(req: Request) {
    const user: any = req.user;
    const sessionVersion =
      (await this.redisService.getData(`session_version:${user.id}`)) || 1;
    await this.redisService.setData(
      `session_version:${user.id}`,
      sessionVersion,
    );

    const tokenId = uuidv4();

    const payload = { sub: user.id, tokenId, sessionVersion };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
    });
    const refreshTokenDecoded = this.jwtService.decode(refreshToken);

    const sessions = await this.redisService.lRange(
      `refresh_tokens:${user.id}`,
      0,
      -1,
    );
    if (sessions.length > 3) {
      const oldest = JSON.parse(sessions[0]);
      await this.redisService.lPop(`refresh_tokens:${user.id}`);
      const now = Math.floor(Date.now() / 1000);
      const ttl = oldest.exp ? oldest.exp - now : 7 * 24 * 60 * 60;
      await this.redisService.setData(`blacklist:${oldest.tokenId}`, true, ttl);
    }

    await this.redisService.rPush(
      `refresh_tokens:${user.id}`,
      JSON.stringify({
        tokenId,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        issuedAt: new Date().toISOString(),
        exp: refreshTokenDecoded.exp,
      }),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dataRegister: RegisterDto): Promise<any> {
    const { username, email, password } = dataRegister;

    const existsUser =
      (await this.usersService.findByUsernameOrEmail(username)) ||
      (await this.usersService.findByUsernameOrEmail(email));

    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.createUser(username, email, hashedPassword);

    return {
      message: 'Register successfully',
    };
  }

  async logout(req: Request) {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    const decoded = this.jwtService.decode(refreshToken);
    console.log(decoded);
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp ? decoded.exp - now : 7 * 24 * 60 * 60;
    await this.redisService.setData(`blacklist:${decoded.tokenId}`, true, ttl);
    const list = await this.redisService.lRange(
      `refresh_tokens:${decoded.sub}`,
      0,
      -1,
    );
    console.log(list);
    const match = list.find((t) => JSON.parse(t).tokenId === decoded.tokenId);
    console.log(match);
    if (!match) throw new UnauthorizedException('Token không hợp lệ !');
    const count = await this.redisService.lRem(
      `refresh_tokens:${decoded.sub}`,
      0,
      match,
    );
    console.log(count);
    const number = await this.redisService.incr(
      `session_version:${decoded.sub}`,
    );
    console.log(number);
    return { message: 'Logout successfully' };
  }

  async refresh(req: Request, payload: any) {
    const { userId, tokenId, sessionVersion } = payload;

    const isBlacklisted = await this.redisService.getData(
      `blacklist:${tokenId}`,
    );
    if (isBlacklisted) throw new UnauthorizedException('Token đã bị thu hồi !');

    const list = await this.redisService.lRange(
      `refresh_tokens:${userId}`,
      0,
      -1,
    );
    console.log(`refresh_tokens:${userId}`);
    console.log(list);
    const match = list.find((t) => JSON.parse(t).tokenId === tokenId);
    console.log(match);
    if (!match) throw new UnauthorizedException('Token không hợp lệ !');
    const newTokenId = uuidv4();
    const newPayload = {
      sub: userId,
      tokenId: newTokenId,
      sessionVersion: sessionVersion,
    };
    const count = await this.redisService.lRem(
      `refresh_tokens:${userId}`,
      0,
      match,
    );
    console.log(count);
    const now = Math.floor(Date.now() / 1000);
    const parsed = JSON.parse(match);
    const ttl = parsed.exp ? parsed.exp - now : 7 * 24 * 60 * 60;
    await this.redisService.setData(`blacklist:${tokenId}`, true, ttl);

    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
    });
    const newDecoded = this.jwtService.decode(newRefreshToken) as any;

    await this.redisService.rPush(
      `refresh_tokens:${userId}`,
      JSON.stringify({
        tokenId: newTokenId,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        issuedAt: new Date().toISOString(),
        exp: newDecoded.exp,
      }),
    );

    return { newAccessToken, newRefreshToken };
  }
}
