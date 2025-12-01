import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty()
  @IsString()
  role: 'provider' | 'seeker' | 'admin';
}
