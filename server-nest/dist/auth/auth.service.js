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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../utils/db.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(db, jwtService) {
        this.db = db;
        this.jwtService = jwtService;
    }
    async webLogin(body) {
        const { userName, password } = body;
        if (!userName || !password) {
            return { code: 0, msg: '用户名或密码不能为空' };
        }
        const users = await this.db.query(`SELECT userId, userName, phone, avatar FROM user WHERE (userName = ? OR phone = ?) AND password = ? AND deletedAt IS NULL`, [userName, userName, password]);
        if (users && users.length > 0) {
            const user = users[0];
            const role = await this.db.sys_role.findFirst({
                where: { code: 'user' },
                include: {
                    sys_role_permission: {
                        include: {
                            sys_permission: true
                        }
                    }
                }
            });
            const permissions = (role === null || role === void 0 ? void 0 : role.sys_role_permission.map(rp => rp.sys_permission.code)) || [];
            const payload = { userId: user.userId, username: user.userName, role: 'user' };
            const token = await this.jwtService.signAsync(payload);
            return {
                code: 1,
                msg: '登录成功',
                data: {
                    ...user,
                    token,
                    role: (role === null || role === void 0 ? void 0 : role.code) || 'user',
                    permissions,
                },
            };
        }
        else {
            return { code: 0, msg: '账号或密码错误' };
        }
    }
    async adminLogin(body) {
        const { userName, password } = body;
        if (!userName || !password) {
            return { code: 0, msg: '用户名或密码不能为空' };
        }
        const users = await this.db.query(`SELECT userId, userName, phone, avatar FROM user WHERE userName = ? AND password = ? AND deletedAt IS NULL`, [userName, password]);
        if (users && users.length > 0) {
            const user = users[0];
            const roles = await this.db.query(`SELECT r.id, r.code, r.name 
         FROM sys_user_role ur 
         JOIN sys_role r ON ur.roleId = r.id 
         WHERE ur.userId = ?`, [user.userId]);
            if (roles && roles.length > 0) {
                const role = roles[0];
                if (role.code === 'user') {
                    return { code: 0, msg: '普通用户禁止登录后台' };
                }
                const permissions = await this.db.query(`SELECT p.code 
            FROM sys_role_permission rp 
            JOIN sys_permission p ON rp.permissionId = p.id 
            WHERE rp.roleId = ?`, [role.id]);
                const token = 'admin-token-' + Math.random().toString(36).slice(2);
                return {
                    code: 1,
                    msg: '登录成功',
                    data: {
                        ...user,
                        token,
                        role: role.code,
                        roleName: role.name,
                        permissions: permissions.map(p => p.code),
                    },
                };
            }
            else {
                return { code: 0, msg: '该用户没有后台访问权限' };
            }
        }
        else {
            return { code: 0, msg: '账号或密码错误' };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map