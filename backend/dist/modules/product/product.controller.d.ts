import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getProducts(page?: string, limit?: string, search?: string, sortBy?: string): Promise<{
        data: ({
            productDetails: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                productId: string;
                publisher: string | null;
                publicationDate: Date | null;
                isbn: string | null;
                pages: number | null;
                language: string | null;
                specs: import("@prisma/client/runtime/library").JsonValue | null;
                ratingsAvg: number | null;
                reviewsCount: number;
            } | null;
            reviews: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                author: string;
                productId: string;
                rating: number;
                text: string;
            }[];
        } & {
            id: string;
            title: string;
            sourceUrl: string;
            lastScrapedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            imageUrl: string | null;
            author: string | null;
            sourceId: string;
            categoryId: string | null;
            price: number | null;
            currency: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getProductsByCategory(categoryId: string, page?: string, limit?: string): Promise<{
        data: ({
            productDetails: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                productId: string;
                publisher: string | null;
                publicationDate: Date | null;
                isbn: string | null;
                pages: number | null;
                language: string | null;
                specs: import("@prisma/client/runtime/library").JsonValue | null;
                ratingsAvg: number | null;
                reviewsCount: number;
            } | null;
            reviews: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                author: string;
                productId: string;
                rating: number;
                text: string;
            }[];
        } & {
            id: string;
            title: string;
            sourceUrl: string;
            lastScrapedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            imageUrl: string | null;
            author: string | null;
            sourceId: string;
            categoryId: string | null;
            price: number | null;
            currency: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getProductById(id: string): Promise<({
        productDetails: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            productId: string;
            publisher: string | null;
            publicationDate: Date | null;
            isbn: string | null;
            pages: number | null;
            language: string | null;
            specs: import("@prisma/client/runtime/library").JsonValue | null;
            ratingsAvg: number | null;
            reviewsCount: number;
        } | null;
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            author: string;
            productId: string;
            rating: number;
            text: string;
        }[];
    } & {
        id: string;
        title: string;
        sourceUrl: string;
        lastScrapedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        author: string | null;
        sourceId: string;
        categoryId: string | null;
        price: number | null;
        currency: string;
    }) | null>;
}
