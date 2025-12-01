import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  serviceId: string;

  @ApiProperty()
  @IsString()
  reviewerUserId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
