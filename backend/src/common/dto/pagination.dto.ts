import { IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  limit: number;
}
