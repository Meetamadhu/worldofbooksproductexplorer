import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts(skip: number = 0, take: number = 12, search?: string, sortBy?: string) {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === 'price-asc') {
      orderBy.price = 'asc';
    } else if (sortBy === 'price-desc') {
      orderBy.price = 'desc';
    } else if (sortBy === 'title') {
      orderBy.title = 'asc';
    } else {
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

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { productDetails: true, reviews: true },
    });
  }

  async getProductsByCategory(categoryId: string, skip: number = 0, take: number = 12) {
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
}
