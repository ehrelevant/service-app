import { agency, booking, provider, seeker, service, serviceType, user, userRole } from '@repo/database';
import { and, desc, eq } from 'drizzle-orm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly dbService: DatabaseService) {}

  async createProvider(createProviderDto: CreateProviderDto) {
    // Check if user exists
    const [existingUser] = await this.dbService.db.select().from(user).where(eq(user.id, createProviderDto.userId));

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has provider role
    const [existingRole] = await this.dbService.db
      .select()
      .from(userRole)
      .where(and(eq(userRole.userId, createProviderDto.userId), eq(userRole.role, 'provider')));

    if (existingRole) {
      throw new ConflictException('User is already a provider');
    }

    try {
      // Create provider record
      const [newProvider] = await this.dbService.db
        .insert(provider)
        .values({
          userId: createProviderDto.userId,
          agencyId: createProviderDto.agencyId,
          isAccepting: createProviderDto.isAccepting ?? false,
        })
        .returning();

      // Assign provider role
      await this.dbService.db.insert(userRole).values({
        userId: createProviderDto.userId,
        role: 'provider',
      });

      return newProvider;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Provider already exists for this user');
      }
      throw error;
    }
  }

  async getAllProviders(isAccepting?: boolean, agencyId?: string) {
    return await this.dbService.db
      .select({
        userId: provider.userId,
        agencyId: provider.agencyId,
        isAccepting: provider.isAccepting,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
        },
        agency: {
          id: agency.id,
          name: agency.name,
          description: agency.description,
          avatarUrl: agency.avatarUrl,
        },
      })
      .from(provider)
      .leftJoin(user, eq(provider.userId, user.id))
      .leftJoin(agency, eq(provider.agencyId, agency.id))
      .where(
        and(
          isAccepting ? eq(provider.isAccepting, isAccepting) : undefined,
          agencyId ? eq(provider.agencyId, agencyId) : undefined,
        ),
      );
  }

  async getProviderByUserId(userId: string) {
    const [foundProvider] = await this.dbService.db
      .select({
        userId: provider.userId,
        agencyId: provider.agencyId,
        isAccepting: provider.isAccepting,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
        },
        agency: {
          id: agency.id,
          name: agency.name,
          description: agency.description,
          avatarUrl: agency.avatarUrl,
        },
      })
      .from(provider)
      .leftJoin(user, eq(provider.userId, user.id))
      .leftJoin(agency, eq(provider.agencyId, agency.id))
      .where(eq(provider.userId, userId));

    if (!foundProvider) {
      throw new NotFoundException(`Provider with user ID ${userId} not found`);
    }

    return foundProvider;
  }

  async updateProvider(userId: string, updateProviderDto: UpdateProviderDto) {
    const [updatedProvider] = await this.dbService.db
      .update(provider)
      .set(updateProviderDto)
      .where(eq(provider.userId, userId))
      .returning();

    if (!updatedProvider) {
      throw new NotFoundException(`Provider with user ID ${userId} not found`);
    }

    return updatedProvider;
  }

  async deleteProvider(userId: string) {
    // Remove provider role first
    await this.dbService.db.delete(userRole).where(and(eq(userRole.userId, userId), eq(userRole.role, 'provider')));

    // Delete provider record
    const [deletedProvider] = await this.dbService.db.delete(provider).where(eq(provider.userId, userId)).returning();

    if (!deletedProvider) {
      throw new NotFoundException(`Provider with user ID ${userId} not found`);
    }

    return deletedProvider;
  }

  async getProviderServices(userId: string) {
    const services = await this.dbService.db
      .select({
        id: service.id,
        initialCost: service.initialCost,
        isEnabled: service.isEnabled,
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          description: serviceType.description,
          iconUrl: serviceType.iconUrl,
        },
      })
      .from(service)
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .where(eq(service.providerUserId, userId))
      .orderBy(desc(service.id));

    return services;
  }

  async getProviderBookings(userId: string) {
    // TODO: Add optional status filtering
    return await this.dbService.db
      .select({
        id: booking.id,
        cost: booking.cost,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        service: {
          id: service.id,
          initialCost: service.initialCost,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          description: serviceType.description,
        },
        seeker: {
          userId: seeker.userId,
        },
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(seeker, eq(booking.seekerUserId, seeker.userId))
      .leftJoin(user, eq(seeker.userId, user.id))
      .where(eq(booking.providerUserId, userId))
      .orderBy(desc(booking.createdAt));
  }

  async toggleAcceptingStatus(userId: string) {
    const [currentProvider] = await this.dbService.db.select().from(provider).where(eq(provider.userId, userId));

    if (!currentProvider) {
      throw new NotFoundException(`Provider with user ID ${userId} not found`);
    }

    const [updatedProvider] = await this.dbService.db
      .update(provider)
      .set({ isAccepting: !currentProvider.isAccepting })
      .where(eq(provider.userId, userId))
      .returning();

    return updatedProvider;
  }
}
