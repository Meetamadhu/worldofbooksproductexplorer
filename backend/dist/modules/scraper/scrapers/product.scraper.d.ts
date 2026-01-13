import { PrismaClient } from '@prisma/client';
export declare class ProductScraper {
    private prisma;
    private logger;
    constructor(prisma: PrismaClient);
    scrape(productUrl: string, categoryId?: string): Promise<void>;
}
