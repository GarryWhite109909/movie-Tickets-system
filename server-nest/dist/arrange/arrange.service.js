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
exports.ArrangeService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../utils/db.service");
let ArrangeService = class ArrangeService {
    constructor(db) {
        this.db = db;
    }
    async getArrangesByFilmId(filmId, date) {
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
        const params = [filmId];
        if (date) {
            sql += ` AND a.date = ?`;
            params.push(date);
        }
        else {
            sql += ` AND a.date >= CURRENT_DATE()`;
        }
        sql += ` ORDER BY a.date ASC, a.start ASC`;
        const arranges = await this.db.query(sql, params);
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
    async getFilmArrangeDates(filmId) {
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
    async getArrangeById(id) {
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
        if (rows.length === 0)
            return null;
        const arrange = rows[0];
        const bookedSql = `
      SELECT \`row\`, \`col\` 
      FROM booking 
      WHERE arrangeId = ? AND deletedAt IS NULL
    `;
        const bookedSeats = await this.db.query(bookedSql, [id]);
        return {
            ...arrange,
            date: new Date(arrange.date).toLocaleDateString(),
            bookedSeats: bookedSeats.map(b => [b.row, b.col])
        };
    }
};
exports.ArrangeService = ArrangeService;
exports.ArrangeService = ArrangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], ArrangeService);
//# sourceMappingURL=arrange.service.js.map