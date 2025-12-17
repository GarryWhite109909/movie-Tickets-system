import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';

@Injectable()
export class FilmService {
  constructor(private readonly db: DbService) {}

  async findAll() {
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
        (SELECT url FROM posterimg WHERE filmId = f.filmId LIMIT 1) as poster,
        (
          SELECT GROUP_CONCAT(DISTINCT fc.className SEPARATOR ',')
          FROM filmtoclass ftc
          JOIN filmclass fc ON fc.classId = ftc.classId
          WHERE ftc.filmId = f.filmId
        ) as genres,
        (
          SELECT GROUP_CONCAT(DISTINCT fa.areaName SEPARATOR ',')
          FROM filmtoarea fta
          JOIN filmarea fa ON fa.areaId = fta.areaId
          WHERE fta.filmId = f.filmId
        ) as areas
      FROM film f
      WHERE f.deletedAt IS NULL
      ORDER BY f.createdAt DESC
    `;
    const films = await this.db.query(sql);
    
    return films.map(film => ({
      ...film,
      // filmId will be automatically serialized to string via global BigInt.toJSON
      poster: film.poster || '/default-poster.jpg',
      genres: typeof film.genres === 'string' && film.genres.length > 0 ? film.genres.split(',') : [],
      areas: typeof film.areas === 'string' && film.areas.length > 0 ? film.areas.split(',') : [],
    }));
  }

  async getFilmById(id: number) {
    const sql = `
      SELECT
        f.*, 
        (SELECT url FROM posterimg WHERE filmId = f.filmId LIMIT 1) as poster,
        (
          SELECT GROUP_CONCAT(DISTINCT fc.className SEPARATOR ',')
          FROM filmtoclass ftc
          JOIN filmclass fc ON fc.classId = ftc.classId
          WHERE ftc.filmId = f.filmId
        ) as genres,
        (
          SELECT GROUP_CONCAT(DISTINCT fa.areaName SEPARATOR ',')
          FROM filmtoarea fta
          JOIN filmarea fa ON fa.areaId = fta.areaId
          WHERE fta.filmId = f.filmId
        ) as areas
      FROM film f
      WHERE f.filmId = ?
    `;
    const rows = await this.db.query(sql, [id]);
    if (rows.length === 0) return null;
    
    const film = rows[0];
    
    return {
      ...film,
      // filmId handled by global serializer
      poster: film.poster || null,
      genres: typeof film.genres === 'string' && film.genres.length > 0 ? film.genres.split(',') : [],
      areas: typeof film.areas === 'string' && film.areas.length > 0 ? film.areas.split(',') : [],
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
    return film;
  }
}
