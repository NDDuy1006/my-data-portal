import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/HomeResponseDto';
import { PropertyType, UserType } from '@prisma/client';
import { HomeCreatePayload } from './payloads/HomeCreatePayload';
import { HomeUpdatePayload } from './payloads/HomeUpdatePayload';
import { ResolvedUser } from 'src/user/auth/dtos/ResolvedUserDto';

interface FilterParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(filter: FilterParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        numberOfBedrooms: true,
        numberOfBathrooms: true,
        city: true,
        listedDate: true,
        price: true,
        landSize: true,
        propertyType: true,
        createdAt: true,
        updatedAt: true,
        realtorId: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filter,
    });

    if (!homes.length) throw new NotFoundException();

    return homes.map((item) => {
      const fetchedHome = { ...item, image: item.images[0].url };
      delete fetchedHome.images;
      return fetchedHome;
    });
  }

  async getSingleById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        address: true,
        numberOfBedrooms: true,
        numberOfBathrooms: true,
        city: true,
        listedDate: true,
        price: true,
        landSize: true,
        propertyType: true,
        createdAt: true,
        updatedAt: true,
        realtorId: true,
        realtor: {
          select: {
            firstname: true,
            lastname: true,
            phone: true,
            userType: true,
            email: true,
          },
        },
        images: true,
      },
    });

    if (!home) throw new NotFoundException();

    return home;
  }

  async create(user: ResolvedUser, payload: HomeCreatePayload) {
    const realtor = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
    });

    const isRealtor = realtor.userType === UserType.REALTOR;

    if (!isRealtor) throw new BadRequestException('Not authorized');

    const home = await this.prismaService.home.create({
      data: {
        address: payload.address,
        city: payload.city,
        numberOfBedrooms: payload.numberOfBedrooms,
        numberOfBathrooms: payload.numberOfBathrooms,
        price: payload.price,
        landSize: payload.landSize,
        propertyType: payload.propertyType,
        realtorId: user.id,
      },
    });

    const homeImages = payload.images.map((image) => {
      return { ...image, homeId: home.id };
    });

    await this.prismaService.image.createMany({ data: homeImages });

    return home;
  }

  async updateSingleById(
    user: ResolvedUser,
    id: number,
    payload: HomeUpdatePayload,
  ) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
        realtorId: user.id,
      },
    });

    if (!home) throw new NotFoundException();

    return this.prismaService.home.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
  }

  async deleteSingleById(user: ResolvedUser, id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
        realtorId: user.id,
      },
    });

    if (!home) throw new NotFoundException();

    await this.prismaService.image.deleteMany({
      where: {
        homeId: id,
      },
    });

    await this.prismaService.home.delete({
      where: {
        id,
      },
    });

    return 'Deleted successfully';
  }
}
