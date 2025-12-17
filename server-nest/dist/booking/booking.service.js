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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../utils/db.service");
const arrange_service_1 = require("../arrange/arrange.service");
const uuid_1 = require("uuid");
let BookingService = class BookingService {
    constructor(db, arrangeService) {
        this.db = db;
        this.arrangeService = arrangeService;
    }
    async createBooking(userId, arrangeId, seats) {
        if (!seats || seats.length === 0) {
            throw new common_1.BadRequestException('No seats selected');
        }
        const arrange = await this.arrangeService.getArrangeById(arrangeId);
        if (!arrange) {
            throw new common_1.BadRequestException('Arrange not found');
        }
        const placeholders = seats.map(() => '(`row` = ? AND `col` = ?)').join(' OR ');
        const params = seats.flatMap(s => [s.row, s.col]);
        const checkSql = `
      SELECT \`row\`, \`col\` FROM booking 
      WHERE arrangeId = ? AND deletedAt IS NULL AND (${placeholders})
    `;
        const existingBookings = await this.db.query(checkSql, [arrangeId, ...params]);
        if (existingBookings.length > 0) {
            const occupied = existingBookings.map(b => `${b.row}排${b.col}座`).join(', ');
            throw new common_1.BadRequestException(`Seats already booked: ${occupied}`);
        }
        const ticketCode = (0, uuid_1.v4)().substring(0, 8).toUpperCase();
        const now = new Date();
        for (const seat of seats) {
            const insertSql = `
        INSERT INTO booking 
        (userId, arrangeId, filmId, roomId, \`row\`, \`col\`, status, ticketCode, price, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
            await this.db.query(insertSql, [
                userId,
                arrangeId,
                arrange.filmId,
                arrange.roomId,
                seat.row,
                seat.col,
                'paid',
                ticketCode,
                arrange.price,
                now,
                now
            ]);
        }
        return { ticketCode, count: seats.length, price: arrange.price * seats.length };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService,
        arrange_service_1.ArrangeService])
], BookingService);
//# sourceMappingURL=booking.service.js.map