import { UserRolesDecorator } from '@app/modules/auth/decorators/role.decorator';
import { JwtGuard } from '@app/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@app/modules/auth/guard/role.guard';
import { CreateReadingIntervalDto } from '@app/modules/reading-interval/dto/create-reading-interval.dto';
import { ReadingIntervalService } from '@app/modules/reading-interval/reading-interval.service';
import { UserRole } from '@app/modules/users/enums/role.enum';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
@ApiTags('Reading Interval')
@ApiBearerAuth()
@Controller({ path: 'reading-intervals', version: ['1'] })
export class ReadingIntervalController {
  constructor(
    private readonly readingIntervalService: ReadingIntervalService,
  ) {}

  @UserRolesDecorator(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new reading interval' })
  @ApiBody({
    description: 'Data for creating a new reading interval',
    type: CreateReadingIntervalDto,
  })
  async create(
    @Body() createReadingIntervalDto: CreateReadingIntervalDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
    return this.readingIntervalService.create(user, createReadingIntervalDto);
  }
}
