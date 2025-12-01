import { IsString } from 'class-validator';

export class AddPortfolioImageDto {
  @IsString()
  image: string;
}
