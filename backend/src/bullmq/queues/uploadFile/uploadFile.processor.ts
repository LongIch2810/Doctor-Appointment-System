import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import { MessagesService } from 'src/modules/messages/messages.service';
import { JobUploadName } from 'src/shared/enums/jobUploadName';
import { UploadFileResponse } from 'src/shared/interfaces/uploadFileResponse';
import { CloudinaryService } from 'src/uploads/cloudinary.service';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';
import { mapFileType } from '../../../utils/mapFileType';

@Processor('upload-file-queue', {
  concurrency: 20,
})
export class UploadFileProcessor extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => CloudinaryService))
    private readonly cloudinaryService: CloudinaryService,
    private readonly messagesService: MessagesService,
    private readonly gateway: WebsocketGateway,
  ) {
    super();
  }
  async process(job: Job, token?: string): Promise<any> {
    if (job.name === JobUploadName.UPLOAD_FILES_MESSAGE) {
      console.log('>>> job.data : ', job.data);
      const { messageId, files } = job.data;
      const filesDataResponse =
        await this.cloudinaryService.uploadMultipleFiles(files);
      console.log('>>> filesDataResponse : ', filesDataResponse);
      const filesData: UploadFileResponse[] = filesDataResponse.map((item) => ({
        url: item.secure_url,
        type: mapFileType(item.resource_type),
        file_name: item.original_filename,
        file_size: item.bytes,
        file_extension: item.format,
        public_id: item.public_id,
      }));
      console.log('>>> filesData : ', filesData);
      const message = await this.messagesService.updateFilesMessage(
        messageId,
        filesData,
      );

      this.gateway.notifyUpdatedFiles(message!);
    }
  }
}
