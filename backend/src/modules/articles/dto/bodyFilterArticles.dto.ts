import { IsOptional, IsString, Length } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class BodyFilterArticlesDto extends PaginationDto {
  @IsString()
  @IsOptional()
  topic_slug?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
