import { Controller, Get } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @Get()
  getImages() {
    return this.imageService.getImages();
  }
}
