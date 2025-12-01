import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { SeekersController } from './seekers.controller';
import { SeekersService } from './seekers.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SeekersController],
  providers: [SeekersService],
  exports: [SeekersService],
})
export class SeekersModule {}
