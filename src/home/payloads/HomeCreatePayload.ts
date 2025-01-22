import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Image {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'URL of the image' })
  url: string;
}

export class HomeCreatePayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  numberOfBedrooms: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  numberOfBathrooms: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  landSize: number;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  @ApiProperty()
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [Image],
  })
  images: Image[];
}
