import { IsNotEmpty, IsString } from 'class-validator';

export class BodyCreateSpecialtyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  img_url?: string;
}
