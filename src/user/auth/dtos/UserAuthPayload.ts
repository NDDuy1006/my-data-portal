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
import { ApiProperty } from '@nestjs/swagger';

export class UserAuthPayload {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: 'string' })
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ type: 'string' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string' })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string' })
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string' })
  @Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, {
    message: 'Phone must be a valid phone number',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string' })
  productKey?: string;
}

export class UserSigninPayload {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class GenerateProductKeyPayload {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEnum(UserType)
  @ApiProperty()
  userType: UserType;
}
