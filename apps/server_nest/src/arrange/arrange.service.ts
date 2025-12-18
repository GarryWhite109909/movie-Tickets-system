import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';

@Injectable()
export class ArrangeService {
  constructor(private readonly db: DbService) {}

  async getArrangesByFilmId(filmId: number, date?: string) {
    let sql = `
      SELECT 
        a.arrangeId,
        a.filmId,
        a.roomId,
        a.date,
        a.start,
        a.end,
        a.price,
        r.roomName,
        r.\`row\`,
        r.\`column\`,
        (SELECT COUNT(*) FROM booking b WHERE b.arrangeId = a.arrangeId AND b.deletedAt IS NULL) as bookedCount
      FROM arrange a
      JOIN filmroom r ON a.roomId = r.roomId
      WHERE a.filmId = ? AND a.deletedAt IS NULL AND r.deletedAt IS NULL
    `;
    
    const params: any[] = [filmId];
    
    if (date) {
      sql += ` AND a.date = ?`;
      params.push(date);
    } else {
      sql += ` AND a.date >= CURRENT_DATE()`;
    }

    sql += ` ORDER BY a.date ASC, a.start ASC`;

    const arranges = await this.db.query(sql, params);
    
    // Format dates and times
    return arranges.map(a => {
      const d = new Date(a.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      return {
        ...a,
        arrangeId: a.arrangeId.toString(),
        date: dateStr,
        start: a.start.toString(),
        end: a.end.toString(),
        remainingSeats: (a.row * a.column) - Number(a.bookedCount || 0)
      };
    });
  }

  async getFilmArrangeDates(filmId: number) {
    const sql = `
      SELECT DISTINCT date 
      FROM arrange 
      WHERE filmId = ? 
        AND deletedAt IS NULL 
        AND date >= CURRENT_DATE()
      ORDER BY date ASC
    `;
    const rows = await this.db.query(sql, [filmId]);
    
    return rows.map(r => {
      const d = new Date(r.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
  }

  async getArrangeById(id: number) {
    const sql = `
      SELECT 
        a.arrangeId,
        a.filmId,
        a.roomId,
        a.date,
        a.start,
        a.end,
        a.price,
        r.roomName,
        r.\`row\`,
        r.\`column\`,
        f.filmName
      FROM arrange a
      JOIN filmroom r ON a.roomId = r.roomId
      JOIN film f ON a.filmId = f.filmId
      WHERE a.arrangeId = ? AND a.deletedAt IS NULL
    `;
    const rows = await this.db.query(sql, [id]);
    if (rows.length === 0) return null;
    
    const arrange = rows[0];
    
    // Get booked seats
    // We optimized this earlier by adding row/col to booking, but we should check if they are populated.
    // If not, we fall back to seatinfo join or just use the new structure.
    // Let's use the new structure: row, col in booking.
    const bookedSql = `
      SELECT \`row\`, \`col\` 
      FROM booking 
      WHERE arrangeId = ? AND deletedAt IS NULL
    `;
    const bookedSeats = await this.db.query(bookedSql, [id]);

    return {
      ...arrange,
      // arrangeId, filmId handled by global serializer
      date: new Date(arrange.date).toLocaleDateString(),
      bookedSeats: bookedSeats.map(b => [b.row, b.col])
    };
  }
}