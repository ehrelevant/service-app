import { eq } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { serviceType } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';

@Injectable()
export class ServiceTypesService {
  constructor(private readonly dbService: DatabaseService) {}

  async createServiceType(createServiceTypeDto: CreateServiceTypeDto) {
    const [newServiceType] = await this.dbService.db.insert(serviceType).values(createServiceTypeDto).returning();

    return newServiceType;
  }

  async getAllServiceTypes() {
    return await this.dbService.db.select().from(serviceType);
  }

  async getServiceTypeById(id: string) {
    const [foundServiceType] = await this.dbService.db.select().from(serviceType).where(eq(serviceType.id, id));

    if (!foundServiceType) {
      throw new NotFoundException(`Service type with ID ${id} not found`);
    }

    return foundServiceType;
  }

  async updateServiceType(id: string, updateServiceTypeDto: UpdateServiceTypeDto) {
    const [updatedServiceType] = await this.dbService.db
      .update(serviceType)
      .set(updateServiceTypeDto)
      .where(eq(serviceType.id, id))
      .returning();

    if (!updatedServiceType) {
      throw new NotFoundException(`Service type with ID ${id} not found`);
    }

    return updatedServiceType;
  }

  async deleteServiceType(id: string) {
    const [deletedServiceType] = await this.dbService.db.delete(serviceType).where(eq(serviceType.id, id)).returning();

    if (!deletedServiceType) {
      throw new NotFoundException(`Service type with ID ${id} not found`);
    }

    return { message: 'Service type deleted successfully' };
  }
}
