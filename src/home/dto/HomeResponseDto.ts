import { PropertyType } from '@prisma/client';

export class HomeResponseDto {
  id: number;
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  listedDate: Date;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  createdAt: Date;
  updatedAt: Date;
  realtorId: number;
}
