import { PrismaService } from '../prisma/prisma.service';
export declare class ScraperService {
    private prisma;
    private readonly logger;
    private navigationScraper;
    private categoryScraper;
    private productScraper;
    private productDetailScraper;
    constructor(prisma: PrismaService);
    triggerScrape(targetUrl: string, targetType: string): Promise<{
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
    private runScraper;
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
