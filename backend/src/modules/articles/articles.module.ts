import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Article from 'src/entities/article.entity';
import User from 'src/entities/user.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { CloudinaryModule } from 'src/uploads/cloudinary.module';
import Topic from 'src/entities/topic.entity';
import ArticleTag from 'src/entities/articleTag.entity';
import Tag from 'src/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, Topic, ArticleTag, Tag]),
    RedisCacheModule,
    CloudinaryModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
