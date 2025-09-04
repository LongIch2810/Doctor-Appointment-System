import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HealthProfile from 'src/entities/healthProfile.entity';
import { Repository } from 'typeorm';
import User from 'src/entities/user.entity';
import { BodyUpdateHealthProfileDto } from './dto/bodyUpdateHealthProfile.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class HealthProfileService {
  constructor(
    @InjectRepository(HealthProfile)
    private healthProfileRepo: Repository<HealthProfile>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private redisCacheService: RedisCacheService,
  ) {}

  async createHealthProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['health_profile'],
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    if (user.health_profile) {
      throw new ConflictException('Hồ sơ sức khỏe đã tồn tại trong hệ thống.');
    }

    const newHealthProfile = this.healthProfileRepo.create({
      patient: { id: userId },
    });

    await this.healthProfileRepo.save(newHealthProfile);

    return {
      message:
        'Tạo hồ sơ sức khỏe thành công. Bây giờ bạn có thể cập nhật thông tin sức khỏe vào hồ sơ.',
    };
  }

  async updateHealthProfile(
    userId: number,
    bodyUpdateHealthProfile: Partial<BodyUpdateHealthProfileDto>,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['health_profile'],
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    if (!user.health_profile) {
      throw new NotFoundException(
        'Hồ sơ sức khỏe của bạn chưa có trên hệ thống, vui lòng tạo và cập nhật thông tin.',
      );
    }

    await this.healthProfileRepo.update(
      user.health_profile.id,
      bodyUpdateHealthProfile,
    );

    return { message: 'Cập nhật hồ sơ sức khỏe thành công.' };
  }

  async getHealthProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['health_profile'],
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    if (!user.health_profile) {
      throw new NotFoundException(
        'Hồ sơ sức khỏe của bạn chưa có trên hệ thống, vui lòng tạo và cập nhật thông tin.',
      );
    }

    const cacheKey = `health-profile:${userId}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    await this.redisCacheService.setData(cacheKey, user.health_profile);

    return user.health_profile;
  }
}
