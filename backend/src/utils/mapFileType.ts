import { FileType } from 'src/shared/enums/FileType';

export const mapFileType = (resourceType: string): FileType => {
  switch (resourceType) {
    case 'image':
      return FileType.IMAGE;
    case 'video':
      return FileType.VIDEO;
    case 'raw':
      return FileType.DOCUMENT;
    default:
      return FileType.OTHER;
  }
};
