import { Controller, Get, Param, Redirect, Put, Query } from '@nestjs/common';
import { LinksService } from './links.service';

@Controller('l')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}
  @Get(':linkId')
  @Redirect('', 302)
  redirectToOriginalUrl(
    @Param('linkId') linkId: string,
    @Query('password') password?: string,
  ) {
    const originalUrl = this.linksService.getOriginalUrl(linkId, password);
    return { url: originalUrl };
  }

  @Get(':linkId/stats')
  getRedirectCount(@Param('linkId') linkId: string): { redirectCount: number } {
    const redirectCount = this.linksService.getRedirectCount(linkId);
    return { redirectCount };
  }

  @Put(':linkId/invalidate')
  invalidateLink(@Param('linkId') linkId: string): { invalidated: boolean } {
    const invalidated = this.linksService.invalidateLink(linkId);
    return { invalidated };
  }
}
