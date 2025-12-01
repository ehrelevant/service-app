import { address, booking, request, requestImage, seeker, serviceType, user } from '@repo/database';
import { and, desc, eq } from 'drizzle-orm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createRequest(createRequestDto: CreateRequestDto) {
    // Verify entities exist
    const [existingServiceType] = await this.dbService.db
      .select()
      .from(serviceType)
      .where(eq(serviceType.id, createRequestDto.serviceTypeId));

    if (!existingServiceType) {
      throw new NotFoundException('Service type not found');
    }

    const [existingSeeker] = await this.dbService.db
      .select()
      .from(seeker)
      .where(eq(seeker.userId, createRequestDto.seekerUserId));

    if (!existingSeeker) {
      throw new NotFoundException('Seeker not found');
    }

    const [existingAddress] = await this.dbService.db
      .select()
      .from(address)
      .where(eq(address.id, createRequestDto.addressId));

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    // Create request
    const [newRequest] = await this.dbService.db
      .insert(request)
      .values({
        serviceTypeId: createRequestDto.serviceTypeId,
        seekerUserId: createRequestDto.seekerUserId,
        addressId: createRequestDto.addressId,
        description: createRequestDto.description,
      })
      .returning();

    // Add images if provided
    if (createRequestDto.images && createRequestDto.images.length > 0) {
      const imageInserts = createRequestDto.images.map(imageUrl => ({
        requestId: newRequest.id,
        image: imageUrl,
      }));

      await this.dbService.db.insert(requestImage).values(imageInserts);
    }

    return await this.getRequestById(newRequest.id);
  }

  async getAllRequests() {
    const requests = await this.dbService.db
      .select({
        id: request.id,
        description: request.description,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
        },
        seeker: {
          userId: seeker.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
        addressId: request.addressId,
      })
      .from(request)
      .leftJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .leftJoin(seeker, eq(request.seekerUserId, seeker.userId))
      .leftJoin(user, eq(seeker.userId, user.id))
      .leftJoin(address, eq(request.addressId, address.id))
      .leftJoin(booking, eq(request.id, booking.requestId))
      .orderBy(desc(request.createdAt));

    // Get images for each request
    const requestsWithImages = await Promise.all(
      requests.map(async requestItem => {
        const images = await this.dbService.db
          .select({ image: requestImage.image })
          .from(requestImage)
          .where(eq(requestImage.requestId, requestItem.id));

        return {
          ...requestItem,
          images: images.map(img => img.image),
        };
      }),
    );

    return requestsWithImages;
  }

  async getRequestById(id: string) {
    const [foundRequest] = await this.dbService.db
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
        seeker: {
          userId: seeker.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          phoneNumber: user.phoneNumber,
        },
        addressId: request.addressId,
      })
      .from(request)
      .leftJoin(serviceType, eq(request.serviceTypeId, serviceType.id))
      .leftJoin(seeker, eq(request.seekerUserId, seeker.userId))
      .leftJoin(user, eq(seeker.userId, user.id))
      .leftJoin(address, eq(request.addressId, address.id))
      .where(eq(request.id, id));

    if (!foundRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    // Get request images
    const images = await this.dbService.db
      .select({ image: requestImage.image })
      .from(requestImage)
      .where(eq(requestImage.requestId, id));

    // Check if request has booking
    const [existingBooking] = await this.dbService.db
      .select({ id: booking.id })
      .from(booking)
      .where(eq(booking.requestId, id));

    return {
      ...foundRequest,
      images: images.map(img => img.image),
      isBooked: !!existingBooking,
    };
  }

  async updateRequest(id: string, updateRequestDto: UpdateRequestDto) {
    const [updatedRequest] = await this.dbService.db
      .update(request)
      .set(updateRequestDto)
      .where(eq(request.id, id))
      .returning();

    if (!updatedRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return updatedRequest;
  }

  async deleteRequest(id: string) {
    // Check if request has bookings
    const [existingBooking] = await this.dbService.db
      .select({ id: booking.id })
      .from(booking)
      .where(eq(booking.requestId, id));

    if (existingBooking) {
      throw new ForbiddenException('Cannot delete request with existing bookings');
    }

    // Delete request images first
    await this.dbService.db.delete(requestImage).where(eq(requestImage.requestId, id));

    // Delete request
    const [deletedRequest] = await this.dbService.db.delete(request).where(eq(request.id, id)).returning();

    if (!deletedRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return deletedRequest;
  }

  async addRequestImage(id: string, imageUrl: string) {
    await this.dbService.db.insert(requestImage).values({
      requestId: id,
      image: imageUrl,
    });

    return await this.getRequestById(id);
  }

  async removeRequestImage(id: string, imageUrl: string) {
    const [deletedImage] = await this.dbService.db
      .delete(requestImage)
      .where(and(eq(requestImage.requestId, id), eq(requestImage.image, imageUrl)))
      .returning();

    if (!deletedImage) {
      throw new NotFoundException('Image not found in request');
    }

    return { message: 'Image removed successfully' };
  }
}
