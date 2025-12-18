import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { StatsModule } from './stats/stats.module'
import { UploadModule } from './upload/upload.module'
import { AuthModule } from './auth/auth.module'
import { FilmModule } from './film/film.module'
import { DbModule } from './utils/db.module'
import { CinemaModule } from './cinema/cinema.module'
import { SystemModule } from './system/system.module'
import { ArrangeModule } from './arrange/arrange.module'
import { BookingModule } from './booking/booking.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/', 
    }),
    DbModule,
    StatsModule, 
    UploadModule,
    AuthModule,
    FilmModule,
    CinemaModule,
    SystemModule,
    ArrangeModule,
    BookingModule,
  ],
})
export class AppModule {}
