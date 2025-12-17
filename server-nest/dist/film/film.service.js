"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../utils/db.service");
let FilmService = class FilmService {
    constructor(db) {
        this.db = db;
    }
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
            poster: film.poster || '/default-poster.jpg',
            genres: typeof film.genres === 'string' && film.genres.length > 0 ? film.genres.split(',') : [],
            areas: typeof film.areas === 'string' && film.areas.length > 0 ? film.areas.split(',') : [],
        }));
    }
    async getFilmById(id) {
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
        if (rows.length === 0)
            return null;
        const film = rows[0];
        return {
            ...film,
            poster: film.poster || null,
            genres: typeof film.genres === 'string' && film.genres.length > 0 ? film.genres.split(',') : [],
            areas: typeof film.areas === 'string' && film.areas.length > 0 ? film.areas.split(',') : [],
        };
    }
    async create(data) {
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
    async update(id, data) {
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
            const existingPoster = await this.db.posterimg.findFirst({ where: { filmId: BigInt(id) } });
            if (existingPoster) {
                await this.db.posterimg.update({
                    where: { posterId: existingPoster.posterId },
                    data: { url: poster, updatedAt: new Date() }
                });
            }
            else {
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
    async delete(id) {
        const film = await this.db.film.update({
            where: { filmId: BigInt(id) },
            data: { deletedAt: new Date() }
        });
        return film;
    }
};
exports.FilmService = FilmService;
exports.FilmService = FilmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], FilmService);
//# sourceMappingURL=film.service.js.map