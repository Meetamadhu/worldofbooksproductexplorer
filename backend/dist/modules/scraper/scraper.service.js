"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScraperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const navigation_scraper_1 = require("./scrapers/navigation.scraper");
const category_scraper_1 = require("./scrapers/category.scraper");
const product_scraper_1 = require("./scrapers/product.scraper");
const product_detail_scraper_1 = require("./scrapers/product-detail.scraper");
let ScraperService = ScraperService_1 = class ScraperService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ScraperService_1.name);
        this.navigationScraper = new navigation_scraper_1.NavigationScraper(this.prisma);
        this.categoryScraper = new category_scraper_1.CategoryScraper(this.prisma);
        this.productScraper = new product_scraper_1.ProductScraper(this.prisma);
        this.productDetailScraper = new product_detail_scraper_1.ProductDetailScraper(this.prisma);
    }
    async triggerScrape(targetUrl, targetType) {
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
    async runScraper(jobId, targetUrl, targetType) {
        try {
            if (targetType === 'navigation') {
                await this.navigationScraper.scrape(targetUrl);
            }
            else if (targetType === 'category') {
                await this.categoryScraper.scrape(targetUrl);
            }
            else if (targetType === 'product') {
                await this.productScraper.scrape(targetUrl);
            }
            else if (targetType === 'product-detail') {
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
        }
        catch (error) {
            this.logger.error(`Scraping failed:`, error);
            await this.prisma.scrapeJob.update({
                where: { id: jobId },
                data: {
                    status: 'failed',
                    errorLog: error.message,
                    finishedAt: new Date(),
                },
            });
        }
    }
    async getScrapeJobStatus(jobId) {
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
};
exports.ScraperService = ScraperService;
exports.ScraperService = ScraperService = ScraperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScraperService);
