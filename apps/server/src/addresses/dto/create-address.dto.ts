import { ApiProperty } from '@nestjs/swagger';
import { IsLatLong, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty()
  @IsLatLong()
  coordinates: [number, number];
}
