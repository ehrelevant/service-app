import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { AddressesService } from './addresses.service';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressesService.createAddress(createAddressDto);
  }

  @Get()
  async getAllAddresses() {
    return await this.addressesService.getAllAddresses();
  }

  @Get(':id')
  async getAddressById(@Param('id') id: string) {
    return await this.addressesService.getAddressById(id);
  }

  @Put(':id')
  async updateAddress(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return await this.addressesService.updateAddress(id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAddress(@Param('id') id: string) {
    return await this.addressesService.deleteAddress(id);
  }
}
