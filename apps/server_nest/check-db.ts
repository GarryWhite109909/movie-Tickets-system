import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

// Fix BigInt serialization
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/filmsdata',
    },
  },
})

async function main() {
  const count = await prisma.film.count()
  console.log('Film count:', count)

  if (count > 0) {
    const films = await prisma.film.findMany({ 
      take: 3,
      include: {
        posterimg: true
      }
    })
    console.log('First 3 films with posters:', JSON.stringify(films, null, 2))
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
