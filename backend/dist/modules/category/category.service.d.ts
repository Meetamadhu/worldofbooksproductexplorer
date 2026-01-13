import { PrismaService } from '../prisma/prisma.service';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllCategories(): Promise<({
        navigation: {
            id: string;
            title: string;
            slug: string;
            sourceUrl: string | null;
            lastScrapedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    })[]>;
    getCategoriesByNavigation(navigationId: string): Promise<{
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
    }[]>;
    getCategoryById(id: string): Promise<{
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
    } | null>;
    getCategoryBySlug(slug: string): Promise<({
        navigation: {
            id: string;
            title: string;
            slug: string;
            sourceUrl: string | null;
            lastScrapedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }) | null>;
}
