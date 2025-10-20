import { Module } from '@nestjs/common';
import { RelativesController } from './relatives.controller';
import { RelativesService } from './relatives.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Relative from 'src/entities/relative.entity';
import User from 'src/entities/user.entity';
import HealthProfile from 'src/entities/healthProfile.entity';
import Relationship from 'src/entities/relationship.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relative, User, HealthProfile, Relationship]),
  ],
  controllers: [RelativesController],
  providers: [RelativesService],
})
export class RelativesModule {}
