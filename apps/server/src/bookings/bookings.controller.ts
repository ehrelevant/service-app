import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  async getAllBookings() {
    return await this.bookingsService.getAllBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return await this.bookingsService.getBookingById(id);
  }

  @Get('provider/:providerUserId')
  async getBookingsByProvider(@Param('providerUserId') providerUserId: string) {
    return await this.bookingsService.getBookingsByProvider(providerUserId);
  }

  @Get('seeker/:seekerUserId')
  async getBookingsBySeeker(@Param('seekerUserId') seekerUserId: string) {
    return await this.bookingsService.getBookingsBySeeker(seekerUserId);
  }

  @Put(':id')
  async updateBooking(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return await this.bookingsService.updateBooking(id, updateBookingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBooking(@Param('id') id: string) {
    return await this.bookingsService.deleteBooking(id);
  }

  @Get(':id/messages')
  async getBookingMessages(@Param('id') id: string) {
    return await this.bookingsService.getBookingMessages(id);
  }
}
