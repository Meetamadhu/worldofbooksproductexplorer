import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getHistory(sessionId: string) {
    return this.prisma.viewHistory.findFirst({
      where: { sessionId },
    });
  }

  async saveHistory(sessionId: string, pathJson: string) {
    const existingHistory = await this.prisma.viewHistory.findFirst({
      where: { sessionId },
    });

    if (existingHistory) {
      return this.prisma.viewHistory.update({
        where: { id: existingHistory.id },
        data: { pathJson },
      });
    }

    return this.prisma.viewHistory.create({
      data: { sessionId, pathJson },
    });
  }
}
