import { Injectable } from '@nestjs/common';
import { DbService } from '../utils/db.service';

@Injectable()
export class SystemService {
  constructor(private readonly db: DbService) {}

  // Roles
  async getRoles() {
    const roles = await this.db.sys_role.findMany({
       include: {
         sys_role_permission: {
            include: { sys_permission: true }
         }
       }
    });
    // Serialize BigInt
    return JSON.parse(JSON.stringify(roles, (key, value) => 
       typeof value === 'bigint' ? value.toString() : value
    ));
  }

  async createRole(data: any) {
    // data: { code, name, description, permissionIds: number[] }
    const { permissionIds, ...roleData } = data;
    const role = await this.db.sys_role.create({
      data: {
        ...roleData,
        sys_role_permission: {
           create: permissionIds ? permissionIds.map((pid: any) => ({
              permissionId: BigInt(pid)
           })) : []
        }
      }
    });
    return JSON.parse(JSON.stringify(role, (key, value) => typeof value === 'bigint' ? value.toString() : value));
  }
  
  // Resources/Permissions
  async getResources() {
     const resources = await this.db.sys_resource.findMany({
        include: { sys_permission: true }
     });
     return JSON.parse(JSON.stringify(resources, (key, value) => typeof value === 'bigint' ? value.toString() : value));
  }
}