import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
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
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register with User Type',
    description: 'Product key is needed to register as a Realtor',
  })
  @ApiParam({
    name: 'userType',
    example: 'BUYER',
    enum: ['REALTOR', 'BUYER'],
    description: 'The type of user (REALTOR or BUYER)',
    required: true,
  })
  async signup(
    @Body() payload: UserAuthPayload,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!payload.productKey) {
        throw new HttpException(
          'productKey is missing',
          HttpStatus.BAD_REQUEST,
        );
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
  @ApiOperation({
    summary: 'Signin',
  })
  @HttpCode(HttpStatus.OK)
  signin(@Body() payload: UserSigninPayload) {
    return this.authService.signin(payload);
  }

  @Post('/sigin/google')
  @ApiOperation({
    summary: 'Signin with Google',
  })
  @HttpCode(HttpStatus.OK)
  googleSignin(@Body() payload: UserGoogleSigninPayload) {
    return this.authService.googleSignin(payload);
  }

  @UseGuards(CustomJwtGuard)
  @Get('/refresh')
  @ApiOperation({
    summary: 'Refresh session',
  })
  refreshToken(@GetUser() user: User) {
    const userId = user.id;
    const email = user.email;
    return this.authService.renewTokens(userId, email);
  }

  @Post('/key')
  @ApiOperation({
    summary: 'Generate Realtor product key',
  })
  @HttpCode(HttpStatus.CREATED)
  generateProductKey(@Body() payload: GenerateProductKeyPayload) {
    return this.authService.generateProductKey(payload.email, payload.userType);
  }
}
