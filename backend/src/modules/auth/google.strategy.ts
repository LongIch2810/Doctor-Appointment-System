import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALL_BACK'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, photos } = profile;
    const email = emails[0].value;
    const user = await this.usersService.findByUsernameOrEmail(email);
    const picture = photos[0].value;
    if (user) {
      if (!user.picture) {
        await this.usersService.updateUserField(user.id, 'picture', picture);
      }
      return done(null, user);
    }

    const username = email.split('@')[0];

    const newUser = await this.usersService.createUser(username, email, null);
    await this.usersService.updateUserField(newUser.id, 'picture', picture);

    return done(null, newUser);
  }
}
