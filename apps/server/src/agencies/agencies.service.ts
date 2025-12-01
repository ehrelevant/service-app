import { agency, provider, user } from '@repo/database';
import { and, count, eq } from 'drizzle-orm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(private readonly dbService: DatabaseService) {}

  async createAgency(createAgencyDto: CreateAgencyDto) {
    // TODO: Add uniqueness check
    const [newAgency] = await this.dbService.db.insert(agency).values(createAgencyDto).returning();

    return await this.getAgencyById(newAgency.id);
  }

  async getAllAgencies() {
    const agencies = await this.dbService.db
      .select({
        id: agency.id,
        name: agency.name,
        description: agency.description,
        avatarUrl: agency.avatarUrl,
      })
      .from(agency);

    return agencies;
  }

  async getAgencyById(id: string) {
    const [foundAgency] = await this.dbService.db
      .select({
        id: agency.id,
        name: agency.name,
        description: agency.description,
        avatarUrl: agency.avatarUrl,
      })
      .from(agency)
      .where(eq(agency.id, id));

    if (!foundAgency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }

    return foundAgency;
  }

  async updateAgency(id: string, updateAgencyDto: UpdateAgencyDto) {
    const [updatedAgency] = await this.dbService.db
      .update(agency)
      .set(updateAgencyDto)
      .where(eq(agency.id, id))
      .returning();

    if (!updatedAgency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }

    return updatedAgency;
  }

  async deleteAgency(id: string) {
    // Check if agency has providers
    const [providerCount] = await this.dbService.db
      .select({ count: count() })
      .from(provider)
      .where(eq(provider.agencyId, id));

    if (providerCount.count > 0) {
      throw new ConflictException('Cannot delete agency with active providers');
    }

    const [deletedAgency] = await this.dbService.db.delete(agency).where(eq(agency.id, id)).returning();

    if (!deletedAgency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }

    return { message: 'Agency deleted successfully' };
  }

  async getAgencyProviders(id: string) {
    const providers = await this.dbService.db
      .select({
        userId: provider.userId,
        isAccepting: provider.isAccepting,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(provider)
      .leftJoin(user, eq(provider.userId, user.id))
      .where(eq(provider.agencyId, id));

    return providers;
  }

  async addProviderToAgency(agencyId: string, providerUserId: string) {
    const [updatedProvider] = await this.dbService.db
      .update(provider)
      .set({ agencyId })
      .where(eq(provider.userId, providerUserId))
      .returning();

    if (!updatedProvider) {
      throw new NotFoundException('Provider not found');
    }

    return { message: 'Provider added to agency successfully' };
  }

  async removeProviderFromAgency(agencyId: string, providerUserId: string) {
    const [updatedProvider] = await this.dbService.db
      .update(provider)
      .set({ agencyId: null })
      .where(and(eq(provider.userId, providerUserId), eq(provider.agencyId, agencyId)))
      .returning();

    if (!updatedProvider) {
      throw new NotFoundException('Provider not found in this agency');
    }

    return { message: 'Provider removed from agency successfully' };
  }
}
