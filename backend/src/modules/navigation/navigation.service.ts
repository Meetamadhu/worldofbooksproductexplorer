import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  async getAllNavigation() {
    return this.prisma.navigation.findMany({
      include: { categories: true },
    });
  }

  async getNavigationById(id: string) {
    return this.prisma.navigation.findUnique({
      where: { id },
      include: { categories: true },
    });
  }
}
