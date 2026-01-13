import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
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
