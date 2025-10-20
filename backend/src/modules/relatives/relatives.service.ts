import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Relative from 'src/entities/relative.entity';
import User from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRelativeDto } from './dto/createRelative.dto';
import HealthProfile from 'src/entities/healthProfile.entity';
import Relationship from 'src/entities/relationship.entity';

@Injectable()
export class RelativesService {
  constructor(
    @InjectRepository(Relative) private relativeRepo: Repository<Relative>,
    @InjectRepository(HealthProfile)
    private healthProfileRepo: Repository<HealthProfile>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Relationship)
    private relationshipRepo: Repository<Relationship>,
    private dataSource: DataSource,
  ) {}

  async createRelative(userId: number, createRelativeDto: CreateRelativeDto) {
    return await this.dataSource.transaction(async (manager) => {
      const relationship = await manager.findOne(Relationship, {
        where: { relationship_code: createRelativeDto.relationship_code },
      });

      if (!relationship) {
        throw new NotFoundException('Relationship code not found');
      }

      const newRelative = manager.create(Relative, {
        ...createRelativeDto,
        user: { id: userId },
        relationship: { relationship_code: relationship.relationship_code },
      });
      await manager.save(Relative, newRelative);

      const newHealthProfile = manager.create(HealthProfile, {
        patient: { id: newRelative.id },
      });
      await manager.save(HealthProfile, newHealthProfile);

      return newRelative;
    });
  }

  async findRelativesByRelationshipCodeAndName(data: {
    userId: number;
    relationshipCode: string;
    name: string;
  }) {
    const { userId, relationshipCode, name } = data;
    try {
      const relationship = await this.relationshipRepo.findOne({
        where: { relationship_code: relationshipCode },
      });
      if (!relationship) {
        throw new NotFoundException('Relationship code not found');
      }
      const query = this.relativeRepo
        .createQueryBuilder('relative')
        .where('relative.user_id = :userId', { userId })
        .andWhere(
          'lower(relative.relationship_code) = lower(:relationshipCode)',
          {
            relationshipCode,
          },
        );
      if (name)
        query.andWhere('lower(relative.fullname) LIKE lower(:name)', {
          name: `%${name}%`,
        });
      const relatives = await query.getMany();
      return relatives;
    } catch (error) {
      console.error(
        '🔥 Lỗi trong findRelativesByRelationshipCodeAndName:',
        error,
      );
      throw error;
    }
  }
}
