import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './modules/prisma/prisma.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ReviewModule } from './modules/review/review.module';
import { HistoryModule } from './modules/history/history.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { HealthModule } from './modules/health/health.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60000'),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100'),
      },
    ]),
    PrismaModule,
    HealthModule,
    NavigationModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
    HistoryModule,
    ScraperModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
