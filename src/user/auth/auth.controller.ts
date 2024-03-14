import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserAuthPayload,
  GenerateProductKeyPayload,
  UserSigninPayload,
  UserGoogleSigninPayload,
} from './dtos/UserAuthPayload';
import { User, UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CustomJwtGuard } from './guards/CustomJwtGuard';
import { GetUser } from './decorators/GetUser';
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

  @Post('/sigin/google')
  @HttpCode(HttpStatus.OK)
  googleSignin(@Body() payload: UserGoogleSigninPayload) {
    return this.authService.googleSignin(payload);
  }

  @UseGuards(CustomJwtGuard)
  @Get('/refresh')
  refreshToken(@GetUser() user: User) {
    const userId = user.id;
    const email = user.email;
    return this.authService.renewTokens(userId, email);
  }

  @Post('/key')
  @HttpCode(HttpStatus.CREATED)
  generateProductKey(@Body() payload: GenerateProductKeyPayload) {
    return this.authService.generateProductKey(payload.email, payload.userType);
  }
}
