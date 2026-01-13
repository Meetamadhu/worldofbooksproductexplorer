"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    // Global validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Global exception filter
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    // Global interceptors
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    // API prefix
    app.setGlobalPrefix('api');
    // Swagger API Documentation
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Product Data Explorer API')
        .setDescription('RESTful API for exploring products from World of Books. Features on-demand web scraping, hierarchical category navigation, and comprehensive product details.')
        .setVersion('1.0')
        .addTag('products', 'Product catalog and listings')
        .addTag('categories', 'Product categories and navigation')
        .addTag('navigation', 'Top-level navigation headings')
        .addTag('scraper', 'Web scraping operations')
        .addTag('reviews', 'Product reviews and ratings')
        .addTag('history', 'User browsing history')
        .addTag('health', 'Health check endpoints')
        .addServer('http://localhost:4001', 'Local Development')
        .addServer('https://your-api-url.com', 'Production')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        customSiteTitle: 'Product Explorer API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`✅ Application is running on: http://localhost:${port}/api`);
    console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
}
bootstrap().catch((error) => {
    console.error('❌ Failed to bootstrap application:', error);
    process.exit(1);
});
