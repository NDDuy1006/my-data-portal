import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/HomeResponseDto';
import { PropertyType } from '@prisma/client';
import { HomeCreatePayload } from './payloads/HomeCreatePayload';
import { HomeUpdatePayload } from './payloads/HomeUpdatePayload';
import { GetUser } from '../user/auth/decorators/GetUser';
import { CustomJwtGuard } from '../user/auth/guards/CustomJwtGuard';
import { ResolvedUser } from 'src/user/auth/dtos/ResolvedUserDto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('homes')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve homes by filters',
  })
  getHomes(
    @Query('city') city?: string,
    @Query('propertyType') propertyType?: PropertyType,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getAll(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve single home by ID',
  })
  getHomeById(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getSingleById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CustomJwtGuard)
  @ApiOperation({
    summary: 'Create a home',
  })
  createHome(
    @Body() homeCreatePayload: HomeCreatePayload,
    @GetUser('id') user: ResolvedUser,
  ) {
    return this.homeService.create(user, homeCreatePayload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CustomJwtGuard)
  @ApiOperation({
    summary: 'Update a home by ID',
  })
  updateHome(
    @GetUser('id') user: ResolvedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: HomeUpdatePayload,
  ) {
    return this.homeService.updateSingleById(user, id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.GONE)
  @UseGuards(CustomJwtGuard)
  @ApiOperation({
    summary: 'Delete a home by ID',
  })
  deleteHomeById(
    @GetUser('id') user: ResolvedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.homeService.deleteSingleById(user, id);
  }
}

/* >>>> NOTE >>>>
  `...(city && { city })`: if city is not undefined, destructure it into the filter object

  same thing happened with propertyType
*/
