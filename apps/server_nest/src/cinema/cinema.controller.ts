import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CinemaService } from './cinema.service';

@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Get('room/list')
  async getRooms() {
    const data = await this.cinemaService.findAll();
    return { code: 1, msg: 'ok', data };
  }

  @Post('room')
  async createRoom(@Body() body: any) {
    const data = await this.cinemaService.create(body);
    return { code: 1, msg: 'ok', data };
  }

  @Put('room/:id')
  async updateRoom(@Param('id') id: string, @Body() body: any) {
    const data = await this.cinemaService.update(Number(id), body);
    return { code: 1, msg: 'ok', data };
  }

  @Delete('room/:id')
  async deleteRoom(@Param('id') id: string) {
    const data = await this.cinemaService.delete(Number(id));
    return { code: 1, msg: 'ok', data };
  }
}