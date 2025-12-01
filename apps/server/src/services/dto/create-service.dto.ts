import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsUUID()
  serviceTypeId: string;

  @ApiProperty()
  @IsUUID()
  providerUserId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  initialCost: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
