import { and, desc, eq } from 'drizzle-orm';
import { booking, provider, request, seeker, service, serviceType, user, userRole } from '@repo/database';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateSeekerDto } from './dto/create-seeker.dto';

@Injectable()
export class SeekersService {
  constructor(private readonly dbService: DatabaseService) {}

  async createSeeker(createSeekerDto: CreateSeekerDto) {
    // Check if user exists
    const [existingUser] = await this.dbService.db.select().from(user).where(eq(user.id, createSeekerDto.userId));

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has seeker role
    const [existingRole] = await this.dbService.db
      .select()
      .from(userRole)
      .where(and(eq(userRole.userId, createSeekerDto.userId), eq(userRole.role, 'seeker')));

    if (existingRole) {
      throw new ConflictException('User is already a seeker');
    }

    try {
      // Create seeker record
      const [newSeeker] = await this.dbService.db
        .insert(seeker)
        .values({
          userId: createSeekerDto.userId,
        })
        .returning();

      // Assign seeker role
      await this.dbService.db.insert(userRole).values({
        userId: createSeekerDto.userId,
        role: 'seeker',
      });

      return newSeeker;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Seeker already exists for this user');
      }
      throw error;
    }
  }

  async getAllSeekers() {
    const seekers = await this.dbService.db
      .select({
        userId: seeker.userId,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(seeker)
      .leftJoin(user, eq(seeker.userId, user.id));

    return seekers;
  }

  async getSeekerByUserId(userId: string) {
    const [foundSeeker] = await this.dbService.db
      .select({
        userId: seeker.userId,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
      })
      .from(seeker)
      .leftJoin(user, eq(seeker.userId, user.id))
      .where(eq(seeker.userId, userId));

    if (!foundSeeker) {
      throw new NotFoundException(`Seeker with user ID ${userId} not found`);
    }

    return foundSeeker;
  }

  async deleteSeeker(userId: string) {
    // Remove seeker role first
    await this.dbService.db.delete(userRole).where(and(eq(userRole.userId, userId), eq(userRole.role, 'seeker')));

    // Delete seeker record
    const [deletedSeeker] = await this.dbService.db.delete(seeker).where(eq(seeker.userId, userId)).returning();

    if (!deletedSeeker) {
      throw new NotFoundException(`Seeker with user ID ${userId} not found`);
    }

    return { message: 'Seeker deleted successfully' };
  }

  async getSeekerRequests(userId: string) {
    const requests = await this.dbService.db
      .select({
        id: request.id,
        description: request.description,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
          description: serviceType.description,
          iconUrl: serviceType.iconUrl,
        },
      })
      .from(request)
      .leftJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .where(eq(request.seekerUserId, userId))
      .orderBy(desc(request.createdAt));

    return requests;
  }

  async getSeekerBookings(userId: string) {
    const bookings = await this.dbService.db
      .select({
        id: booking.id,
        cost: booking.cost,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        serviceId: service.id,
        provider: {
          userId: provider.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(provider, eq(booking.providerUserId, provider.userId))
      .leftJoin(user, eq(provider.userId, user.id))
      .where(eq(booking.seekerUserId, userId))
      .orderBy(desc(booking.createdAt));

    return bookings;
  }
}
