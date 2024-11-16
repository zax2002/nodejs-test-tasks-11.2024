import {
  Controller,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AffectedCountResponseDto } from './dto/affected-count-response.dto';
import { CauseUserProblemsRequestDto } from './dto/cause-user-problems-request.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('resolveProblems')
  async resolveUserProblems(): Promise<AffectedCountResponseDto> {
    return await this.usersService.resolveUserProblems();
  }

  @Patch('causeProblems')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async causeUserProblems(
    @Query() dto: CauseUserProblemsRequestDto,
  ): Promise<AffectedCountResponseDto> {
    return await this.usersService.causeUserProblems(dto);
  }
}
