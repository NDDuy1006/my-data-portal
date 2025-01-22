import { PropertyType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class HomeUpdatePayload {
  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  numberOfBathrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  @ApiProperty()
  propertyType?: PropertyType;
}
