import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { booking, message, provider, request, seeker, service, serviceType, user } from '@repo/database';
import { desc, eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    // Verify all entities exist
    const [existingService] = await this.dbService.db
      .select()
      .from(service)
      .where(eq(service.id, createBookingDto.serviceId));

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    const [existingProvider] = await this.dbService.db
      .select()
      .from(provider)
      .where(eq(provider.userId, createBookingDto.providerUserId));

    if (!existingProvider) {
      throw new NotFoundException('Provider not found');
    }

    const [existingSeeker] = await this.dbService.db
      .select()
      .from(seeker)
      .where(eq(seeker.userId, createBookingDto.seekerUserId));

    if (!existingSeeker) {
      throw new NotFoundException('Seeker not found');
    }

    const [existingRequest] = await this.dbService.db
      .select()
      .from(request)
      .where(eq(request.id, createBookingDto.requestId));

    if (!existingRequest) {
      throw new NotFoundException('Request not found');
    }

    // Verify provider is accepting bookings
    if (!existingProvider.isAccepting) {
      throw new BadRequestException('Provider is not currently accepting bookings');
    }

    // Verify service is enabled
    if (!existingService.isEnabled) {
      throw new BadRequestException('Service is not currently available');
    }

    // Check if booking already exists for this request
    const [existingBooking] = await this.dbService.db
      .select()
      .from(booking)
      .where(eq(booking.requestId, createBookingDto.requestId));

    if (existingBooking) {
      throw new ConflictException('A booking already exists for this request');
    }

    const [newBooking] = await this.dbService.db.insert(booking).values(createBookingDto).returning();

    return newBooking;
  }

  async getAllBookings() {
    const bookings = this.dbService.db
      .select({
        id: booking.id,
        cost: booking.cost,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        service: {
          id: service.id,
          initialCost: service.initialCost,
          isEnabled: service.isEnabled,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
        },
        provider: {
          userId: provider.userId,
          isAccepting: provider.isAccepting,
        },
        seeker: {
          id: seeker.userId,
        },
        request: {
          id: request.id,
          description: request.description,
        },
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(provider, eq(booking.providerUserId, provider.userId))
      .leftJoin(seeker, eq(booking.seekerUserId, seeker.userId))
      .leftJoin(request, eq(booking.requestId, request.id));

    return bookings;
  }

  async getBookingById(id: string) {
    const [foundBooking] = await this.dbService.db
      .select({
        id: booking.id,
        cost: booking.cost,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        service: {
          id: service.id,
          initialCost: service.initialCost,
          isEnabled: service.isEnabled,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
        },
        provider: {
          userId: provider.userId,
          isAccepting: provider.isAccepting,
        },
        seeker: {
          id: seeker.userId,
        },
        request: {
          id: request.id,
          description: request.description,
        },
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(provider, eq(booking.providerUserId, provider.userId))
      .leftJoin(seeker, eq(booking.seekerUserId, seeker.userId))
      .leftJoin(request, eq(booking.requestId, request.id))
      .where(eq(booking.id, id));

    if (!foundBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return foundBooking;
  }

  async getBookingsByProvider(providerUserId: string) {
    const bookings = await this.dbService.db
      .select({
        id: booking.id,
        cost: booking.cost,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        service: {
          id: service.id,
          initialCost: service.initialCost,
          isEnabled: service.isEnabled,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
        },
        provider: {
          userId: provider.userId,
          isAccepting: provider.isAccepting,
        },
        seeker: {
          id: seeker.userId,
        },
        request: {
          id: request.id,
          description: request.description,
        },
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(provider, eq(booking.providerUserId, provider.userId))
      .leftJoin(seeker, eq(booking.seekerUserId, seeker.userId))
      .leftJoin(request, eq(booking.requestId, request.id))
      .where(eq(booking.providerUserId, providerUserId))
      .orderBy(desc(booking.createdAt));

    return bookings;
  }

  async getBookingsBySeeker(seekerUserId: string) {
    const bookings = await this.dbService.db
      .select({
        id: booking.id,
        cost: booking.cost,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        service: {
          id: service.id,
          initialCost: service.initialCost,
          isEnabled: service.isEnabled,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
        },
        provider: {
          userId: provider.userId,
          isAccepting: provider.isAccepting,
        },
        seeker: {
          id: seeker.userId,
        },
        request: {
          id: request.id,
          description: request.description,
        },
      })
      .from(booking)
      .leftJoin(service, eq(booking.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(provider, eq(booking.providerUserId, provider.userId))
      .leftJoin(seeker, eq(booking.seekerUserId, seeker.userId))
      .leftJoin(request, eq(booking.requestId, request.id))
      .where(eq(booking.seekerUserId, seekerUserId))
      .orderBy(desc(booking.createdAt));

    return bookings;
  }

  async updateBooking(id: string, updateBookingDto: UpdateBookingDto, userId?: string) {
    const [existingBooking] = await this.dbService.db.select().from(booking).where(eq(booking.id, id));

    if (!existingBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // If userId provided, verify user is involved in booking
    if (userId) {
      if (existingBooking.providerUserId !== userId && existingBooking.seekerUserId !== userId) {
        throw new ForbiddenException('You can only update bookings you are involved in');
      }
    }

    const [updatedBooking] = await this.dbService.db
      .update(booking)
      .set({ ...updateBookingDto, updatedAt: new Date() })
      .where(eq(booking.id, id))
      .returning();

    return await this.getBookingById(updatedBooking.id);
  }

  async deleteBooking(id: string) {
    const [existingBooking] = await this.dbService.db.select().from(booking).where(eq(booking.id, id));

    if (!existingBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Delete associated messages first
    // TODO

    const [deletedBooking] = await this.dbService.db.delete(booking).where(eq(booking.id, id)).returning();

    return deletedBooking;
  }

  async getBookingMessages(id: string) {
    // Verify booking exists and user has access
    const [existingBooking] = await this.dbService.db.select().from(booking).where(eq(booking.id, id));

    if (!existingBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const messages = await this.dbService.db
      .select({
        id: message.id,
        message: message.message,
        createdAt: message.createdAt,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(message)
      .leftJoin(user, eq(message.userId, user.id))
      .where(eq(message.bookingId, id))
      .orderBy(message.createdAt);

    return messages;
  }
}
