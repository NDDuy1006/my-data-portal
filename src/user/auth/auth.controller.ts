import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserAuthPayload,
  GenerateProductKeyPayload,
  UserSigninPayload,
} from './dtos/UserAuthPayload';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  @HttpCode(HttpStatus.CREATED)
  @ApiProperty({ enum: ['ADMIN', 'BUYER', 'REALTOR'] })
  async signup(
    @Body() payload: UserAuthPayload,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!payload.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${payload.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        payload.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(payload, userType);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() payload: UserSigninPayload) {
    return this.authService.signin(payload);
  }

  @Post('/key')
  @HttpCode(HttpStatus.CREATED)
  generateProductKey(@Body() payload: GenerateProductKeyPayload) {
    return this.authService.generateProductKey(payload.email, payload.userType);
  }
}
