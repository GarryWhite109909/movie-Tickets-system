import { Injectable } from '@nestjs/common'
import { DbService } from '../utils/db.service'
import * as fs from 'fs'
import * as path from 'path'

let cachedUploads: string[] | null = null

function getUploads(): string[] {
  if (cachedUploads) return cachedUploads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  try {
    const files = fs.readdirSync(uploadsDir)
    cachedUploads = files
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort()
    return cachedUploads
  } catch {
    cachedUploads = []
    return cachedUploads
  }
}

function fileExistsForPublicPath(p: string): boolean {
  if (!p.startsWith('/')) return false
  const fsPath = path.join(process.cwd(), 'public', p.slice(1))
  try {
    return fs.existsSync(fsPath)
  } catch {
    return false
  }
}

function pickFallbackPoster(seed: string): string | null {
  const uploads = getUploads()
  if (uploads.length === 0) return null
  let acc = 0
  for (let i = 0; i < seed.length; i++) acc = (acc * 31 + seed.charCodeAt(i)) >>> 0
  const idx = acc % uploads.length
  return `/uploads/${uploads[idx]}`
}

function normalizePoster(poster: unknown, seed: string): string {
  if (typeof poster === 'string') {
    const trimmed = poster.trim()
    if (trimmed.length > 0) {
      if (!trimmed.startsWith('/')) return trimmed
      if (fileExistsForPublicPath(trimmed)) return trimmed
    }
  }
  return pickFallbackPoster(seed) || ''
}

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
      "SELECT film.filmId, film.filmName, (SELECT url FROM posterimg WHERE filmId = film.filmId LIMIT 1) as poster, COUNT(booking.id) AS tickets, IFNULL(SUM(arrange.price),0) AS revenue FROM booking JOIN arrange ON booking.arrangeId=arrange.arrangeId JOIN film ON film.filmId=booking.filmId WHERE booking.deletedAt IS NULL AND arrange.deletedAt IS NULL AND film.deletedAt IS NULL"
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
      poster: normalizePoster(r.poster, String(r.filmId || r.filmName || '0')),
      tickets: Number(r.tickets || 0),
      revenue: r.revenue
    }))
    return { code: 1, msg: 'ok', data }
  }
}
