import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: DbService) {}

  async webLogin(body: any) {
    const { userName, password } = body;
    if (!userName || !password) {
      return { code: 0, msg: '用户名或密码不能为空' };
    }

    // Check user table for matching username/phone and password
    // Using raw query as DbService.query exposes that, but could use Prisma client directly if DbService exposed it.
    // DbService.query returns T[]
    const users = await this.db.query<{ userId: number, userName: string, phone: string, avatar: string, role: string }>(
      `SELECT userId, userName, phone, avatar FROM user WHERE (userName = ? OR phone = ?) AND password = ? AND deletedAt IS NULL`,
      [userName, userName, password]
    );

    if (users && users.length > 0) {
      const user = users[0];
      const token = 'web-token-' + Math.random().toString(36).slice(2);
      return {
        code: 1,
        msg: '登录成功',
        data: {
          ...user,
          token,
          // Convert BigInt to string/number if necessary, but userId is Int
        },
      };
    } else {
      return { code: 0, msg: '账号或密码错误' };
    }
  }

  // Keeping the mock admin login or upgrading it?
  // User asked for "web login" functionality specifically failing.
  // But let's upgrade admin login too to be safe, or leave it if not requested.
  // The user said "input incorrect account/password doesn't show failure", implying they tried to login on the web.
  // I will focus on the new web login method.
}
