import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        navigation: true,
      },
    });
  }

  async getCategoriesByNavigation(navigationId: string) {
    return this.prisma.category.findMany({
      where: { navigationId },
    });
  }

  async getCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async getCategoryBySlug(slug: string) {
    return this.prisma.category.findFirst({
      where: { slug },
      include: {
        navigation: true,
      },
    });
  }
}
