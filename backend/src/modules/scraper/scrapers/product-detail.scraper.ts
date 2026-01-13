import { PrismaClient } from '@prisma/client';
import { CheerioCrawler } from 'crawlee';
import { Logger } from '@nestjs/common';

export class ProductDetailScraper {
  private logger = new Logger(ProductDetailScraper.name);

  constructor(private prisma: PrismaClient) {}

  async scrape(productId: string): Promise<void> {
    this.logger.log(`Scraping additional details for product ${productId}`);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { productDetails: true },
    });

    if (!product || !product.sourceUrl) {
      this.logger.warn(`Product ${productId} not found or has no source URL`);
      return;
    }

    const prisma = this.prisma;
    const logger = this.logger;

    const crawler = new CheerioCrawler({
      maxRequestsPerCrawl: 1,
      async requestHandler({ request, $ }) {
        logger.debug(`Parsing detailed information from ${request.url}`);

        // Extract reviews
        const reviews: any[] = [];
        const reviewSelectors = [
          '.review',
          '.customer-review',
          '[itemprop="review"]',
          '.product-review',
        ];

        for (const selector of reviewSelectors) {
          $(selector).each((index, element) => {
            const $review = $(element);

            const author =
              $review.find('.reviewer-name').text().trim() ||
              $review.find('[itemprop="author"]').text().trim() ||
              'Anonymous';

            const ratingText =
              $review.find('.rating').text().trim() ||
              $review.find('[itemprop="ratingValue"]').text().trim() ||
              '';

            const text =
              $review.find('.review-text').text().trim() ||
              $review.find('[itemprop="reviewBody"]').text().trim() ||
              $review.find('p').text().trim();

            const rating = parseFloat(ratingText) || 5;

            if (text && text.length > 10) {
              reviews.push({ author, rating, text });
            }
          });

          if (reviews.length > 0) break;
        }

        logger.log(`Found ${reviews.length} reviews`);

        // Save reviews
        for (const rev of reviews.slice(0, 10)) {
          try {
            await prisma.review.create({
              data: {
                productId: product.id,
                author: rev.author,
                rating: rev.rating,
                text: rev.text,
              },
            });
          } catch (error) {
            logger.error(`Failed to create review:`, error);
          }
        }

        // Update review counts
        if (reviews.length > 0) {
          const avgRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

          await prisma.productDetail.update({
            where: { productId: product.id },
            data: {
              ratingsAvg: avgRating,
              reviewsCount: reviews.length,
            },
          });
        }

        // Extract additional specs
        const specs: any = {};

        // Look for specifications table or list
        $('.specifications li, .specs li, .product-specs li').each(
          (index, element) => {
            const text = $(element).text().trim();
            const parts = text.split(':');
            if (parts.length === 2) {
              const key = parts[0].trim().toLowerCase().replace(/\s+/g, '_');
              const value = parts[1].trim();
              specs[key] = value;
            }
          }
        );

        // Look for key-value pairs in tables
        $('.specifications tr, .specs tr, .product-info tr').each(
          (index, element) => {
            const key = $(element).find('th, td:first-child').text().trim();
            const value = $(element).find('td:last-child').text().trim();
            if (key && value) {
              specs[key.toLowerCase().replace(/\s+/g, '_')] = value;
            }
          }
        );

        if (Object.keys(specs).length > 0) {
          const existingSpecs = product.productDetails?.specs || {};
          const mergedSpecs = typeof existingSpecs === 'object' && existingSpecs !== null
            ? { ...existingSpecs, ...specs }
            : specs;
          
          await prisma.productDetail.update({
            where: { productId: product.id },
            data: {
              specs: mergedSpecs,
            },
          });
          logger.log(`Added ${Object.keys(specs).length} specifications`);
        }

        logger.log(`Successfully updated details for product ${productId}`);
      },
    });

    await crawler.run([product.sourceUrl]);
  }
}
