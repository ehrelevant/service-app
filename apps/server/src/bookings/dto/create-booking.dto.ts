import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  providerUserId: string;

  @ApiProperty()
  @IsString()
  serviceId: string;

  @ApiProperty()
  @IsString()
  seekerUserId: string;

  @ApiProperty()
  @IsString()
  requestId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  cost: number;
}
