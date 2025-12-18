import { Controller, Get, Query } from '@nestjs/common'
import { StatsService } from './stats.service'

@Controller('stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get('overview')
  async overview() {
    return this.stats.overview()
  }

  @Get('topFilms')
  async topFilms(@Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit, 10) : 10
    return this.stats.topFilms({ from, to, limit: lim })
  }
}
