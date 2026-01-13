import { PrismaClient } from '@prisma/client';
export declare class NavigationScraper {
    private prisma;
    private logger;
    constructor(prisma: PrismaClient);
    scrape(baseUrl: string): Promise<void>;
}
