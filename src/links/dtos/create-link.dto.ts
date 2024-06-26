import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsUrl({}, { message: 'La URL es invalida' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
