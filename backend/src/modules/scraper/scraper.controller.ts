import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';

@ApiTags('scraper')
@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('trigger')
  @ApiOperation({ 
    summary: 'Trigger manual scrape', 
    description: 'Start a web scraping job for a specific URL and type (navigation, category, or product)' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        targetUrl: { type: 'string', example: 'https://www.worldofbooks.com/en-gb/collections/law-books' },
        targetType: { type: 'string', enum: ['navigation', 'category', 'product'], example: 'category' }
      },
      required: ['targetUrl', 'targetType']
    }
  })
  @ApiResponse({ status: 201, description: 'Scrape job started successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  async triggerScrape(@Body() body: { targetUrl: string; targetType: string }) {
    return this.scraperService.triggerScrape(body.targetUrl, body.targetType);
  }

  @Post('scrape-worldofbooks')
  @ApiOperation({ 
    summary: 'Quick scrape World of Books', 
    description: 'Quickly trigger a scrape of World of Books navigation (convenience endpoint)' 
  })
  @ApiResponse({ status: 201, description: 'Scrape job started successfully' })
  async scrapeWorldOfBooks() {
    return this.scraperService.triggerScrape(
      process.env.WOB_BASE_URL || 'https://www.worldofbooks.com',
      'navigation',
    );
  }

  @Get('job/:jobId')
  @ApiOperation({ 
    summary: 'Get scrape job status', 
    description: 'Check the status of a specific scrape job by its ID' 
  })
  @ApiParam({ name: 'jobId', type: String, description: 'Scrape job ID' })
  @ApiResponse({ status: 200, description: 'Job status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getScrapeJobStatus(@Param('jobId') jobId: string) {
    return this.scraperService.getScrapeJobStatus(jobId);
  }

  @Get('jobs')
  @ApiOperation({ 
    summary: 'Get all scrape jobs', 
    description: 'Retrieve a list of all scrape jobs with their status' 
  })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  async getAllJobs() {
    return this.scraperService.getAllJobs();
  }
}
