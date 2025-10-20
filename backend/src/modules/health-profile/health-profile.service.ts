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
import Relative from 'src/entities/relative.entity';

@Injectable()
export class HealthProfileService {
  constructor(
    @InjectRepository(HealthProfile)
    private healthProfileRepo: Repository<HealthProfile>,
    @InjectRepository(Relative) private relativeRepo: Repository<Relative>,
    private redisCacheService: RedisCacheService,
  ) {}

  async createHealthProfile(relativeId: number) {
    const relative = await this.relativeRepo.findOne({
      where: { id: relativeId },
      relations: ['health_profile'],
    });

    if (!relative) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    if (relative.health_profile) {
      throw new ConflictException('Hồ sơ sức khỏe đã tồn tại trong hệ thống.');
    }

    const newHealthProfile = this.healthProfileRepo.create({
      patient: { id: relativeId },
    });

    await this.healthProfileRepo.save(newHealthProfile);

    return {
      message:
        'Tạo hồ sơ sức khỏe thành công. Bây giờ bạn có thể cập nhật thông tin sức khỏe vào hồ sơ.',
    };
  }

  async updateHealthProfile(
    relativeId: number,
    bodyUpdateHealthProfile: Partial<BodyUpdateHealthProfileDto>,
  ) {
    const relative = await this.relativeRepo.findOne({
      where: { id: relativeId },
      relations: ['health_profile'],
    });

    if (!relative) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    if (!relative.health_profile) {
      throw new NotFoundException(
        'Hồ sơ sức khỏe của bạn chưa có trên hệ thống, vui lòng tạo và cập nhật thông tin.',
      );
    }

    await this.healthProfileRepo.update(
      relative.health_profile.id,
      bodyUpdateHealthProfile,
    );

    return { message: 'Cập nhật hồ sơ sức khỏe thành công.' };
  }

  async getHealthProfile(relativeId: number) {
    const relative = await this.relativeRepo.findOne({
      where: { id: relativeId },
      relations: ['health_profile'],
    });

    if (!relative) {
      throw new NotFoundException('Bệnh nhân không tồn tại.');
    }

    if (!relative.health_profile) {
      throw new NotFoundException(
        'Hồ sơ sức khỏe của bạn chưa có trên hệ thống, vui lòng tạo và cập nhật thông tin.',
      );
    }

    const cacheKey = `health-profile:${relativeId}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    await this.redisCacheService.setData(cacheKey, relative.health_profile);

    return relative.health_profile;
  }
}
