import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CauseUserProblemsRequestDto {
  @IsNotEmpty()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  count: number;
}
