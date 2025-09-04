import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BodyRegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
