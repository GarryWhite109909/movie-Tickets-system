import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { StatsModule } from './stats/stats.module'
import { UploadModule } from './upload/upload.module'
import { AuthModule } from './auth/auth.module'
import { FilmModule } from './film/film.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StatsModule, 
    UploadModule,
    AuthModule,
    FilmModule,
  ],
})
export class AppModule {}
