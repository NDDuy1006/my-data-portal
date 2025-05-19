import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UserAuthPayload,
  UserGoogleSigninPayload,
  UserSigninPayload,
} from './dtos/UserAuthPayload';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

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
        username: payload.username,
        firstname: payload.firstname,
        lastname: payload.lastname,
        phone: payload.phone,
        password: hashedPassword,
        userType: userType,
      },
    });

    return this.generateJwt(user.email, user.id);
  }

  async googleSignin(payload: UserGoogleSigninPayload) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    const preAssignedUserType = 'BUYER';

    if (userExists)
      return this.signJwtToken(
        userExists.id,
        userExists.email,
        userExists.firstname,
        userExists.lastname,
        userExists.userType,
      );

    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(generatePassword, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname,
        phone: '',
        avatarUrl: payload.avatarUrl,
        password: hashedPassword,
        userType: preAssignedUserType,
      },
    });

    return this.signJwtToken(
      user.id,
      user.email,
      user.firstname,
      user.lastname,
      user.userType,
    );
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

    return this.signJwtToken(
      user.id,
      user.email,
      user.firstname,
      user.lastname,
      user.userType,
      user.username,
    );
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
    firstname: string,
    lastname: string,
    userType: UserType,
    username?: string,
  ): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
      firstname,
      lastname,
      userType,
      username,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret: this.configService.get('JSON_TOKEN_KEY'),
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '20m',
        secret: this.configService.get('JSON_TOKEN_KEY'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '50m',
        secret: this.configService.get('JSON_TOKEN_KEY'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async renewTokens(userId: number, email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !email) throw new ForbiddenException('Access Denied');

    return this.signJwtToken(
      user.id,
      user.email,
      user.firstname,
      user.lastname,
      user.userType,
      user.username,
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
