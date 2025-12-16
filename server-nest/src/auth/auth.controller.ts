import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.adminLogin(body);
  }

  @Post('web/login')
  async webLogin(@Body() body: any) {
    return this.authService.webLogin(body);
  }
}
