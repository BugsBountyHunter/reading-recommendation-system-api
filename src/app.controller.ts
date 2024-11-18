import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '@app/app.service';

@ApiTags('Application')
@Controller({ version: ['1'] })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check Health' })
  @ApiResponse({
    status: 200,
    description: 'check if application is running or not',
  })
  @Get('check-health')
  checkHealth(): string {
    return this.appService.checkHealth();
  }
}
