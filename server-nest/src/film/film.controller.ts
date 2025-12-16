import { Controller, Get, Param, Post, Put, Delete, Body } from '@nestjs/common';
import { FilmService } from './film.service';

@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get('all')
  async getAll() {
    const films = await this.filmService.findAll();
    return { code: 1, msg: 'ok', data: films };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const film = await this.filmService.getFilmById(Number(id));
    return { code: 1, msg: 'ok', data: film };
  }

  @Post()
  async create(@Body() body: any) {
    const res = await this.filmService.create(body);
    return { code: 1, msg: 'ok', data: res };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const res = await this.filmService.update(Number(id), body);
    return { code: 1, msg: 'ok', data: res };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const res = await this.filmService.delete(Number(id));
    return { code: 1, msg: 'ok', data: res };
  }
}
