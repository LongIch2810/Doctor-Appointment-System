import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Article from 'src/entities/article.entity';
import { In, Repository } from 'typeorm';
import { BodyCreateArticleDto } from './dto/bodyCreateArticle.dto';
import User from 'src/entities/user.entity';
import { BodyUpdateArticleDto } from './dto/bodyUpdateArticle.dto';
import { generateSlug } from 'src/utils/generateSlug';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { removePasswordDeep } from 'src/utils/removePasswordDeep';
import { PartialUpdateArticleDto } from './dto/partialUpdateArticle.dto';
import { BodyFilterArticlesDto } from './dto/bodyFilterArticles.dto';
import { CloudinaryService } from 'src/uploads/cloudinary.service';
import Topic from 'src/entities/topic.entity';
import ArticleTag from 'src/entities/articleTag.entity';
import Tag from 'src/entities/tag.entity';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Topic) private topicRepo: Repository<Topic>,
    @InjectRepository(ArticleTag)
    private articleTagRepo: Repository<ArticleTag>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    private redisCacheService: RedisCacheService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createArticle(
    userId: number,
    bodyCreateArticle: BodyCreateArticleDto,
    fileImage: Express.Multer.File,
  ) {
    let uploadResult: UploadApiResponse | null = null;
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại.');
      }
      const topicId = bodyCreateArticle.topic_id;
      const topic = await this.topicRepo.findOne({ where: { id: topicId } });
      if (!topic) {
        throw new NotFoundException('Chủ đề không tồn tại.');
      }

      uploadResult = await this.cloudinaryService.uploadFile(fileImage);
      const articleData = {
        ...bodyCreateArticle,
        slug: generateSlug(bodyCreateArticle.title),
        author: user,
        topic,
        img_url: uploadResult?.secure_url,
        img_public_id: uploadResult?.public_id,
      };

      const createdArticle = this.articleRepo.create(articleData);
      const newArticle = await this.articleRepo.save(createdArticle);

      this.logger.log(`Article created successfully: ${newArticle.id}`);
      const tag_ids = bodyCreateArticle.tag_ids;
      const tags = await this.tagRepo.find({
        where: { id: In(tag_ids) },
      });

      if (tags.length !== tag_ids.length) {
        throw new NotFoundException('Một hoặc nhiều tag không tồn tại.');
      }

      const articleTags = tag_ids.map((tagId) =>
        this.articleTagRepo.create({
          article: { id: newArticle.id },
          tag: { id: tagId },
        }),
      );

      await this.articleTagRepo.save(articleTags);

      return { message: 'Tạo bài viết thành công.' };
    } catch (error) {
      this.logger.error('Error creating article:', error);

      if (uploadResult?.public_id) {
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Có lỗi xảy ra khi tạo bài viết.');
    }
  }

  async updateArticle(
    articleId: number,
    bodyUpdateArticle: PartialUpdateArticleDto,
  ) {
    const article = await this.articleRepo.findOne({
      where: { id: articleId, is_approve: true },
    });

    if (!article) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }

    const fields: Partial<BodyUpdateArticleDto> & { slug?: string } = {
      ...bodyUpdateArticle,
      ...(bodyUpdateArticle?.title && {
        slug: generateSlug(bodyUpdateArticle.title + Date.now()),
      }),
    };

    await this.articleRepo.update(articleId, fields);

    await this.redisCacheService.delData(`article:${articleId}`);

    return { message: 'Cập nhật bài viết thành công' };
  }

  async deleteArticle(articleId: number) {
    const article = await this.articleRepo.findOne({
      where: { id: articleId, is_approve: true },
    });

    if (!article) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }

    await this.articleRepo.softDelete(articleId);

    await this.redisCacheService.delData(`article:${articleId}`);

    return { message: 'Xóa bài biết thành công.' };
  }

  async getArticle(articleId: number) {
    const cacheKey = `article:${articleId}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const article = await this.articleRepo.findOne({
      where: { id: articleId, is_approve: true },
      relations: ['author', 'tags', 'tags.tag', 'topic'],
    });

    if (!article) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }

    await this.redisCacheService.setData(
      cacheKey,
      removePasswordDeep(article),
      3600,
    );

    return article;
  }

  async approveArticle(articleId: number) {
    const article = await this.articleRepo.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }

    if (article.is_approve) {
      throw new BadRequestException('Bài viết đã được phê duyệt.');
    }

    await this.articleRepo.update(articleId, { is_approve: true });

    return { message: 'Duyệt bài viết thành công.' };
  }

  async filterAndPagination(
    page: number,
    limit: number,
    objectFilter: Partial<BodyFilterArticlesDto>,
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;

    const cacheKey = `articles:page=${page}:limit=${limit}:filters=${JSON.stringify(objectFilter || {})}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const query = this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.topic', 'topic')
      .leftJoinAndSelect('article.tags', 'articleTag')
      .leftJoinAndSelect('articleTag.tag', 'tag')
      .where('article.is_approve = :is_approve', { is_approve: true })
      .andWhere('article.deleted_at IS NULL')
      .select([
        'article.id',
        'article.title',
        'article.summary',
        'article.img_url',
        'article.created_at',
        'author.id',
        'author.fullname',
        'topic.id',
        'topic.name',
        'articleTag.id',
        'tag.id',
        'tag.slug',
      ])
      .take(limit)
      .skip(skip);

    const filters = [
      {
        condition: 'topic.slug = :topic_slug',
        value: objectFilter.topic_slug,
        key: 'topic_slug',
      },
      {
        condition: `(LOWER(article.title) LIKE LOWER(:search) 
      OR LOWER(author.fullname) LIKE LOWER(:search) 
      OR LOWER(topic.name) LIKE LOWER(:search) 
      OR LOWER(tag.name) LIKE LOWER(:search))`,
        value: objectFilter.search,
        key: 'search',
      },
    ];

    filters.forEach(({ condition, value, key }) => {
      if (value !== undefined && value !== null) {
        query.andWhere(condition, { [key]: value });
      }
    });

    const [articles, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const result = {
      total,
      articles,
      page,
      limit,
      totalPages,
    };

    await this.redisCacheService.setData(cacheKey, result, 3600);

    return result;
  }
}
