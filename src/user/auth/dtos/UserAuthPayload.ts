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
  @ApiProperty({
    type: 'string',
    example: 'example@email.com',
    description: 'Email of user',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    type: 'string',
    example: 'password',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Sum Ting',
    description: 'Firstname of user',
  })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Wong',
    description: 'Lastname of user',
  })
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
  })
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
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