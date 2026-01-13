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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const review_service_1 = require("./review.service");
let ReviewController = class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async getReviewsByProduct(productId) {
        return this.reviewService.getReviewsByProduct(productId);
    }
    async getReviewById(id) {
        return this.reviewService.getReviewById(id);
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get reviews by product',
        description: 'Retrieve all reviews for a specific product'
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: String, description: 'Product ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reviews retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getReviewsByProduct", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get review by ID',
        description: 'Retrieve a specific review by its ID'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Review ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getReviewById", null);
exports.ReviewController = ReviewController = __decorate([
    (0, swagger_1.ApiTags)('reviews'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
