import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistory(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        pathJson: string;
    } | null>;
    saveHistory(sessionId: string, body: {
        pathJson: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        pathJson: string;
    }>;
}
