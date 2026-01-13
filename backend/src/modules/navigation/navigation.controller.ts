import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all navigation headings', 
    description: 'Retrieve all top-level navigation headings from World of Books' 
  })
  @ApiResponse({ status: 200, description: 'Navigation headings retrieved successfully' })
  async getAllNavigation() {
    return this.navigationService.getAllNavigation();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get navigation by ID', 
    description: 'Retrieve a specific navigation heading by its ID' 
  })
  @ApiParam({ name: 'id', type: String, description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Navigation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Navigation not found' })
  async getNavigationById(@Param('id') id: string) {
    return this.navigationService.getNavigationById(id);
  }
}
