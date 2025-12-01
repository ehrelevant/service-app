import { address } from '@repo/database';
import { eq } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly dbService: DatabaseService) {}

  async createAddress(createAddressDto: CreateAddressDto) {
    const [newAddress] = await this.dbService.db.insert(address).values(createAddressDto).returning();

    return newAddress;
  }

  async getAllAddresses() {
    return await this.dbService.db.select().from(address);
  }

  async getAddressById(id: string) {
    const [foundAddress] = await this.dbService.db.select().from(address).where(eq(address.id, id));

    if (!foundAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return foundAddress;
  }

  async updateAddress(id: string, updateAddressDto: UpdateAddressDto) {
    const [updatedAddress] = await this.dbService.db
      .update(address)
      .set(updateAddressDto)
      .where(eq(address.id, id))
      .returning();

    if (!updatedAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return updatedAddress;
  }

  async deleteAddress(id: string) {
    const [deletedAddress] = await this.dbService.db.delete(address).where(eq(address.id, id)).returning();

    if (!deletedAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return { message: 'Address deleted successfully' };
  }
}
