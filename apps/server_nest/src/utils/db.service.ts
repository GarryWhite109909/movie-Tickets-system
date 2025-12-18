import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: { url: configService.get<string>('DATABASE_URL') }
      }
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const rows = (await this.$queryRawUnsafe(sql, ...params)) as T[]
    return rows
  }
}
