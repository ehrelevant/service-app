import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  bookingId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
