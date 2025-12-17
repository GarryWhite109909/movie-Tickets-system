import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from '../utils/db.service';
import { ArrangeService } from '../arrange/arrange.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingService {
  constructor(
    private readonly db: DbService,
    private readonly arrangeService: ArrangeService
  ) {}

  async createBooking(userId: number, arrangeId: number, seats: { row: number, col: number }[]) {
    if (!seats || seats.length === 0) {
      throw new BadRequestException('No seats selected');
    }

    // 1. Check arrange exists
    const arrange = await this.arrangeService.getArrangeById(arrangeId);
    if (!arrange) {
      throw new BadRequestException('Arrange not found');
    }

    // 2. Check seats availability
    // Simple check: query if any of these seats are already booked
    const placeholders = seats.map(() => '(`row` = ? AND `col` = ?)').join(' OR ');
    const params = seats.flatMap(s => [s.row, s.col]);
    
    const checkSql = `
      SELECT \`row\`, \`col\` FROM booking 
      WHERE arrangeId = ? AND deletedAt IS NULL AND (${placeholders})
    `;
    
    const existingBookings = await this.db.query(checkSql, [arrangeId, ...params]);
    if (existingBookings.length > 0) {
       const occupied = existingBookings.map(b => `${b.row}排${b.col}座`).join(', ');
       throw new BadRequestException(`Seats already booked: ${occupied}`);
    }

    // 3. Insert bookings
    const ticketCode = uuidv4().substring(0, 8).toUpperCase();
    const now = new Date();
    
    // We insert each seat as a separate booking record (as per schema structure usually)
    // Or maybe one booking with multiple seats? The schema has row/col, so it implies one row per seat.
    
    for (const seat of seats) {
      const insertSql = `
        INSERT INTO booking 
        (userId, arrangeId, filmId, roomId, \`row\`, \`col\`, status, ticketCode, price, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await this.db.query(insertSql, [
        userId, 
        arrangeId, 
        arrange.filmId, 
        arrange.roomId, 
        seat.row, 
        seat.col, 
        'paid', // Mock payment success
        ticketCode,
        arrange.price,
        now,
        now
      ]);
    }

    return { ticketCode, count: seats.length, price: arrange.price * seats.length };
  }
}