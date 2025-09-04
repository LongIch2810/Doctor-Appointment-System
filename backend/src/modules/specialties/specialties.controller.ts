import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { CloudinaryService } from 'src/uploads/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { BodyCreateSpecialtyDto } from './dto/bodyCreateSpecialty.dto';
import { diskStorage } from 'multer';
import { FileRequiredInterceptor } from 'src/common/interceptors/fileRequiredInterceptor.interceptor';

@Controller('specialties')
@UseGuards(JwtAuthGuard)
export class SpecialtiesController {
  constructor(
    private specialtiesService: SpecialtiesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('create-specialty')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh JPG/PNG/GIF/WEBP'),
            false,
          );
        }
        cb(null, true);
      },
    }),
    FileRequiredInterceptor,
  )
  async createSpecialty(
    @Body() bodyCreateSpecialty: BodyCreateSpecialtyDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedResult = await this.cloudinaryService.uploadFile(file);
    const { message: messageResult } =
      await this.specialtiesService.createSpecialty({
        ...bodyCreateSpecialty,
        img_url: uploadedResult,
      });
    return messageResult;
  }

  @Patch(':specialtyId')
  async updateSpecialty() {}

  @Delete(':specialtyId')
  async deleteSpecialty() {}

  @Get(':specialtyId')
  async getSpecialty() {}

  @Get()
  async getSpecialties() {}
}
