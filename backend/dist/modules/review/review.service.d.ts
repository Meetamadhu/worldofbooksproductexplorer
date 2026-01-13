import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewService {
    private prisma;
    constructor(prisma: PrismaService);
    getReviewsByProduct(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        productId: string;
        rating: number;
        text: string;
    }[]>;
    getReviewById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        author: string;
        productId: string;
        rating: number;
        text: string;
    } | null>;
}
