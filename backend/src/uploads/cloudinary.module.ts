import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryConfig } from 'src/config/cloudinary/cloudinary.config';

@Module({
  providers: [CloudinaryService, CloudinaryConfig],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
