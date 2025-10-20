import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from 'src/utils/constants';

export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
