import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class BodyFilterSpecialtiesDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search?: string;
}
