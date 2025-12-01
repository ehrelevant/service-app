import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';

import { ServicesService } from './services.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.createService(createServiceDto);
  }

  @Get()
  async getAllServices(@Query('type') type?: string, @Query('provider') provider?: string) {
    return await this.servicesService.getAllServices(type, provider);
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return await this.servicesService.getServiceById(id);
  }

  @Get('provider/:providerUserId')
  async getServicesByProvider(@Param('providerUserId') providerUserId: string) {
    return await this.servicesService.getServicesByProvider(providerUserId);
  }

  @Put(':id')
  async updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return await this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteService(@Param('id') id: string) {
    return await this.servicesService.deleteService(id);
  }
}
