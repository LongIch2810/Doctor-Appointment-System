import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class BodyFilterDoctorsDto extends PaginationDto {
  @IsNumber()
  @IsOptional()
  specialty_id?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  experience?: number;

  @IsString()
  @IsOptional()
  workspace?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
