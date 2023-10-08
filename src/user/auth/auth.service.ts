import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAuthPayload, UserSigninPayload } from './dtos/UserAuthPayload';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(payload: UserAuthPayload, userType: UserType) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (userExists) throw new ConflictException('This email already exists');

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname,
        phone: payload.phone,
        password: hashedPassword,
        userType: userType,
      },
    });

    return this.generateJwt(user.email, user.id);
  }

  async signin(payload: UserSigninPayload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) throw new HttpException('Invalid credentials', 400);

    const hashedPassword = user.password;

    const isValidPassword = await bcrypt.compare(
      payload.password,
      hashedPassword,
    );

    if (!isValidPassword) throw new HttpException('Invalid credentials', 400);

    return this.signJwtToken(user.id, user.email);
  }

  private generateJwt(email: string, id: number) {
    return jwt.sign(
      {
        email: email,
        id: id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 36000,
      },
    );
  }

  private async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret: this.configService.get('JSON_TOKEN_KEY'),
    });

    return {
      accessToken: jwtString,
    };
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
