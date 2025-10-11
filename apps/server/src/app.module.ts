import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './auth';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule.forRoot({ auth })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
