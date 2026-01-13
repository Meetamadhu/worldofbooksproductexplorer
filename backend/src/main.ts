import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger API Documentation
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
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
