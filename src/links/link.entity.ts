import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  originalUrl: string;

  @Column({ unique: true })
  maskedUrl: string;

  @Column({ default: 0 })
  count: number;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: true })
  isValid: boolean;
}
