import { PrismaClient } from '@prisma/client';
export declare class ProductDetailScraper {
    private prisma;
    private logger;
    constructor(prisma: PrismaClient);
    scrape(productId: string): Promise<void>;
}
