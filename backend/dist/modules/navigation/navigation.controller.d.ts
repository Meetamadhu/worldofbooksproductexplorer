import { NavigationService } from './navigation.service';
export declare class NavigationController {
    private readonly navigationService;
    constructor(navigationService: NavigationService);
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
