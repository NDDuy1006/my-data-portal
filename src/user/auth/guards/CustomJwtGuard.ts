import { AuthGuard } from '@nestjs/passport';

export class CustomJwtGuard extends AuthGuard('jwt') {}
