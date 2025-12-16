import { Controller, Get, Param } from '@nestjs/common';
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
}
