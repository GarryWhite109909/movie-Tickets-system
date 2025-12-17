import { Controller, Get, Param, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ArrangeService } from './arrange.service';

@Controller('arrange')
export class ArrangeController {
  constructor(private readonly arrangeService: ArrangeService) {}

  @Get('film/:id')
  async getByFilm(@Param('id') id: string, @Query('date') date?: string) {
    const data = await this.arrangeService.getArrangesByFilmId(Number(id), date);
    return { code: 1, msg: 'ok', data };
  }

  @Get('film/:id/dates')
  async getDates(@Param('id') id: string) {
    const data = await this.arrangeService.getFilmArrangeDates(Number(id));
    return { code: 1, msg: 'ok', data };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const data = await this.arrangeService.getArrangeById(Number(id));
    return { code: 1, msg: 'ok', data };
  }
}