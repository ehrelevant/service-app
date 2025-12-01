import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';

import { RequestsService } from './requests.service';

import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRequest(@Body() createRequestDto: CreateRequestDto) {
    return await this.requestsService.createRequest(createRequestDto);
  }

  @Get()
  async getAllRequests() {
    return await this.requestsService.getAllRequests();
  }

  @Get(':id')
  async getRequestById(@Param('id') id: string) {
    return await this.requestsService.getRequestById(id);
  }

  @Put(':id')
  async updateRequest(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return await this.requestsService.updateRequest(id, updateRequestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRequest(@Param('id') id: string) {
    return await this.requestsService.deleteRequest(id);
  }

  @Post(':id/images')
  async addRequestImage(@Param('id') id: string, @Body() body: { image: string }) {
    return await this.requestsService.addRequestImage(id, body.image);
  }

  @Delete(':id/images')
  async removeRequestImage(@Param('id') id: string, @Query('imageUrl') imageUrl: string) {
    return await this.requestsService.removeRequestImage(id, imageUrl);
  }
}
