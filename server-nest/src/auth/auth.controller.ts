import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // Legacy mock admin login - kept for compatibility if needed, 
    // or we can map it to DB too. Let's keep it simple for now as user focused on Web.
    // Actually, Admin login was working fine according to previous turn.
    // User specifically complained about "input incorrect account...".
    const { userName, password } = body || {}
    if (!userName || !password) {
      return { code: 1, msg: '用户名或密码不能为空' }
    }
    // Mock for admin
    const token = 'mock-token-' + Math.random().toString(36).slice(2)
    const user = {
      id: 1,
      userName,
      role: 'admin',
      token,
    }
    return { code: 1, msg: 'ok', data: user }
  }

  @Post('web/login')
  async webLogin(@Body() body: any) {
    return this.authService.webLogin(body);
  }
}
