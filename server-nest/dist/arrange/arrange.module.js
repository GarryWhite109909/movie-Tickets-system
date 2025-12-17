"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrangeModule = void 0;
const common_1 = require("@nestjs/common");
const arrange_controller_1 = require("./arrange.controller");
const arrange_service_1 = require("./arrange.service");
const db_module_1 = require("../utils/db.module");
let ArrangeModule = class ArrangeModule {
};
exports.ArrangeModule = ArrangeModule;
exports.ArrangeModule = ArrangeModule = __decorate([
    (0, common_1.Module)({
        imports: [db_module_1.DbModule],
        controllers: [arrange_controller_1.ArrangeController],
        providers: [arrange_service_1.ArrangeService],
        exports: [arrange_service_1.ArrangeService],
    })
], ArrangeModule);
//# sourceMappingURL=arrange.module.js.map