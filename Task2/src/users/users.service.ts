import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AffectedCountResponseDto } from './dto/affected-count-response.dto';
import { CauseUserProblemsRequestDto } from './dto/cause-user-problems-request.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) {}

  async resolveUserProblems(): Promise<AffectedCountResponseDto> {
    const result = await this.database.user.updateMany({
      where: {
        has_problems: true,
      },
      data: {
        has_problems: false,
      },
    });

    return new AffectedCountResponseDto(result.count);
  }

  async causeUserProblems(
    dto: CauseUserProblemsRequestDto,
  ): Promise<AffectedCountResponseDto> {
    const randomUsers = await this.database.$queryRaw<Partial<User>[]>`
      SELECT id FROM public."User"
      WHERE has_problems = false
      ORDER BY RANDOM()
      LIMIT ${dto.count}
    `;

    if (randomUsers.length < dto.count) {
      throw new HttpException(
        `There are not ${dto.count} users without problems in the database`,
        400,
      );
    }

    const result = await this.database.user.updateMany({
      where: {
        id: {
          in: randomUsers.map((user) => user.id),
        },
      },
      data: {
        has_problems: true,
      },
    });

    return new AffectedCountResponseDto(result.count);
  }
}
