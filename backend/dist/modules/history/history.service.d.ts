import { PrismaService } from '../prisma/prisma.service';
export declare class HistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getHistory(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        pathJson: string;
    } | null>;
    saveHistory(sessionId: string, pathJson: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        pathJson: string;
    }>;
}
