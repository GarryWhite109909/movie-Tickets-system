import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { DbService } from '../utils/db.service';

@Module({
  controllers: [FilmController],
  providers: [FilmService, DbService],
})
export class FilmModule {}
