import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, SigninDto } from './dtos/AuthDto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(authDto: AuthDto, userType: UserType) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (userExists) throw new ConflictException('This email already exists');

    const hashedPassword = await bcrypt.hash(authDto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        firstname: authDto.firstname,
        lastname: authDto.lastname,
        phone: authDto.phone,
        password: hashedPassword,
        userType: userType,
      },
    });

    return this.generateJwt(user.email, user.id);
  }

  async signin(signinDto: SigninDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });

    if (!user) throw new HttpException('Invalid credentials', 400);

    const hashedPassword = user.password;

    const isValidPassword = await bcrypt.compare(
      signinDto.password,
      hashedPassword,
    );

    if (!isValidPassword) throw new HttpException('Invalid credentials', 400);

    return this.generateJwt(user.email, user.id);
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

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
