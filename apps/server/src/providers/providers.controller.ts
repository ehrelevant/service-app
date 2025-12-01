import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { ProvidersService } from './providers.service';

import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProvider(@Body() createProviderDto: CreateProviderDto) {
    return await this.providersService.createProvider(createProviderDto);
  }

  @Get()
  async getAllProviders() {
    return await this.providersService.getAllProviders();
  }

  @Get(':userId')
  async getProviderByUserId(@Param('userId') userId: string) {
    return await this.providersService.getProviderByUserId(userId);
  }

  @Put(':userId')
  async updateProvider(@Param('userId') userId: string, @Body() updateProviderDto: UpdateProviderDto) {
    return await this.providersService.updateProvider(userId, updateProviderDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProvider(@Param('userId') userId: string) {
    return await this.providersService.deleteProvider(userId);
  }

  @Get(':userId/services')
  async getProviderServices(@Param('userId') userId: string) {
    return await this.providersService.getProviderServices(userId);
  }

  @Get(':userId/bookings')
  async getProviderBookings(@Param('userId') userId: string) {
    return await this.providersService.getProviderBookings(userId);
  }
}
