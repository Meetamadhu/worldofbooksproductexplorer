import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ 
    summary: 'Health check', 
    description: 'Check if the API is running and responsive' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2026-01-13T10:00:00.000Z' }
      }
    }
  })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
