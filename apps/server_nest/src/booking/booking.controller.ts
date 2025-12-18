import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() body: { arrangeId: number, seats: { row: number, col: number }[] }) {
    // userId comes from AuthGuard -> req.user
    const userId = req.user.userId; 
    const data = await this.bookingService.createBooking(userId, body.arrangeId, body.seats);
    return { code: 1, msg: 'ok', data };
  }
}