import { Module, forwardRef } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryConfig } from 'src/config/cloudinary/cloudinary.config';
import { UploadsController } from './uploads.controller';
import { BullmqModule } from 'src/bullmq/bullmq.module';

@Module({
  imports: [forwardRef(() => BullmqModule)],
  providers: [CloudinaryService, CloudinaryConfig],
  exports: [CloudinaryService],
  controllers: [UploadsController],
})
export class CloudinaryModule {}
