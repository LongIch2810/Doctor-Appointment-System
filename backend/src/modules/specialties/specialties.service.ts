import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Specialty from 'src/entities/specialty.entity';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { Repository } from 'typeorm';
import { BodyUpdateSpecialtyDto } from './dto/bodyUpdateSpecialty.dto';
import { BodyFilterSpecialtiesDto } from './dto/bodyFilterSpecialties.dto';
import { BodyCreateSpecialtyDto } from './dto/bodyCreateSpecialty.dto';
import { generateSlug } from 'src/utils/generateSlug';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty) private specialtyRepo: Repository<Specialty>,
    private redisCacheService: RedisCacheService,
  ) {}

  async createSpecialty(bodyCreateSpecialty: BodyCreateSpecialtyDto) {
    const { description, name, img_url } = bodyCreateSpecialty;
    if (!img_url) {
      throw new BadRequestException('Ảnh chuyên khoa là bắt buộc.');
    }

    const slug = generateSlug(name);

    const specialty = await this.specialtyRepo.findOne({
      where: { slug },
    });

    if (specialty) {
      throw new ConflictException('Chuyên khoa đã tồn tại.');
    }

    await this.specialtyRepo.save({
      description,
      name,
      slug,
      img_url,
    });

    return { message: 'Tạo chuyên khoa thành công.' };
  }

  async updateSpecialty(
    specialtyId: number,
    bodyUpdateSpecialty: Partial<BodyUpdateSpecialtyDto>,
  ) {}

  async deleteSpecialty(specialtyId: number) {
    const specialty = await this.specialtyRepo.findOne({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new NotFoundException('Chuyên khoa không tồn tại.');
    }

    await this.specialtyRepo.softDelete(specialtyId);

    return { message: 'Xóa chuyên khoa thành công.' };
  }

  async getSpecialty(specialtyId: number) {
    const specialty = await this.specialtyRepo.findOne({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new NotFoundException('Chuyên khoa không tồn tại.');
    }

    return specialty;
  }

  async filterAndPagination(
    page: number,
    limit: number,
    objectFilter: Partial<BodyFilterSpecialtiesDto>,
  ) {
    const cacheKey = `specialties:page=${page}:limit=${limit}:filter=${objectFilter || {}}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const skip = (page - 1) * limit;

    const query = this.specialtyRepo
      .createQueryBuilder('specialty')
      .where('specialty.deleted_at is NULL')
      .take(limit)
      .skip(skip);

    if (objectFilter?.search) {
      query.where(
        'UNACCENT(LOWER(specialty.name)) LIKE UNACCENT(LOWER(:search))',
        { search: objectFilter.search },
      );
    }

    const [specialties, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const result = {
      specialties,
      total,
      totalPages,
      limit,
      page,
    };

    await this.redisCacheService.setData(cacheKey, result, 3600);

    return result;
  }
}
