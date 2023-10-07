import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, {
    message: 'Phone must be a valid phone number',
  })
  phone: string;

  @IsString()
  @IsOptional()
  productKey?: string;
}

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class GenerateProductKeyDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
