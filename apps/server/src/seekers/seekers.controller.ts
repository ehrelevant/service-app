import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

import { SeekersService } from './seekers.service';

import { CreateSeekerDto } from './dto/create-seeker.dto';

@Controller('seekers')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSeeker(@Body() createSeekerDto: CreateSeekerDto) {
    return await this.seekersService.createSeeker(createSeekerDto);
  }

  @Get()
  async getAllSeekers() {
    return await this.seekersService.getAllSeekers();
  }

  @Get(':userId')
  async getSeekerByUserId(@Param('userId') userId: string) {
    return await this.seekersService.getSeekerByUserId(userId);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeeker(@Param('userId') userId: string) {
    return await this.seekersService.deleteSeeker(userId);
  }

  @Get(':userId/requests')
  async getSeekerRequests(@Param('userId') userId: string) {
    return await this.seekersService.getSeekerRequests(userId);
  }

  @Get(':userId/bookings')
  async getSeekerBookings(@Param('userId') userId: string) {
    return await this.seekersService.getSeekerBookings(userId);
  }
}
