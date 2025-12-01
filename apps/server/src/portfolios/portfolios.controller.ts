import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';

import { PortfoliosService } from './portfolios.service';

import { AddPortfolioImageDto } from './dto/add-portfolio-image.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPortfolio(@Body() createPortfolioDto: CreatePortfolioDto) {
    return await this.portfoliosService.createPortfolio(createPortfolioDto);
  }

  @Get()
  async getAllPortfolios() {
    return await this.portfoliosService.getAllPortfolios();
  }

  @Get(':id')
  async getPortfolioById(@Param('id') id: string) {
    return await this.portfoliosService.getPortfolioById(id);
  }

  @Put(':id')
  async updatePortfolio(@Param('id') id: string, @Body() updatePortfolioDto: UpdatePortfolioDto) {
    return await this.portfoliosService.updatePortfolio(id, updatePortfolioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePortfolio(@Param('id') id: string) {
    return await this.portfoliosService.deletePortfolio(id);
  }

  @Post(':id/images')
  async addPortfolioImage(@Param('id') id: string, @Body() addImageDto: AddPortfolioImageDto) {
    return await this.portfoliosService.addPortfolioImage(id, addImageDto);
  }

  @Delete(':id/images')
  async removePortfolioImage(@Param('id') id: string, @Query('imageUrl') imageUrl: string) {
    return await this.portfoliosService.removePortfolioImage(id, imageUrl);
  }
}
