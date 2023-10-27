import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomJwtGuard } from './auth/guards/CustomJwtGuard';
import { GetUser } from './auth/decorators/GetUser';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  @UseGuards(CustomJwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
