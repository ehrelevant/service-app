import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { MessagesService } from './messages.service';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.createMessage(createMessageDto);
  }

  @Get('booking/:bookingId')
  async getMessagesByBooking(@Param('bookingId') bookingId: string) {
    return await this.messagesService.getMessagesByBooking(bookingId);
  }

  @Get(':id')
  async getMessageById(@Param('id') id: string) {
    return await this.messagesService.getMessageById(id);
  }

  @Put(':id')
  async updateMessage(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return await this.messagesService.updateMessage(id, updateMessageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id') id: string) {
    return await this.messagesService.deleteMessage(id);
  }

  @Get('user/:userId')
  async getMessagesByUser(@Param('userId') userId: string) {
    return await this.messagesService.getMessagesByUser(userId);
  }

  @Post(':id/images')
  async addMessageImage(@Param('id') id: string, @Body() body: { image: string }) {
    return await this.messagesService.addMessageImage(id, body.image);
  }
}
