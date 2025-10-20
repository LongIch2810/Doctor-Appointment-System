import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import RolePermission from 'src/entities/rolePermission.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission]), RedisCacheModule],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
