import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateLinkDto } from './dtos/create-link.dto';

@Injectable()
export class LinksService {
  private links: Map<
    string,
    {
      url: string;
      password?: string;
      expirationDate?: Date;
      redirectCount: number;
    }
  > = new Map();

  createLink(createLinkDto: CreateLinkDto): string {
    const linkId = uuidv4().slice(0, 5);
    this.links.set(linkId, {
      url: createLinkDto.url,
      password: createLinkDto.password,
      expirationDate: createLinkDto.expirationDate
        ? new Date(createLinkDto.expirationDate)
        : undefined,
      redirectCount: 0,
    });
    return linkId;
  }

  getOriginalUrl(linkId: string, password?: string): string {
    const link = this.links.get(linkId);
    if (!link || (link.password && link.password !== password)) {
      throw new NotFoundException('Link invalido');
    }
    if (link.expirationDate && link.expirationDate <= new Date()) {
      throw new NotFoundException('Link expirado');
    }
    link.redirectCount++;
    return link.url;
  }

  getRedirectCount(linkId: string): number {
    const link = this.links.get(linkId);
    if (!link) {
      throw new NotFoundException('Link invalido');
    }
    return link.redirectCount;
  }

  invalidateLink(linkId: string): boolean {
    return this.links.delete(linkId);
  }
}
