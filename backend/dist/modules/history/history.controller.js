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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const history_service_1 = require("./history.service");
let HistoryController = class HistoryController {
    constructor(historyService) {
        this.historyService = historyService;
    }
    async getHistory(sessionId) {
        return this.historyService.getHistory(sessionId);
    }
    async saveHistory(sessionId, body) {
        return this.historyService.saveHistory(sessionId, body.pathJson);
    }
};
exports.HistoryController = HistoryController;
__decorate([
    (0, common_1.Get)(':sessionId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get browsing history',
        description: 'Retrieve browsing history for a specific session'
    }),
    (0, swagger_1.ApiParam)({ name: 'sessionId', type: String, description: 'Session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'History retrieved successfully' }),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)(':sessionId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Save browsing history',
        description: 'Save or update browsing history for a session'
    }),
    (0, swagger_1.ApiParam)({ name: 'sessionId', type: String, description: 'Session ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                pathJson: { type: 'string', description: 'JSON string of visited paths', example: '[{"path":"/products","timestamp":"2026-01-13T10:00:00Z"}]' }
            },
            required: ['pathJson']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'History saved successfully' }),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "saveHistory", null);
exports.HistoryController = HistoryController = __decorate([
    (0, swagger_1.ApiTags)('history'),
    (0, common_1.Controller)('history'),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryController);
