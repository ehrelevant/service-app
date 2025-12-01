import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty()
  @IsString()
  serviceTypeId: string;

  @ApiProperty()
  @IsString()
  seekerUserId: string;

  @ApiProperty()
  @IsString()
  addressId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
