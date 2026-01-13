import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
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
}
