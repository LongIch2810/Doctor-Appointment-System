import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import RolePermission from 'src/entities/rolePermission.entity';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    private redisCacheService: RedisCacheService,
  ) {}

  async getPermissionsByRoles(
    userId: number,
    roles: string[],
  ): Promise<string[]> {
    const cacheKey = `permissions:${userId}`;
    const cachedData = (await this.redisCacheService.getData(
      cacheKey,
    )) as string[];
    if (cachedData) return cachedData;

    const rawPermissions = await this.rolePermissionRepository
      .createQueryBuilder('rp')
      .innerJoin('rp.permission', 'permission')
      .innerJoin('rp.role', 'role')
      .where('role.role_name IN (:...roles)', { roles })
      .select('DISTINCT permission.name', 'name')
      .getRawMany();

    const permissions = rawPermissions.map((item) => item.name);

    await this.redisCacheService.setData(cacheKey, permissions, 3600);

    return permissions;
  }
}
