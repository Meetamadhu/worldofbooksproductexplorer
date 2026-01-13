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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async getProducts(page = '1', limit = '12', search, sortBy) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 12;
        const skip = (pageNum - 1) * limitNum;
        return this.productService.getProducts(skip, limitNum, search, sortBy);
    }
    async getProductsByCategory(categoryId, page = '1', limit = '12') {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 12;
        const skip = (pageNum - 1) * limitNum;
        return this.productService.getProductsByCategory(categoryId, skip, limitNum);
    }
    async getProductById(id) {
        return this.productService.getProductById(id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all products',
        description: 'Retrieve a paginated list of products with optional search and sorting'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 12)' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search in title and author' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Sort by field (price, title, createdAt)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get products by category',
        description: 'Retrieve products belonging to a specific category'
    }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', type: String, description: 'Category ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 12)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by ID',
        description: 'Retrieve detailed information about a specific product'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
