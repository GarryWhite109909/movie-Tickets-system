import { Controller, Get, Post, Body } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('role/list')
  async getRoles() {
    const data = await this.systemService.getRoles();
    return { code: 1, msg: 'ok', data };
  }
  
  @Post('role')
  async createRole(@Body() body: any) {
    const data = await this.systemService.createRole(body);
    return { code: 1, msg: 'ok', data };
  }

  @Get('resource/list')
  async getResources() {
     const data = await this.systemService.getResources();
     return { code: 1, msg: 'ok', data };
  }
}