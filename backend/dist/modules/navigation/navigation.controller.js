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
exports.NavigationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const navigation_service_1 = require("./navigation.service");
let NavigationController = class NavigationController {
    constructor(navigationService) {
        this.navigationService = navigationService;
    }
    async getAllNavigation() {
        return this.navigationService.getAllNavigation();
    }
    async getNavigationById(id) {
        return this.navigationService.getNavigationById(id);
    }
};
exports.NavigationController = NavigationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all navigation headings',
        description: 'Retrieve all top-level navigation headings from World of Books'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navigation headings retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getAllNavigation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get navigation by ID',
        description: 'Retrieve a specific navigation heading by its ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Navigation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navigation retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Navigation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigationById", null);
exports.NavigationController = NavigationController = __decorate([
    (0, swagger_1.ApiTags)('navigation'),
    (0, common_1.Controller)('navigation'),
    __metadata("design:paramtypes", [navigation_service_1.NavigationService])
], NavigationController);
