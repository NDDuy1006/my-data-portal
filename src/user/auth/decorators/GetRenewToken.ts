import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ResolvedUser } from '../dtos/ResolvedUserDto';

export const GetRenewToken = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ResolvedUser = request.user;
    return user;
  },
);
