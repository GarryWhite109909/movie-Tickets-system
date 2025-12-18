import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';
import * as fs from 'fs';
import * as path from 'path';

let cachedUploads: string[] | null = null;

function getUploads(): string[] {
  if (cachedUploads) return cachedUploads;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    const files = fs.readdirSync(uploadsDir);
    cachedUploads = files
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort();
    return cachedUploads;
  } catch {
    cachedUploads = [];
    return cachedUploads;
  }
}

function fileExistsForPublicPath(p: string): boolean {
  if (!p.startsWith('/')) return false;
  const fsPath = path.join(process.cwd(), 'public', p.slice(1));
  try {
    return fs.existsSync(fsPath);
  } catch {
    return false;
  }
}

function pickFallbackPoster(seed: string): string | null {
  const uploads = getUploads();
  if (uploads.length === 0) return null;
  let acc = 0;
  for (let i = 0; i < seed.length; i++) acc = (acc * 31 + seed.charCodeAt(i)) >>> 0;
  const idx = acc % uploads.length;
  return `/uploads/${uploads[idx]}`;
}

function normalizePoster(poster: unknown, seed: string): string | null {
  if (typeof poster === 'string') {
    const trimmed = poster.trim();
    if (trimmed.length > 0) {
      if (!trimmed.startsWith('/')) return trimmed;
      if (fileExistsForPublicPath(trimmed)) return trimmed;
    }
  }
  return pickFallbackPoster(seed);
}

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
      poster: normalizePoster(film.poster, String(film.filmId)) || '',
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
      poster: normalizePoster(film.poster, String(film.filmId ?? id)),
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
