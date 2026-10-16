import { Module } from '@nestjs/common';
import { ToppingsController } from './toppings.controller';
import { ToppingsService } from './toppings.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ToppingsController],
  providers: [ToppingsService],
  exports: [ToppingsService],
})
export class ToppingsModule {}
