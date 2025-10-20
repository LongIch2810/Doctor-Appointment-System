import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';
import { HealthProfileService } from '../health-profile/health-profile.service';
import { AuthService } from './auth.service';
import { DataSource } from 'typeorm';
import User from 'src/entities/user.entity';
import Relationship from 'src/entities/relationship.entity';
import Relative from 'src/entities/relative.entity';
import HealthProfile from 'src/entities/healthProfile.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private dataSource: DataSource,
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
    const fullname = profile.displayName;

    try {
      return await this.dataSource.transaction(async (manager) => {
        const newUser = manager.create(User, {
          username,
          email,
          fullname,
        });
        await manager.save(User, newUser);

        await manager.update(User, newUser.id, { picture });

        const relationship = await manager.findOne(Relationship, {
          where: { relationship_code: 'ban-than' },
        });

        if (!relationship)
          throw new NotFoundException('Mối quan hệ mặc định không tồn tại.');

        const newRelative = manager.create(Relative, {
          user: newUser,
          fullname,
          relationship,
        });
        await manager.save(Relative, newRelative);

        const newHealth = manager.create(HealthProfile, {
          patient: newRelative,
        });
        await manager.save(HealthProfile, newHealth);

        done(null, newUser);
      });
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      throw error;
    }
  }
}
