import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Topic from 'src/entities/topic.entity';
import { Repository } from 'typeorm';
import { BodyFilterTopicsDto } from './dto/bodyFilterTopics.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic) private topicRepo: Repository<Topic>,
    private redisCacheService: RedisCacheService,
  ) {}

  async filterAndPagination(
    page: number,
    limit: number,
    objectFilter: Partial<BodyFilterTopicsDto>,
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;

    const cacheKey = `topics:page=${page}:limit=${limit}:filters=${JSON.stringify(objectFilter || {})}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const query = this.topicRepo
      .createQueryBuilder('topic')
      .where('topic.deleted_at is NULL')
      .take(limit)
      .skip(skip);

    if (objectFilter?.search) {
      query.andWhere(`LOWER(topic.name) LIKE LOWER(:search)`, {
        search: `%${objectFilter.search}%`,
      });
    }

    const [topics, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const result = {
      topics,
      total,
      totalPages,
      page,
      limit,
    };

    await this.redisCacheService.setData(cacheKey, result);

    return result;
  }
}
