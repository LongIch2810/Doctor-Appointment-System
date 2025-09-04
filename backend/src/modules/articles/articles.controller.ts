import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { BodyCreateArticleDto } from './dto/bodyCreateArticle.dto';
import { BodyUpdateArticleDto } from './dto/bodyUpdateArticle.dto';
import { PartialUpdateArticleDto } from './dto/partialUpdateArticle.dto';
import { BodyFilterArticlesDto } from './dto/bodyFilterArticles.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from '../../uploads/cloudinary.service';
import { FileRequiredInterceptor } from 'src/common/interceptors/fileRequiredInterceptor.interceptor';
import { UploadApiResponse } from 'cloudinary';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);
  constructor(
    private articlesService: ArticlesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('create-article')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!allowedMimes.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh JPG/JPEG/PNG/GIF/WEBP'),
            false,
          );
        }

        const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
        if (!allowedExtensions.test(file.originalname)) {
          return cb(
            new BadRequestException('Định dạng file không được hỗ trợ'),
            false,
          );
        }
        cb(null, true);
      },
    }),
    FileRequiredInterceptor,
  )
  async createArticle(
    @Request() req,
    @Body() bodyCreateArticle: BodyCreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { userId } = req.user;

    try {
      // Upload image to Cloudinary
      this.logger.log(`Uploading image for user ${userId}`);

      // Create article with uploaded image
      const result = await this.articlesService.createArticle(
        userId,
        bodyCreateArticle,
        file,
      );

      this.logger.log(`Article created successfully for user ${userId}`);

      return {
        message: result.message,
      };
    } catch (error) {
      this.logger.error('Error in createArticle:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Có lỗi xảy ra khi tạo bài viết');
    }
  }

  @Patch(':articleId')
  async updateArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    bodyUpdateArticle: PartialUpdateArticleDto,
  ) {
    const { message } = await this.articlesService.updateArticle(
      articleId,
      bodyUpdateArticle,
    );

    return message;
  }

  @Delete(':articleId')
  async deleteArticle(@Param('articleId', ParseIntPipe) articleId: number) {
    const { message } = await this.articlesService.deleteArticle(articleId);
    return message;
  }

  @Get(':articleId')
  async getArticleDetail(@Param('articleId', ParseIntPipe) articleId: number) {
    const article = await this.articlesService.getArticle(articleId);
    return article;
  }

  @Put(':articleId')
  async approveArticle(@Param('articleId', ParseIntPipe) articleId: number) {
    const { message } = await this.articlesService.approveArticle(articleId);
    return message;
  }

  @Post()
  async getArticles(@Body() bodyFilterArticles: BodyFilterArticlesDto) {
    const { page, limit, ...objectFilter } = bodyFilterArticles;

    return this.articlesService.filterAndPagination(page, limit, objectFilter);
  }
}
