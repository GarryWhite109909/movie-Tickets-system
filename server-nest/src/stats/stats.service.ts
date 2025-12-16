import { Injectable } from '@nestjs/common'
import { DbService } from '../utils/db.service'

@Injectable()
export class StatsService {
  constructor(private readonly db: DbService) {}

  async overview() {
    const [u] = await this.db.query<{ c: any }>("SELECT COUNT(*) AS c FROM user WHERE deletedAt IS NULL")
    const [f] = await this.db.query<{ c: any }>("SELECT COUNT(*) AS c FROM film WHERE deletedAt IS NULL")
    const [b] = await this.db.query<{ c: any }>("SELECT COUNT(*) AS c FROM booking WHERE deletedAt IS NULL")
    const [bt] = await this.db.query<{ c: any }>("SELECT COUNT(*) AS c FROM booking WHERE deletedAt IS NULL AND DATE(createdAt)=CURDATE()")
    const [rt] = await this.db.query<{ s: number }>("SELECT IFNULL(SUM(arrange.price),0) AS s FROM booking JOIN arrange ON booking.arrangeId=arrange.arrangeId WHERE booking.deletedAt IS NULL AND arrange.deletedAt IS NULL")
    const [rtd] = await this.db.query<{ s: number }>("SELECT IFNULL(SUM(arrange.price),0) AS s FROM booking JOIN arrange ON booking.arrangeId=arrange.arrangeId WHERE booking.deletedAt IS NULL AND arrange.deletedAt IS NULL AND DATE(booking.createdAt)=CURDATE()")
    return {
      code: 1,
      msg: 'ok',
      data: {
        userCount: Number(u?.c || 0),
        filmCount: Number(f?.c || 0),
        bookingCount: Number(b?.c || 0),
        todayBookingCount: Number(bt?.c || 0),
        revenueTotal: Number(rt?.s || 0),
        revenueToday: Number(rtd?.s || 0),
      },
    }
  }

  async topFilms(opts: { from?: string; to?: string; limit?: number }) {
    const params: any[] = []
    let sql =
      "SELECT film.filmId, film.filmName, COUNT(booking.id) AS tickets, IFNULL(SUM(arrange.price),0) AS revenue FROM booking JOIN arrange ON booking.arrangeId=arrange.arrangeId JOIN film ON film.filmId=booking.filmId WHERE booking.deletedAt IS NULL AND arrange.deletedAt IS NULL AND film.deletedAt IS NULL"
    if (opts.from && opts.to) {
      sql += " AND booking.createdAt BETWEEN ? AND ?"
      params.push(new Date(opts.from), new Date(opts.to))
    }
    sql += " GROUP BY film.filmId, film.filmName ORDER BY tickets DESC, revenue DESC LIMIT ?"
    params.push(opts.limit || 10)
    const rows: any[] = await this.db.query(sql, params)
    const data = rows.map(r => ({
      filmId: Number(r.filmId || 0),
      filmName: r.filmName,
      tickets: Number(r.tickets || 0),
      revenue: r.revenue
    }))
    return { code: 1, msg: 'ok', data }
  }
}
