import { PrismaService } from '../prisma/prisma.service';
export declare class NavigationService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllNavigation(): Promise<({
        categories: {
            id: string;
            title: string;
            slug: string;
            lastScrapedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            navigationId: string;
            parentId: string | null;
            productCount: number;
            description: string | null;
            imageUrl: string | null;
        }[];
    } & {
        id: string;
        title: string;
        slug: string;
        sourceUrl: string | null;
        lastScrapedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getNavigationById(id: string): Promise<({
        categories: {
            id: string;
            title: string;
            slug: string;
            lastScrapedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            navigationId: string;
            parentId: string | null;
            productCount: number;
            description: string | null;
            imageUrl: string | null;
        }[];
    } & {
        id: string;
        title: string;
        slug: string;
        sourceUrl: string | null;
        lastScrapedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
