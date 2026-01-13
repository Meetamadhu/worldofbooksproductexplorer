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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_service_1 = require("./category.service");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }
    async getCategoriesByNavigation(navigationId) {
        return this.categoryService.getCategoriesByNavigation(navigationId);
    }
    async getCategoryBySlug(slug) {
        return this.categoryService.getCategoryBySlug(slug);
    }
    async getCategoryById(id) {
        return this.categoryService.getCategoryById(id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all categories',
        description: 'Retrieve all product categories with their hierarchical relationships'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('navigation/:navigationId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get categories by navigation',
        description: 'Retrieve all categories belonging to a specific navigation heading'
    }),
    (0, swagger_1.ApiParam)({ name: 'navigationId', type: String, description: 'Navigation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Navigation not found' }),
    __param(0, (0, common_1.Param)('navigationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoriesByNavigation", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get category by slug',
        description: 'Retrieve detailed information about a specific category using its slug'
    }),
    (0, swagger_1.ApiParam)({ name: 'slug', type: String, description: 'Category slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get category by ID',
        description: 'Retrieve detailed information about a specific category'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Category ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryById", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
