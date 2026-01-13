"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(skip = 0, take = 12, search, sortBy) {
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
            ];
        }
        const orderBy = {};
        if (sortBy === 'price-asc') {
            orderBy.price = 'asc';
        }
        else if (sortBy === 'price-desc') {
            orderBy.price = 'desc';
        }
        else if (sortBy === 'title') {
            orderBy.title = 'asc';
        }
        else {
            orderBy.createdAt = 'desc';
        }
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy,
                include: { productDetails: true, reviews: true },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data,
            total,
            page: Math.floor(skip / take) + 1,
            limit: take,
        };
    }
    async getProductById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { productDetails: true, reviews: true },
        });
    }
    async getProductsByCategory(categoryId, skip = 0, take = 12) {
        const where = { categoryId };
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: { productDetails: true, reviews: true },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data,
            total,
            page: Math.floor(skip / take) + 1,
            limit: take,
        };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
