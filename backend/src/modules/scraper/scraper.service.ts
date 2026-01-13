import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheerioCrawler } from 'crawlee';
import { NavigationScraper } from './scrapers/navigation.scraper';
import { CategoryScraper } from './scrapers/category.scraper';
import { ProductScraper } from './scrapers/product.scraper';
import { ProductDetailScraper } from './scrapers/product-detail.scraper';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private navigationScraper: NavigationScraper;
  private categoryScraper: CategoryScraper;
  private productScraper: ProductScraper;
  private productDetailScraper: ProductDetailScraper;

  constructor(private prisma: PrismaService) {
    this.navigationScraper = new NavigationScraper(this.prisma);
    this.categoryScraper = new CategoryScraper(this.prisma);
    this.productScraper = new ProductScraper(this.prisma);
    this.productDetailScraper = new ProductDetailScraper(this.prisma);
  }

  async triggerScrape(targetUrl: string, targetType: string) {
    this.logger.log(`Triggering scrape for ${targetType}: ${targetUrl}`);

    // Create a scrape job record
    const job = await this.prisma.scrapeJob.create({
      data: {
        targetUrl,
        targetType,
        status: 'in_progress',
      },
    });

    // Run scraping in background
    this.runScraper(job.id, targetUrl, targetType).catch((error) => {
      this.logger.error(`Scraping failed for job ${job.id}:`, error);
    });

    return job;
  }

  private async runScraper(jobId: string, targetUrl: string, targetType: string) {
    try {
      if (targetType === 'navigation') {
        await this.navigationScraper.scrape(targetUrl);
      } else if (targetType === 'category') {
        await this.categoryScraper.scrape(targetUrl);
      } else if (targetType === 'product') {
        await this.productScraper.scrape(targetUrl);
      } else if (targetType === 'product-detail') {
        await this.productDetailScraper.scrape(targetUrl);
      }

      // Update job status to completed
      await this.prisma.scrapeJob.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          finishedAt: new Date(),
        },
      });

      this.logger.log(`Scraping completed for job ${jobId}`);
    } catch (error) {
      this.logger.error(`Scraping failed:`, error);
      await this.prisma.scrapeJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          errorLog: (error as Error).message,
          finishedAt: new Date(),
        },
      });
    }
  }

  async getScrapeJobStatus(jobId: string) {
    return this.prisma.scrapeJob.findUnique({
      where: { id: jobId },
    });
  }

  async getAllJobs() {
    return this.prisma.scrapeJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
