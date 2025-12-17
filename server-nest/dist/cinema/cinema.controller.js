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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinemaController = void 0;
const common_1 = require("@nestjs/common");
const cinema_service_1 = require("./cinema.service");
let CinemaController = class CinemaController {
    constructor(cinemaService) {
        this.cinemaService = cinemaService;
    }
    async getRooms() {
        const data = await this.cinemaService.findAll();
        return { code: 1, msg: 'ok', data };
    }
    async createRoom(body) {
        const data = await this.cinemaService.create(body);
        return { code: 1, msg: 'ok', data };
    }
    async updateRoom(id, body) {
        const data = await this.cinemaService.update(Number(id), body);
        return { code: 1, msg: 'ok', data };
    }
    async deleteRoom(id) {
        const data = await this.cinemaService.delete(Number(id));
        return { code: 1, msg: 'ok', data };
    }
};
exports.CinemaController = CinemaController;
__decorate([
    (0, common_1.Get)('room/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CinemaController.prototype, "getRooms", null);
__decorate([
    (0, common_1.Post)('room'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CinemaController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Put)('room/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CinemaController.prototype, "updateRoom", null);
__decorate([
    (0, common_1.Delete)('room/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CinemaController.prototype, "deleteRoom", null);
exports.CinemaController = CinemaController = __decorate([
    (0, common_1.Controller)('cinema'),
    __metadata("design:paramtypes", [cinema_service_1.CinemaService])
], CinemaController);
//# sourceMappingURL=cinema.controller.js.map