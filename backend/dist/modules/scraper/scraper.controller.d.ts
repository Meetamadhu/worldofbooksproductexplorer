import { ScraperService } from './scraper.service';
export declare class ScraperController {
    private readonly scraperService;
    constructor(scraperService: ScraperService);
    triggerScrape(body: {
        targetUrl: string;
        targetType: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        targetUrl: string;
        targetType: string;
        status: string;
        startedAt: Date;
        finishedAt: Date | null;
        errorLog: string | null;
    }>;
    scrapeWorldOfBooks(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        targetUrl: string;
        targetType: string;
        status: string;
        startedAt: Date;
        finishedAt: Date | null;
        errorLog: string | null;
    }>;
    getScrapeJobStatus(jobId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        targetUrl: string;
        targetType: string;
        status: string;
        startedAt: Date;
        finishedAt: Date | null;
        errorLog: string | null;
    } | null>;
    getAllJobs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        targetUrl: string;
        targetType: string;
        status: string;
        startedAt: Date;
        finishedAt: Date | null;
        errorLog: string | null;
    }[]>;
}
