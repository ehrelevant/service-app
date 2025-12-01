import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSeekerDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
