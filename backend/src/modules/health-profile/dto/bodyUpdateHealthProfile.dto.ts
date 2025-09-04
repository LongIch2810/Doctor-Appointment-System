import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class BodyUpdateHealthProfileDto {
  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsString()
  @IsNotEmpty()
  //Nhóm máu
  blood_type: string;

  @IsString()
  @IsNotEmpty()
  //Bệnh nền
  medical_history: string;

  @IsString()
  @IsNotEmpty()
  //Dị ứng
  allergies: string;

  @IsNumber()
  //Nhịp tim
  heart_rate: number;

  @IsString()
  @IsNotEmpty()
  //Huyết áp
  blood_pressure: string;

  @IsNumber()
  //Lượng đường huyết (mg/dL)
  glucose_level: number;

  @IsNumber()
  //Mức cholesterol (mg/dL)
  cholesterol_level: number;

  @IsString()
  @IsNotEmpty()
  //Thuốc đang sử dụng
  medications?: string;

  @IsString()
  @IsNotEmpty()
  //Các mũi vac xin đã tiêm
  vaccinations: string;

  @IsBoolean()
  //Có hút thuốc không ?
  smoking: boolean;

  @IsBoolean()
  //Có uống rượu hoặc bia không
  alcohol_consumption: boolean;

  @IsString()
  @IsNotEmpty()
  //Tần suất vận động
  exercise_frequency: string;

  @IsDateString()
  //Ngày khám gần nhất
  last_checkup_date: Date;
}
