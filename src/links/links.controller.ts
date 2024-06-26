import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Redirect,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { LinksService } from './links.service';

@Controller('l')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('create')
  async createLink(
    @Body('originalUrl') originalUrl: string,
    @Body('password') password?: string,
    @Body('expiresAt') expiresAt?: Date,
  ) {
    const link = await this.linksService.createLink(
      originalUrl,
      password,
      expiresAt,
    );
    return {
      target: originalUrl,
      link: `http://localhost:8080/l/${link.maskedUrl}`,
      valid: link.isValid,
    };
  }

  @Get(':maskedUrl')
  @Redirect()
  async redirectLink(
    @Param('maskedUrl') maskedUrl: string,
    @Query('password') password?: string,
  ) {
    const link = await this.linksService.getLink(maskedUrl);
    if (link.password && link.password !== password) {
      throw new NotFoundException('Invalid password');
    }
    return { url: link.originalUrl };
  }

  @Get(':maskedUrl/stats')
  async getLinkStats(@Param('maskedUrl') maskedUrl: string) {
    return this.linksService.getLinkStats(maskedUrl);
  }

  @Put(':maskedUrl/invalidate')
  async invalidateLink(@Param('maskedUrl') maskedUrl: string) {
    await this.linksService.invalidateLink(maskedUrl);
    return { message: 'Link invalidated' };
  }
}
