import { and, desc, eq } from 'drizzle-orm';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { booking, review, reviewImage, service, serviceType, user } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createReview(createReviewDto: CreateReviewDto) {
    // Verify service exists
    const [existingService] = await this.dbService.db
      .select()
      .from(service)
      .where(eq(service.id, createReviewDto.serviceId));

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    // If reviewerId is provided, verify they have booked this service
    const [existingBooking] = await this.dbService.db
      .select()
      .from(booking)
      .where(
        and(eq(booking.serviceId, createReviewDto.serviceId), eq(booking.seekerUserId, createReviewDto.reviewerUserId)),
      );

    if (!existingBooking) {
      throw new ForbiddenException('You can only review services you have booked');
    }

    // Check if user already reviewed this service
    const [existingReview] = await this.dbService.db
      .select()
      .from(review)
      .where(
        and(eq(review.serviceId, createReviewDto.serviceId), eq(review.reviewerUserId, createReviewDto.reviewerUserId)),
      );

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this service');
    }

    const [newReview] = await this.dbService.db
      .insert(review)
      .values({
        serviceId: createReviewDto.serviceId,
        reviewerUserId: createReviewDto.reviewerUserId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      })
      .returning();

    // Add images if provided
    if (createReviewDto.images && createReviewDto.images.length > 0) {
      const imageInserts = createReviewDto.images.map(imageUrl => ({
        reviewId: newReview.id,
        image: imageUrl,
      }));

      await this.dbService.db.insert(reviewImage).values(imageInserts);
    }

    return await this.getReviewById(newReview.id);
  }

  async getAllReviews() {
    const reviews = await this.dbService.db
      .select({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        service: {
          id: service.id,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
        },
        reviewer: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(review)
      .leftJoin(service, eq(review.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(user, eq(review.reviewerUserId, user.id))
      .orderBy(desc(review.createdAt));

    // Get images for each review
    const reviewsWithImages = await Promise.all(
      reviews.map(async reviewItem => {
        const images = await this.dbService.db
          .select({ image: reviewImage.image })
          .from(reviewImage)
          .where(eq(reviewImage.reviewId, reviewItem.id));

        return {
          ...reviewItem,
          images: images.map(img => img.image),
        };
      }),
    );

    return reviewsWithImages;
  }

  async getReviewById(id: string) {
    const [foundReview] = await this.dbService.db
      .select({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        service: {
          id: service.id,
        },
        serviceType: {
          id: serviceType.id,
          name: serviceType.name,
        },
        reviewer: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(review)
      .leftJoin(service, eq(review.serviceId, service.id))
      .leftJoin(serviceType, eq(service.serviceTypeId, serviceType.id))
      .leftJoin(user, eq(review.reviewerUserId, user.id))
      .where(eq(review.id, id));

    if (!foundReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Get review images
    const images = await this.dbService.db
      .select({ image: reviewImage.image })
      .from(reviewImage)
      .where(eq(reviewImage.reviewId, id));

    return {
      ...foundReview,
      images: images.map(img => img.image),
    };
  }

  async getReviewsByService(serviceId: string) {
    const reviews = await this.dbService.db
      .select({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewer: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(review)
      .leftJoin(user, eq(review.reviewerUserId, user.id))
      .where(eq(review.serviceId, serviceId))
      .orderBy(desc(review.createdAt));

    // Get images for each review
    const reviewsWithImages = await Promise.all(
      reviews.map(async reviewItem => {
        const images = await this.dbService.db
          .select({ image: reviewImage.image })
          .from(reviewImage)
          .where(eq(reviewImage.reviewId, reviewItem.id));

        return {
          ...reviewItem,
          images: images.map(img => img.image),
        };
      }),
    );

    return reviewsWithImages;
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto) {
    const [updatedReview] = await this.dbService.db
      .update(review)
      .set({ ...updateReviewDto, updatedAt: new Date() })
      .where(eq(review.id, id))
      .returning();

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return await this.getReviewById(id);
  }

  async deleteReview(id: string) {
    // Delete review images first
    await this.dbService.db.delete(reviewImage).where(eq(reviewImage.reviewId, id));

    // Delete review
    const [deletedReview] = await this.dbService.db.delete(review).where(eq(review.id, id)).returning();

    if (!deletedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return { message: 'Review deleted successfully' };
  }
}
