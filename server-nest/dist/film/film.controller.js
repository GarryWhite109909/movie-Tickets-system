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
exports.FilmController = void 0;
const common_1 = require("@nestjs/common");
const film_service_1 = require("./film.service");
let FilmController = class FilmController {
    constructor(filmService) {
        this.filmService = filmService;
    }
    async getAll() {
        const films = await this.filmService.findAll();
        return { code: 1, msg: 'ok', data: films };
    }
    async getOne(id) {
        const film = await this.filmService.getFilmById(Number(id));
        return { code: 1, msg: 'ok', data: film };
    }
    async create(body) {
        const res = await this.filmService.create(body);
        return { code: 1, msg: 'ok', data: res };
    }
    async update(id, body) {
        const res = await this.filmService.update(Number(id), body);
        return { code: 1, msg: 'ok', data: res };
    }
    async delete(id) {
        const res = await this.filmService.delete(Number(id));
        return { code: 1, msg: 'ok', data: res };
    }
};
exports.FilmController = FilmController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "delete", null);
exports.FilmController = FilmController = __decorate([
    (0, common_1.Controller)('film'),
    __metadata("design:paramtypes", [film_service_1.FilmService])
], FilmController);
//# sourceMappingURL=film.controller.js.map