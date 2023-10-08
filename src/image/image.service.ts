import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private readonly prismaService: PrismaService) {}

  async getImages() {
    const images = await this.prismaService.image.findMany({});

    return images;
  }
}
