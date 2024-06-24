import { Body, Controller, Post } from '@nestjs/common';
import { CreateLinkDto } from './links/dtos/create-link.dto';
import { LinksService } from './links/links.service';

@Controller()
export class AppController {
  constructor(private readonly linksService: LinksService) {}

  @Post('create')
  createLink(@Body() createLinkDto: CreateLinkDto): {
    target: string;
    link: string;
    valid: boolean;
  } {
    const linkId = this.linksService.createLink(createLinkDto);
    return {
      target: createLinkDto.url,
      link: `http://localhost:8080/l/${linkId}`,
      valid: true,
    };
  }
}
