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

  async create(data: any) {
    const { poster, ...rest } = data;
    const film = await this.db.film.create({
      data: {
        filmName: rest.filmName,
        englishName: rest.englishName,
        introduction: rest.introduction,
        directors: rest.directors,
        performers: rest.performers,
        filmTime: rest.filmTime,
        onTime: rest.onTime ? new Date(rest.onTime) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        posterimg: poster ? {
          create: {
            url: poster,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        } : undefined
      }
    });
    return { ...film, filmId: film.filmId.toString() };
  }

  async update(id: number, data: any) {
    const { poster, ...rest } = data;
    const film = await this.db.film.update({
      where: { filmId: BigInt(id) },
      data: {
        filmName: rest.filmName,
        englishName: rest.englishName,
        introduction: rest.introduction,
        directors: rest.directors,
        performers: rest.performers,
        filmTime: rest.filmTime,
        onTime: rest.onTime ? new Date(rest.onTime) : undefined,
        updatedAt: new Date(),
      }
    });
    
    if (poster) {
       const existingPoster = await this.db.posterimg.findFirst({ where: { filmId: BigInt(id) }});
       if (existingPoster) {
         await this.db.posterimg.update({
            where: { posterId: existingPoster.posterId },
            data: { url: poster, updatedAt: new Date() }
         });
       } else {
         await this.db.posterimg.create({
            data: {
               filmId: BigInt(id),
               url: poster,
               createdAt: new Date(),
               updatedAt: new Date()
            }
         });
       }
    }

    return { ...film, filmId: film.filmId.toString() };
  }

  async delete(id: number) {
    const film = await this.db.film.update({
      where: { filmId: BigInt(id) },
      data: { deletedAt: new Date() }
    });
    return { ...film, filmId: film.filmId.toString() };
  }
}
