import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, GenerateProductKeyDto, SigninDto } from './dtos/AuthDto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  async signup(
    @Body() dto: AuthDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!dto.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${dto.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        dto.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(dto, userType);
  }

  @Post('/signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('/key')
  generateProductKey(@Body() dto: GenerateProductKeyDto) {
    return this.authService.generateProductKey(dto.email, dto.userType);
  }
}
