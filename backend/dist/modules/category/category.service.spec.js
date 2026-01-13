"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const category_service_1 = require("./category.service");
const prisma_service_1 = require("../prisma/prisma.service");
describe('CategoryService', () => {
    let service;
    let prismaService;
    const mockCategory = {
        id: 'cat-1',
        name: 'Electronics',
        navigationId: 'nav-1',
    };
    const mockPrismaService = {
        category: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                category_service_1.CategoryService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(category_service_1.CategoryService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getCategoriesByNavigation', () => {
        it('should return categories for a navigation', async () => {
            const mockCategories = [mockCategory];
            mockPrismaService.category.findMany.mockResolvedValue(mockCategories);
            const result = await service.getCategoriesByNavigation('nav-1');
            expect(result).toEqual(mockCategories);
            expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
                where: { navigationId: 'nav-1' },
            });
        });
        it('should return empty array when navigation has no categories', async () => {
            mockPrismaService.category.findMany.mockResolvedValue([]);
            const result = await service.getCategoriesByNavigation('empty-nav');
            expect(result).toEqual([]);
        });
        it('should return multiple categories', async () => {
            const mockCategories = [
                mockCategory,
                { ...mockCategory, id: 'cat-2', name: 'Accessories' },
            ];
            mockPrismaService.category.findMany.mockResolvedValue(mockCategories);
            const result = await service.getCategoriesByNavigation('nav-1');
            expect(result).toHaveLength(2);
            expect(result).toEqual(mockCategories);
        });
        it('should handle database errors', async () => {
            mockPrismaService.category.findMany.mockRejectedValue(new Error('Database error'));
            await expect(service.getCategoriesByNavigation('nav-1')).rejects.toThrow('Database error');
        });
    });
    describe('getCategoryById', () => {
        it('should return a category by id', async () => {
            mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
            const result = await service.getCategoryById('cat-1');
            expect(result).toEqual(mockCategory);
            expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
                where: { id: 'cat-1' },
            });
        });
        it('should return null when category does not exist', async () => {
            mockPrismaService.category.findUnique.mockResolvedValue(null);
            const result = await service.getCategoryById('nonexistent');
            expect(result).toBeNull();
        });
        it('should handle database errors', async () => {
            mockPrismaService.category.findUnique.mockRejectedValue(new Error('Database error'));
            await expect(service.getCategoryById('cat-1')).rejects.toThrow('Database error');
        });
    });
});
