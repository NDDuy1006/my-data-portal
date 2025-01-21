import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomJwtGuard } from './auth/guards/CustomJwtGuard';
import { GetUser } from './auth/decorators/GetUser';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { ResolvedUser } from './auth/dtos/ResolvedUserDto';
import { UserUpdatePayload } from './auth/dtos/UserUpdatePayload';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CustomJwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(CustomJwtGuard)
  @Put(':id')
  updateUser(
    @GetUser('id') user: ResolvedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UserUpdatePayload,
  ) {
    return this.userService.update(id, user, payload);
  }
}
