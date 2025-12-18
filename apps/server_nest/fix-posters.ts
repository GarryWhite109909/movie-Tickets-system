import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

const prisma = new PrismaClient()

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads')

async function main() {
  // 1. Get available images
  const files = fs.readdirSync(UPLOADS_DIR).filter(file => {
    return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
  })
  
  console.log(`Found ${files.length} images in ${UPLOADS_DIR}`)
  
  if (files.length === 0) {
    console.error('No images found!')
    return
  }

  // 2. Get all films
  const films = await prisma.film.findMany({
    include: {
      posterimg: true
    }
  })

  console.log(`Found ${films.length} films to update.`)

  // 3. Update posters
  for (let i = 0; i < films.length; i++) {
    const film = films[i]
    const imageFile = files[i % files.length] // Round-robin
    const newUrl = `/uploads/${imageFile}`
    
    // Check if posterimg exists
    const existingPoster = await prisma.posterimg.findFirst({
      where: { filmId: film.filmId }
    })

    if (existingPoster) {
      await prisma.posterimg.update({
        where: { posterId: existingPoster.posterId },
        data: { url: newUrl }
      })
      console.log(`Updated film ${film.filmId} (${film.filmName}) with poster ${newUrl}`)
    } else {
      await prisma.posterimg.create({
        data: {
          filmId: film.filmId,
          url: newUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`Created poster for film ${film.filmId} (${film.filmName}) with poster ${newUrl}`)
    }
  }

  console.log('All done!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
