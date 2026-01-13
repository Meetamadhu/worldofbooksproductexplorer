import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all products', 
    description: 'Retrieve a paginated list of products with optional search and sorting' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 12)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in title and author' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field (price, title, createdAt)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;
    
    return this.productService.getProducts(skip, limitNum, search, sortBy);
  }

  @Get('category/:categoryId')
  @ApiOperation({ 
    summary: 'Get products by category', 
    description: 'Retrieve products belonging to a specific category' 
  })
  @ApiParam({ name: 'categoryId', type: String, description: 'Category ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 12)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;
    
    return this.productService.getProductsByCategory(categoryId, skip, limitNum);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get product by ID', 
    description: 'Retrieve detailed information about a specific product' 
  })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
