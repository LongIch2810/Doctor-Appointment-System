import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';

export class CreateRelativeDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  relationship_code: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsDateString()
  dob: string;

  @IsBoolean()
  gender: boolean;
}
