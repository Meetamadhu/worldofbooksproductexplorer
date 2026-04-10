import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductService', () => {
  let service: ProductService;
  let prismaService: PrismaService;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    categoryId: 'cat-1',
    productDetails: [],
    reviews: [],
  };

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getProducts', () => {
    it('should return paginated products with default pagination', async () => {
      const mockProducts = [mockProduct];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.getProducts();

      expect(result).toEqual({
        data: mockProducts,
        total: 1,
        page: 1,
        limit: 12,
      });
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 12,
        orderBy: { createdAt: 'desc' },
        include: { productDetails: true, reviews: true },
      });
      expect(mockPrismaService.product.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should return paginated products with custom pagination', async () => {
      const mockProducts = [mockProduct];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(15);

      const result = await service.getProducts(5, 20);

      expect(result).toEqual({
        data: mockProducts,
        total: 15,
        page: 1,
        limit: 20,
      });
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { productDetails: true, reviews: true },
      });
      expect(mockPrismaService.product.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should return empty data when no products exist', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.getProducts();

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 12,
      });
    });

    it('should handle database errors', async () => {
      mockPrismaService.product.findMany.mockRejectedValue(
        new Error('Database error'),
      );
      mockPrismaService.product.count.mockResolvedValue(0);

      await expect(service.getProducts()).rejects.toThrow('Database error');
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.getProductById('1');

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { productDetails: true, reviews: true },
      });
    });

    it('should return null when product does not exist', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      const result = await service.getProductById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockPrismaService.product.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getProductById('1')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for a category with default pagination', async () => {
      const mockProducts = [mockProduct];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.getProductsByCategory('cat-1');

      expect(result).toEqual({
        data: mockProducts,
        total: 1,
        page: 1,
        limit: 12,
      });
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: 'cat-1' },
        skip: 0,
        take: 12,
        orderBy: { createdAt: 'desc' },
        include: { productDetails: true, reviews: true },
      });
      expect(mockPrismaService.product.count).toHaveBeenCalledWith({
        where: { categoryId: 'cat-1' },
      });
    });

    it('should return products for a category with custom pagination', async () => {
      const mockProducts = [mockProduct];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(30);

      const result = await service.getProductsByCategory('cat-1', 10, 25);

      expect(result).toEqual({
        data: mockProducts,
        total: 30,
        page: 1,
        limit: 25,
      });
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: 'cat-1' },
        skip: 10,
        take: 25,
        orderBy: { createdAt: 'desc' },
        include: { productDetails: true, reviews: true },
      });
      expect(mockPrismaService.product.count).toHaveBeenCalledWith({
        where: { categoryId: 'cat-1' },
      });
    });

    it('should return empty data when category has no products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);
      mockPrismaService.product.count.mockResolvedValue(0);

      const result = await service.getProductsByCategory('empty-cat');

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 12,
      });
    });

    it('should handle database errors', async () => {
      mockPrismaService.product.findMany.mockRejectedValue(
        new Error('Database error'),
      );
      mockPrismaService.product.count.mockResolvedValue(0);

      await expect(
        service.getProductsByCategory('cat-1'),
      ).rejects.toThrow('Database error');
    });
  });
});
