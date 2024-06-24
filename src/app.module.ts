import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_PIPE } from '@nestjs/core';
import { LinksService } from './links/links.service';
import { LinksController } from './links/links.controller';

@Module({
  imports: [],
  controllers: [AppController, LinksController],
  providers: [
    LinksService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
