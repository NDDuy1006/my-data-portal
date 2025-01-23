import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';

export class SearchQueryPayload {
  @ApiPropertyOptional({
    description: 'City',
    example: 'London',
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'Propery type',
    example: 'RESIDENTIAL',
    enum: ['RESIDENTIAL', 'CONDO'],
  })
  propertyType?: PropertyType;

  @ApiPropertyOptional({
    description: 'Minimum proce',
    example: '300000',
  })
  minPrice?: string;

  @ApiPropertyOptional({
    description: 'Maximum proce',
    example: '700000',
  })
  maxPrice?: string;
}
