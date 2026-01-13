"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const product_service_1 = require("./product.service");
const prisma_service_1 = require("../prisma/prisma.service");
describe('ProductService', () => {
    let service;
    let prismaService;
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
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                product_service_1.ProductService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(product_service_1.ProductService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getProducts', () => {
        it('should return an array of products with default pagination', async () => {
            const mockProducts = [mockProduct];
            mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
            const result = await service.getProducts();
            expect(result).toEqual(mockProducts);
            expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
                include: { productDetails: true, reviews: true },
            });
        });
        it('should return products with custom pagination', async () => {
            const mockProducts = [mockProduct];
            mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
            const result = await service.getProducts(5, 20);
            expect(result).toEqual(mockProducts);
            expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
                skip: 5,
                take: 20,
                include: { productDetails: true, reviews: true },
            });
        });
        it('should return empty array when no products exist', async () => {
            mockPrismaService.product.findMany.mockResolvedValue([]);
            const result = await service.getProducts();
            expect(result).toEqual([]);
        });
        it('should handle database errors', async () => {
            mockPrismaService.product.findMany.mockRejectedValue(new Error('Database error'));
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
            mockPrismaService.product.findUnique.mockRejectedValue(new Error('Database error'));
            await expect(service.getProductById('1')).rejects.toThrow('Database error');
        });
    });
    describe('getProductsByCategory', () => {
        it('should return products for a category with default pagination', async () => {
            const mockProducts = [mockProduct];
            mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
            const result = await service.getProductsByCategory('cat-1');
            expect(result).toEqual(mockProducts);
            expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
                where: { categoryId: 'cat-1' },
                skip: 0,
                take: 10,
                include: { productDetails: true, reviews: true },
            });
        });
        it('should return products for a category with custom pagination', async () => {
            const mockProducts = [mockProduct];
            mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
            const result = await service.getProductsByCategory('cat-1', 10, 25);
            expect(result).toEqual(mockProducts);
            expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
                where: { categoryId: 'cat-1' },
                skip: 10,
                take: 25,
                include: { productDetails: true, reviews: true },
            });
        });
        it('should return empty array when category has no products', async () => {
            mockPrismaService.product.findMany.mockResolvedValue([]);
            const result = await service.getProductsByCategory('empty-cat');
            expect(result).toEqual([]);
        });
        it('should handle database errors', async () => {
            mockPrismaService.product.findMany.mockRejectedValue(new Error('Database error'));
            await expect(service.getProductsByCategory('cat-1')).rejects.toThrow('Database error');
        });
    });
});
