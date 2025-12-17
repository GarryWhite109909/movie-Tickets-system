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

    // Use transaction to ensure atomicity and data consistency
    return await this.db.$transaction(async (tx) => {
      // 1. Lock the arrange record
      // Using FOR UPDATE to prevent race conditions (concurrent bookings for same arrange)
      const arrangeRaw = await tx.$queryRawUnsafe<any[]>(
        `SELECT * FROM arrange WHERE arrangeId = ? FOR UPDATE`,
        arrangeId
      );

      if (!arrangeRaw || arrangeRaw.length === 0) {
        throw new BadRequestException('Arrange not found');
      }
      const arrange = arrangeRaw[0];

      // 2. Check seats availability
      const placeholders = seats.map(() => '(`row` = ? AND `col` = ?)').join(' OR ');
      const params = seats.flatMap(s => [s.row, s.col]);
      
      const checkSql = `
        SELECT \`row\`, \`col\` FROM booking 
        WHERE arrangeId = ? AND deletedAt IS NULL AND (${placeholders})
      `;
      
      const existingBookings = await tx.$queryRawUnsafe<any[]>(checkSql, arrangeId, ...params);
      
      if (existingBookings.length > 0) {
         const occupied = existingBookings.map(b => `${b.row}排${b.col}座`).join(', ');
         throw new BadRequestException(`Seats already booked: ${occupied}`);
      }

      // 3. Insert bookings
      const ticketCode = uuidv4().substring(0, 8).toUpperCase();
      const now = new Date();
      
      for (const seat of seats) {
        const insertSql = `
          INSERT INTO booking 
          (userId, arrangeId, filmId, roomId, \`row\`, \`col\`, status, ticketCode, price, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await tx.$queryRawUnsafe(insertSql,
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
        );
      }

      return { ticketCode, count: seats.length, price: Number(arrange.price) * seats.length };
    });
  }
}
