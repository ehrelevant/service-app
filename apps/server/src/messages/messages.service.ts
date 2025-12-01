import { booking, message, messageImage, user } from '@repo/database';
import { desc, eq } from 'drizzle-orm';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly dbService: DatabaseService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    // Verify booking exists
    const [existingBooking] = await this.dbService.db
      .select()
      .from(booking)
      .where(eq(booking.id, createMessageDto.bookingId));

    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify user is part of the booking
    if (
      existingBooking.providerUserId !== createMessageDto.userId &&
      existingBooking.seekerUserId !== createMessageDto.userId
    ) {
      throw new ForbiddenException('You can only send messages for bookings you are involved in');
    }

    // Create message
    const [newMessage] = await this.dbService.db
      .insert(message)
      .values({
        bookingId: createMessageDto.bookingId,
        userId: createMessageDto.userId,
        message: createMessageDto.message,
      })
      .returning();

    // Add images if provided
    if (createMessageDto.images && createMessageDto.images.length > 0) {
      const imageInserts = createMessageDto.images.map(imageUrl => ({
        messageId: newMessage.id,
        image: imageUrl,
      }));

      await this.dbService.db.insert(messageImage).values(imageInserts);
    }

    return await this.getMessageById(newMessage.id);
  }

  async getMessagesByBooking(bookingId: string) {
    // Verify booking exists and user has access
    const [existingBooking] = await this.dbService.db.select().from(booking).where(eq(booking.id, bookingId));

    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }

    const messages = await this.dbService.db
      .select({
        id: message.id,
        message: message.message,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(message)
      .leftJoin(user, eq(message.userId, user.id))
      .where(eq(message.bookingId, bookingId))
      .orderBy(message.createdAt);

    // Get images for each message
    const messagesWithImages = await Promise.all(
      messages.map(async messageItem => {
        const images = await this.dbService.db
          .select({ image: messageImage.image })
          .from(messageImage)
          .where(eq(messageImage.messageId, messageItem.id));

        return {
          ...messageItem,
          images: images.map(img => img.image),
        };
      }),
    );

    return messagesWithImages;
  }

  async getMessageById(id: string) {
    const [foundMessage] = await this.dbService.db
      .select({
        id: message.id,
        message: message.message,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        bookingId: message.bookingId,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(message)
      .leftJoin(user, eq(message.userId, user.id))
      .where(eq(message.id, id));

    if (!foundMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Get message images
    const images = await this.dbService.db
      .select({ image: messageImage.image })
      .from(messageImage)
      .where(eq(messageImage.messageId, id));

    return {
      ...foundMessage,
      images: images.map(img => img.image),
    };
  }

  async updateMessage(id: string, updateMessageDto: UpdateMessageDto) {
    const [existingMessage] = await this.dbService.db.select().from(message).where(eq(message.id, id));

    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    const [updatedMessage] = await this.dbService.db
      .update(message)
      .set(updateMessageDto)
      .where(eq(message.id, id))
      .returning();

    return updatedMessage;
  }

  async deleteMessage(id: string, userId?: string) {
    const [existingMessage] = await this.dbService.db.select().from(message).where(eq(message.id, id));

    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Verify ownership
    if (userId && existingMessage.userId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    // Delete message images first
    await this.dbService.db.delete(messageImage).where(eq(messageImage.messageId, id));

    // Delete message
    const [deletedMessage] = await this.dbService.db.delete(message).where(eq(message.id, id)).returning();

    return deletedMessage;
  }

  async getMessagesByUser(userId: string) {
    const messages = await this.dbService.db
      .select({
        id: message.id,
        message: message.message,
        createdAt: message.createdAt,
        bookingId: message.bookingId,
      })
      .from(message)
      .where(eq(message.userId, userId))
      .orderBy(desc(message.createdAt));

    return messages;
  }

  async addMessageImage(id: string, imageUrl: string) {
    await this.dbService.db.insert(messageImage).values({
      messageId: id,
      image: imageUrl,
    });

    return await this.getMessageById(id);
  }

  async removeMessageImage() {
    // TODO
  }
}
