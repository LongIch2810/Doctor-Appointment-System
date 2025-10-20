import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { config } from 'dotenv';
import { Observable } from 'rxjs';
import 'dotenv/config';
@Injectable()
export class WsCookieAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this._extractTokenFromCookie(client);
    console.log('>>> token: ', token);
    if (!token) {
      client.emit('ws-error', { code: 401, message: 'Invalid token' });
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'secret',
      });

      client.data.user = payload;
      client.data.token = token;

      return true;
    } catch (err) {
      client.emit('ws-error', { code: 401, message: 'Invalid token' });
      return false;
    }
  }

  private _extractTokenFromCookie = (client: any): string | null => {
    try {
      const cookies = client?.handshake?.headers?.cookie;
      if (!cookies) return null;
      console.log('>>> cookies : ', cookies);
      const cookieArray = cookies.split('; ');
      console.log('>>> cookieArray : ', cookieArray);
      const cookieMap = cookieArray.reduce((acc: any, cookie: string) => {
        const [key, value] = cookie.split('=');
        if (key && value) acc[key.trim()] = decodeURIComponent(value);
        return acc;
      }, {});
      console.log('>>> cookieMap : ', cookieMap);
      return cookieMap['accessToken'] || null;
    } catch (error) {
      return null;
    }
  };
}
