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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../utils/db.service");
let StatsService = class StatsService {
    constructor(db) {
        this.db = db;
    }
    async overview() {
        const [u] = await this.db.query("SELECT COUNT(*) AS c FROM user WHERE deletedAt IS NULL");
        const [f] = await this.db.query("SELECT COUNT(*) AS c FROM film WHERE deletedAt IS NULL");
        const [b] = await this.db.query("SELECT COUNT(*) AS c FROM booking WHERE deletedAt IS NULL");
        const [bt] = await this.db.query("SELECT COUNT(*) AS c FROM booking WHERE deletedAt IS NULL AND DATE(createdAt)=CURDATE()");
        const [rt] = await this.db.query("SELECT IFNULL(SUM(arrange.price),0) AS s FROM booking JOIN arrange ON booking.arrangeId=arrange.arrangeId WHERE booking.deletedAt IS NULL AND arrange.deletedAt IS NULL");
        const [rtd] = await this.db.query("SELECT IFNULL(SUM(arrange.price),0) AS s FROM booking JOIN arrange ON booking.arrangeId=arrange.arrangeId WHERE booking.deletedAt IS NULL AND arrange.deletedAt IS NULL AND DATE(booking.createdAt)=CURDATE()");
        return {
            code: 1,
            msg: 'ok',
            data: {
                userCount: Number((u === null || u === void 0 ? void 0 : u.c) || 0),
                filmCount: Number((f === null || f === void 0 ? void 0 : f.c) || 0),
                bookingCount: Number((b === null || b === void 0 ? void 0 : b.c) || 0),
                todayBookingCount: Number((bt === null || bt === void 0 ? void 0 : bt.c) || 0),
                revenueTotal: Number((rt === null || rt === void 0 ? void 0 : rt.s) || 0),
                revenueToday: Number((rtd === null || rtd === void 0 ? void 0 : rtd.s) || 0),
            },
        };
    }
    async topFilms(opts) {
        const params = [];
        let sql = "SELECT film.filmId, film.filmName, (SELECT url FROM posterimg WHERE filmId = film.filmId LIMIT 1) as poster, COUNT(booking.id) AS tickets, IFNULL(SUM(arrange.price),0) AS revenue FROM booking JOIN arrange ON booking.arrangeId=arrange.arrangeId JOIN film ON film.filmId=booking.filmId WHERE booking.deletedAt IS NULL AND arrange.deletedAt IS NULL AND film.deletedAt IS NULL";
        if (opts.from && opts.to) {
            sql += " AND booking.createdAt BETWEEN ? AND ?";
            params.push(new Date(opts.from), new Date(opts.to));
        }
        sql += " GROUP BY film.filmId, film.filmName ORDER BY tickets DESC, revenue DESC LIMIT ?";
        params.push(opts.limit || 10);
        const rows = await this.db.query(sql, params);
        const data = rows.map(r => ({
            filmId: Number(r.filmId || 0),
            filmName: r.filmName,
            poster: r.poster || '',
            tickets: Number(r.tickets || 0),
            revenue: r.revenue
        }));
        return { code: 1, msg: 'ok', data };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], StatsService);
//# sourceMappingURL=stats.service.js.map