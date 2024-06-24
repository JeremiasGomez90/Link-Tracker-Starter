import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsUrl({}, { message: 'La URL es invalida' })
  url: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
