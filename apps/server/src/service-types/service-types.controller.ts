import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { ServiceTypesService } from './service-types.service';

import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';

@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly servicesService: ServiceTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createServiceType(@Body() createServiceTypeDto: CreateServiceTypeDto) {
    return await this.servicesService.createServiceType(createServiceTypeDto);
  }

  @Get()
  async getAllServiceTypes() {
    return await this.servicesService.getAllServiceTypes();
  }

  @Get(':id')
  async getServiceType(@Param('id') id: string) {
    return await this.servicesService.getServiceTypeById(id);
  }

  @Put(':id')
  async updateServiceType(@Param('id') id: string, @Body() updateServiceTypeDto: UpdateServiceTypeDto) {
    return await this.servicesService.updateServiceType(id, updateServiceTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteServiceType(@Param('id') id: string) {
    return await this.servicesService.deleteServiceType(id);
  }
}
