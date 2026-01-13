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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const scraper_service_1 = require("./scraper.service");
let ScraperController = class ScraperController {
    constructor(scraperService) {
        this.scraperService = scraperService;
    }
    async triggerScrape(body) {
        return this.scraperService.triggerScrape(body.targetUrl, body.targetType);
    }
    async scrapeWorldOfBooks() {
        return this.scraperService.triggerScrape(process.env.WOB_BASE_URL || 'https://www.worldofbooks.com', 'navigation');
    }
    async getScrapeJobStatus(jobId) {
        return this.scraperService.getScrapeJobStatus(jobId);
    }
    async getAllJobs() {
        return this.scraperService.getAllJobs();
    }
};
exports.ScraperController = ScraperController;
__decorate([
    (0, common_1.Post)('trigger'),
    (0, swagger_1.ApiOperation)({
        summary: 'Trigger manual scrape',
        description: 'Start a web scraping job for a specific URL and type (navigation, category, or product)'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                targetUrl: { type: 'string', example: 'https://www.worldofbooks.com/en-gb/collections/law-books' },
                targetType: { type: 'string', enum: ['navigation', 'category', 'product'], example: 'category' }
            },
            required: ['targetUrl', 'targetType']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scrape job started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "triggerScrape", null);
__decorate([
    (0, common_1.Post)('scrape-worldofbooks'),
    (0, swagger_1.ApiOperation)({
        summary: 'Quick scrape World of Books',
        description: 'Quickly trigger a scrape of World of Books navigation (convenience endpoint)'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scrape job started successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "scrapeWorldOfBooks", null);
__decorate([
    (0, common_1.Get)('job/:jobId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get scrape job status',
        description: 'Check the status of a specific scrape job by its ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'jobId', type: String, description: 'Scrape job ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job status retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Job not found' }),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getScrapeJobStatus", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all scrape jobs',
        description: 'Retrieve a list of all scrape jobs with their status'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Jobs retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "getAllJobs", null);
exports.ScraperController = ScraperController = __decorate([
    (0, swagger_1.ApiTags)('scraper'),
    (0, common_1.Controller)('scraper'),
    __metadata("design:paramtypes", [scraper_service_1.ScraperService])
], ScraperController);
