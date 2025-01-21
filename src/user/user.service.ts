import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserUpdatePayload } from './auth/dtos/UserUpdatePayload';
import { ResolvedUser } from './auth/dtos/ResolvedUserDto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(id: number, user: ResolvedUser, payload: UserUpdatePayload) {
    const targetedUser = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (id !== user.id) throw new ForbiddenException();

    if (!targetedUser) throw new NotFoundException();

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
  }
}
