import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReviewService } from './review.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:productId')
  @ApiOperation({ 
    summary: 'Get reviews by product', 
    description: 'Retrieve all reviews for a specific product' 
  })
  @ApiParam({ name: 'productId', type: String, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getReviewsByProduct(@Param('productId') productId: string) {
    return this.reviewService.getReviewsByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get review by ID', 
    description: 'Retrieve a specific review by its ID' 
  })
  @ApiParam({ name: 'id', type: String, description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async getReviewById(@Param('id') id: string) {
    return this.reviewService.getReviewById(id);
  }
}
