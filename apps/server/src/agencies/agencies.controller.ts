import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { AgenciesService } from './agencies.service';

import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAgency(@Body() createAgencyDto: CreateAgencyDto) {
    return await this.agenciesService.createAgency(createAgencyDto);
  }

  @Get()
  async getAllAgencies() {
    return await this.agenciesService.getAllAgencies();
  }

  @Get(':id')
  async getAgencyById(@Param('id') id: string) {
    return await this.agenciesService.getAgencyById(id);
  }

  @Put(':id')
  async updateAgency(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return await this.agenciesService.updateAgency(id, updateAgencyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAgency(@Param('id') id: string) {
    return await this.agenciesService.deleteAgency(id);
  }

  @Get(':id/providers')
  async getAgencyProviders(@Param('id') id: string) {
    return await this.agenciesService.getAgencyProviders(id);
  }

  @Post(':id/providers/:providerUserId')
  async addAgencyProviderByUserId(@Param('id') id: string, @Param('providerUserId') providerUserId: string) {
    return await this.agenciesService.addProviderToAgency(id, providerUserId);
  }

  @Delete(':id/providers/:providerUserId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProviderFromAgency(@Param('id') id: string, @Param('providerUserId') providerUserId: string) {
    return await this.agenciesService.removeProviderFromAgency(id, providerUserId);
  }
}
