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
exports.ArrangeController = void 0;
const common_1 = require("@nestjs/common");
const arrange_service_1 = require("./arrange.service");
let ArrangeController = class ArrangeController {
    constructor(arrangeService) {
        this.arrangeService = arrangeService;
    }
    async getByFilm(id, date) {
        const data = await this.arrangeService.getArrangesByFilmId(Number(id), date);
        return { code: 1, msg: 'ok', data };
    }
    async getDates(id) {
        const data = await this.arrangeService.getFilmArrangeDates(Number(id));
        return { code: 1, msg: 'ok', data };
    }
    async getOne(id) {
        const data = await this.arrangeService.getArrangeById(Number(id));
        return { code: 1, msg: 'ok', data };
    }
};
exports.ArrangeController = ArrangeController;
__decorate([
    (0, common_1.Get)('film/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ArrangeController.prototype, "getByFilm", null);
__decorate([
    (0, common_1.Get)('film/:id/dates'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArrangeController.prototype, "getDates", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArrangeController.prototype, "getOne", null);
exports.ArrangeController = ArrangeController = __decorate([
    (0, common_1.Controller)('arrange'),
    __metadata("design:paramtypes", [arrange_service_1.ArrangeService])
], ArrangeController);
//# sourceMappingURL=arrange.controller.js.map