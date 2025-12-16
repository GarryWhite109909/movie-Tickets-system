import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class DbService {
  private prisma: PrismaClient
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: { url: 'mysql://root:109909@localhost:3306/filmsdata' }
      }
    })
  }
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    // Prisma 4: use unsafe for positional params
    const rows = (await (this.prisma.$queryRawUnsafe as any)(sql, ...params)) as T[]
    return rows
  }
}
