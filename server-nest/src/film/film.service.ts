import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';

@Injectable()
export class FilmService {
  constructor(private readonly db: DbService) {}

  async findAll() {
    // Select all films and their first poster
    // Using a subquery or simplified join to avoid duplicates
    const sql = `
      SELECT 
        f.filmId,
        f.filmName,
        f.englishName,
        f.introduction,
        f.directors,
        f.performers,
        f.onTime,
        f.filmTime,
        (SELECT url FROM posterimg WHERE filmId = f.filmId LIMIT 1) as poster
      FROM film f
      WHERE f.deletedAt IS NULL
      ORDER BY f.createdAt DESC
    `;
    const films = await this.db.query(sql);
    
    return films.map(film => ({
      ...film,
      filmId: film.filmId ? film.filmId.toString() : null,
      poster: film.poster || '/default-poster.jpg' // Fallback
    }));
  }

  async getFilmById(id: number) {
    const sql = `SELECT * FROM film WHERE filmId = ? AND deletedAt IS NULL`;
    const rows = await this.db.query(sql, [id]);
    if (rows.length === 0) return null;
    
    const film = rows[0];
    // Get poster
    const posterSql = `SELECT url FROM posterimg WHERE filmId = ? LIMIT 1`;
    const posterRows = await this.db.query(posterSql, [id]);
    
    return {
      ...film,
      filmId: film.filmId.toString(),
      poster: posterRows.length > 0 ? posterRows[0].url : null
    };
  }
}
