"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const navigation_module_1 = require("./modules/navigation/navigation.module");
const category_module_1 = require("./modules/category/category.module");
const product_module_1 = require("./modules/product/product.module");
const review_module_1 = require("./modules/review/review.module");
const history_module_1 = require("./modules/history/history.module");
const scraper_module_1 = require("./modules/scraper/scraper.module");
const health_module_1 = require("./modules/health/health.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: parseInt(process.env.THROTTLE_TTL || '60000'),
                    limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
                },
            ]),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            navigation_module_1.NavigationModule,
            category_module_1.CategoryModule,
            product_module_1.ProductModule,
            review_module_1.ReviewModule,
            history_module_1.HistoryModule,
            scraper_module_1.ScraperModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
