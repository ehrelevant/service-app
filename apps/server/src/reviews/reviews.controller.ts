import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { ReviewsService } from './reviews.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewsService.createReview(createReviewDto);
  }

  @Get()
  async getAllReviews() {
    return await this.reviewsService.getAllReviews();
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return await this.reviewsService.getReviewById(id);
  }

  @Get('service/:serviceId')
  async getReviewsByService(@Param('serviceId') serviceId: string) {
    return await this.reviewsService.getReviewsByService(serviceId);
  }

  @Put(':id')
  async updateReview(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return await this.reviewsService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('id') id: string) {
    return await this.reviewsService.deleteReview(id);
  }
}
