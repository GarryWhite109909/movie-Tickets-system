import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { DbModule } from '../utils/db.module';
import { ArrangeModule } from '../arrange/arrange.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DbModule, ArrangeModule, AuthModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}