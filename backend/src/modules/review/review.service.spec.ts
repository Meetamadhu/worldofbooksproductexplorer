import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReviewService', () => {
  let service: ReviewService;
  let prismaService: PrismaService;

  const mockReview = {
    id: 'rev-1',
    productId: 'prod-1',
    rating: 5,
    comment: 'Great product!',
    createdAt: new Date('2026-01-01'),
  };

  const mockPrismaService = {
    review: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReviewsByProduct', () => {
    it('should return reviews for a product ordered by createdAt descending', async () => {
      const mockReviews = [mockReview];
      mockPrismaService.review.findMany.mockResolvedValue(mockReviews);

      const result = await service.getReviewsByProduct('prod-1');

      expect(result).toEqual(mockReviews);
      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: { productId: 'prod-1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return multiple reviews in correct order', async () => {
      const mockReviews = [
        { ...mockReview, id: 'rev-1', createdAt: new Date('2026-01-05') },
        { ...mockReview, id: 'rev-2', createdAt: new Date('2026-01-03') },
        { ...mockReview, id: 'rev-3', createdAt: new Date('2026-01-01') },
      ];
      mockPrismaService.review.findMany.mockResolvedValue(mockReviews);

      const result = await service.getReviewsByProduct('prod-1');

      expect(result).toHaveLength(3);
      expect(result[0].createdAt).toEqual(new Date('2026-01-05'));
      expect(result[2].createdAt).toEqual(new Date('2026-01-01'));
    });

    it('should return empty array when product has no reviews', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([]);

      const result = await service.getReviewsByProduct('no-reviews-prod');

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockPrismaService.review.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.getReviewsByProduct('prod-1'),
      ).rejects.toThrow('Database error');
    });
  });

  describe('getReviewById', () => {
    it('should return a review by id', async () => {
      mockPrismaService.review.findUnique.mockResolvedValue(mockReview);

      const result = await service.getReviewById('rev-1');

      expect(result).toEqual(mockReview);
      expect(mockPrismaService.review.findUnique).toHaveBeenCalledWith({
        where: { id: 'rev-1' },
      });
    });

    it('should return null when review does not exist', async () => {
      mockPrismaService.review.findUnique.mockResolvedValue(null);

      const result = await service.getReviewById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockPrismaService.review.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getReviewById('rev-1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
