import { FileType } from '../enums/FileType';

export interface UploadFileResponse {
  url: string;
  type: FileType;
  file_name: string;
  file_size: number;
  file_extension: string;
  public_id: string;
}
