import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BodyCreateArticleDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString({ message: 'Tiêu đề phải là chuỗi' })
  @MinLength(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự' })
  @MaxLength(200, { message: 'Tiêu đề không được vượt quá 200 ký tự' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString({ message: 'Nội dung phải là chuỗi' })
  @MinLength(100, { message: 'Nội dung phải có ít nhất 100 ký tự' })
  @Transform(({ value }) => value?.trim())
  content: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  @MaxLength(500, { message: 'Tóm tắt không được vượt quá 500 ký tự' })
  @Transform(({ value }) => value?.trim())
  summary: string;

  @IsOptional()
  @IsArray({ message: 'Tags phải là mảng' })
  @ArrayMaxSize(10, { message: 'Không được có quá 10 tags' })
  @IsString({ each: true, message: 'Mỗi tag phải là chuỗi' })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      : [],
  )
  tag_ids: number[];

  @IsOptional()
  @IsString({ message: 'Topic phải là chuỗi' })
  @Transform(({ value }) => value?.trim())
  topic_id: number;

  // Fields sẽ được populate từ service
  img_url?: string;
  img_public_id?: string;
}
