import { PrismaClient } from '@prisma/client';
export declare class CategoryScraper {
    private prisma;
    private logger;
    constructor(prisma: PrismaClient);
    scrape(categoryUrl: string): Promise<void>;
}
