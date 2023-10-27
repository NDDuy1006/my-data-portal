import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategy/jwtStrategy';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, JwtStrategy],
})
export class UserModule {}
