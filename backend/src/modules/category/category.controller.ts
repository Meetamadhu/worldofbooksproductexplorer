import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all categories', 
    description: 'Retrieve all product categories with their hierarchical relationships' 
  })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('navigation/:navigationId')
  @ApiOperation({ 
    summary: 'Get categories by navigation', 
    description: 'Retrieve all categories belonging to a specific navigation heading' 
  })
  @ApiParam({ name: 'navigationId', type: String, description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Navigation not found' })
  async getCategoriesByNavigation(@Param('navigationId') navigationId: string) {
    return this.categoryService.getCategoriesByNavigation(navigationId);
  }

  @Get('slug/:slug')
  @ApiOperation({ 
    summary: 'Get category by slug', 
    description: 'Retrieve detailed information about a specific category using its slug' 
  })
  @ApiParam({ name: 'slug', type: String, description: 'Category slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get category by ID', 
    description: 'Retrieve detailed information about a specific category' 
  })
  @ApiParam({ name: 'id', type: String, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }
}
