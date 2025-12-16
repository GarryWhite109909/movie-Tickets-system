import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';

@Injectable()
export class CinemaService {
  constructor(private readonly db: DbService) {}

  async findAll() {
    return this.db.filmroom.findMany({
      where: { deletedAt: null }
    });
  }

  async create(data: any) {
     return this.db.filmroom.create({
       data: {
         roomName: data.roomName,
         number: data.number,
         row: data.row,
         column: data.column,
         createdAt: new Date(),
         updatedAt: new Date(),
       }
     });
  }

  async update(id: number, data: any) {
    return this.db.filmroom.update({
      where: { roomId: id },
      data: {
         roomName: data.roomName,
         number: data.number,
         row: data.row,
         column: data.column,
         updatedAt: new Date(),
      }
    });
  }

  async delete(id: number) {
    return this.db.filmroom.update({
      where: { roomId: id },
      data: { deletedAt: new Date() }
    });
  }
}