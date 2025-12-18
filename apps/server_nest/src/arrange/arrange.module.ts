import { Module } from '@nestjs/common';
import { ArrangeController } from './arrange.controller';
import { ArrangeService } from './arrange.service';
import { DbModule } from '../utils/db.module';

@Module({
  imports: [DbModule],
  controllers: [ArrangeController],
  providers: [ArrangeService],
  exports: [ArrangeService],
})
export class ArrangeModule {}