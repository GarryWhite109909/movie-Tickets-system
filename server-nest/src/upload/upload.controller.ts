import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as path from 'path'

function storage(dir: string) {
  return diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${Date.now()}${ext}`)
    },
  })
}
function fileFilter(_req: any, file: any, cb: (err: any, accept: boolean) => void) {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  cb(null, allowed.includes(file.mimetype))
}
const root = path.join(__dirname, '../../public')

@Controller()
export class UploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar', { storage: storage(path.join(root, 'uploads')), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadAdmin(@UploadedFile() file?: any) {
    if (!file) return { code: 1, msg: 'Invalid file type' }
    return { code: 0, fileName: file.filename, filePath: `/uploads/${file.filename}` }
  }

  @Post('web/uploadAvatar')
  @UseInterceptors(FileInterceptor('avatar', { storage: storage(path.join(root, 'avatar')), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadWeb(@UploadedFile() file?: any) {
    if (!file) return { code: 1, msg: 'Invalid file type' }
    return { code: 0, fileName: file.filename, filePath: `/avatar/${file.filename}` }
  }
}
