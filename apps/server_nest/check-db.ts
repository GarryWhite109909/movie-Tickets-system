const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/filmsdata',
    },
  },
});

async function main() {
  const count = await prisma.film.count();
  console.log('Film count:', count);
  
  if (count > 0) {
      const films = await prisma.film.findMany({ take: 3 });
      console.log('First 3 films:', films);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
