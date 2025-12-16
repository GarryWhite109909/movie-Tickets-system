import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { StatsModule } from './stats/stats.module'
import { UploadModule } from './upload/upload.module'
import { AuthModule } from './auth/auth.module'
import { FilmModule } from './film/film.module'
import { DbModule } from './utils/db.module'
import { CinemaModule } from './cinema/cinema.module'
import { SystemModule } from './system/system.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    StatsModule, 
    UploadModule,
    AuthModule,
    FilmModule,
    CinemaModule,
    SystemModule,
  ],
})
export class AppModule {}
