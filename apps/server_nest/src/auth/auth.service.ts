import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwtService: JwtService
  ) {}

  async webLogin(body: any) {
    const { userName, password } = body;
    if (!userName || !password) {
      return { code: 0, msg: '用户名或密码不能为空' };
    }

    // Check user table for matching username/phone and password
    const users = await this.db.query<{ userId: number, userName: string, phone: string, avatar: string, role: string }>(
      `SELECT userId, userName, phone, avatar FROM user WHERE (userName = ? OR phone = ?) AND password = ? AND deletedAt IS NULL`,
      [userName, userName, password]
    );

    if (users && users.length > 0) {
      const user = users[0];
      
      // Fetch 'user' role and permissions
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

      const permissions = role?.sys_role_permission.map(rp => rp.sys_permission.code) || [];

      // Generate JWT
      const payload = { userId: user.userId, username: user.userName, role: 'user' };
      const token = await this.jwtService.signAsync(payload);

      return {
        code: 1,
        msg: '登录成功',
        data: {
          ...user,
          token, // Now returning a real JWT
          role: role?.code || 'user',
          permissions,
        },
      };
    } else {
      return { code: 0, msg: '账号或密码错误' };
    }
  }

  async adminLogin(body: any) {
    const { userName, password } = body;
    if (!userName || !password) {
      return { code: 0, msg: '用户名或密码不能为空' };
    }

    const users = await this.db.query<{ userId: number, userName: string, phone: string, avatar: string }>(
      `SELECT userId, userName, phone, avatar FROM user WHERE userName = ? AND password = ? AND deletedAt IS NULL`,
      [userName, password]
    );

    if (users && users.length > 0) {
      const user = users[0];
      
      // Fetch user role from sys_user_role
      const roles = await this.db.query<{ id: number, code: string, name: string }>(
        `SELECT r.id, r.code, r.name 
         FROM sys_user_role ur 
         JOIN sys_role r ON ur.roleId = r.id 
         WHERE ur.userId = ?`,
        [user.userId]
      );

      if (roles && roles.length > 0) {
         const role = roles[0];
         
         if (role.code === 'user') {
            return { code: 0, msg: '普通用户禁止登录后台' };
         }

         // Fetch permissions
         const permissions = await this.db.query<{ code: string }>(
           `SELECT p.code 
            FROM sys_role_permission rp 
            JOIN sys_permission p ON rp.permissionId = p.id 
            WHERE rp.roleId = ?`,
           [role.id]
         );
         
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
      } else {
         return { code: 0, msg: '该用户没有后台访问权限' };
      }
    } else {
      return { code: 0, msg: '账号或密码错误' };
    }
  }
}
