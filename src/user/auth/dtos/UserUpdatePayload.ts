import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UserUpdatePayload {
  @IsOptional()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({
    type: 'string',
    example: 'password',
  })
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Sum Ting',
    description: 'Firstname of user',
  })
  firstname?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'Wong',
    description: 'Lastname of user',
  })
  lastname?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string' })
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
    message: 'Phone must be a valid phone number',
  })
  phone: string;
}
