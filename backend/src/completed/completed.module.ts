import { Module } from '@nestjs/common';
import { CompletedService } from './completed.service';
import { CompletedController } from './completed.controller';

@Module({
  controllers: [CompletedController],
  providers: [CompletedService],
})
export class CompletedModule {}
