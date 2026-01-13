import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HistoryService } from './history.service';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':sessionId')
  @ApiOperation({ 
    summary: 'Get browsing history', 
    description: 'Retrieve browsing history for a specific session' 
  })
  @ApiParam({ name: 'sessionId', type: String, description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(@Param('sessionId') sessionId: string) {
    return this.historyService.getHistory(sessionId);
  }

  @Post(':sessionId')
  @ApiOperation({ 
    summary: 'Save browsing history', 
    description: 'Save or update browsing history for a session' 
  })
  @ApiParam({ name: 'sessionId', type: String, description: 'Session ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        pathJson: { type: 'string', description: 'JSON string of visited paths', example: '[{"path":"/products","timestamp":"2026-01-13T10:00:00Z"}]' }
      },
      required: ['pathJson']
    }
  })
  @ApiResponse({ status: 201, description: 'History saved successfully' })
  async saveHistory(
    @Param('sessionId') sessionId: string,
    @Body() body: { pathJson: string },
  ) {
    return this.historyService.saveHistory(sessionId, body.pathJson);
  }
}
