import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async createLink(
    originalUrl: string,
    password?: string,
    expiresAt?: Date,
  ): Promise<Link> {
    const maskedUrl = uuidv4().slice(0, 5);
    const link = await this.linkRepository.findOneBy({ originalUrl });
    if (link) {
      throw new NotFoundException('Link duplicated');
    }
    const newLink = this.linkRepository.create({
      originalUrl,
      maskedUrl,
      password,
      expiresAt,
    });
    return this.linkRepository.save(newLink);
  }

  async getLink(maskedUrl: string): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: {
        maskedUrl,
        isValid: true,
      },
    });
    if (!link || (link.expiresAt && link.expiresAt < new Date())) {
      throw new NotFoundException('Link not found or expired');
    }
    link.count += 1;
    await this.linkRepository.save(link);
    return link;
  }

  async getLinkStats(maskedUrl: string): Promise<{ count: number }> {
    const link = await this.linkRepository.findOne({ where: { maskedUrl } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return { count: link.count };
  }

  async invalidateLink(maskedUrl: string): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { maskedUrl, isValid: true },
    });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    if (!link.isValid) {
      throw new NotFoundException('Link invalid');
    }
    if (link.expiresAt < new Date()) {
      throw new NotFoundException('Link expired');
    }
    link.isValid = false;
    await this.linkRepository.save(link);
  }
}
