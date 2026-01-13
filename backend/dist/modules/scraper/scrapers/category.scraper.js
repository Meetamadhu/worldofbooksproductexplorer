"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryScraper = void 0;
const common_1 = require("@nestjs/common");
const crawlee_1 = require("crawlee");
class CategoryScraper {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CategoryScraper.name);
    }
    async scrape(categoryUrl) {
        this.logger.log(`Scraping category from ${categoryUrl} using Playwright + Crawlee`);
        const prisma = this.prisma;
        const logger = this.logger;
        const products = [];
        let categoryData = null;
        const crawler = new crawlee_1.PlaywrightCrawler({
            launchContext: {
                launchOptions: {
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                },
            },
            requestHandlerTimeoutSecs: 60,
            maxRequestRetries: 3,
            maxConcurrency: 1,
            requestHandler: async ({ page }) => {
                logger.log('Loading category page...');
                // Wait for products to load
                await page.waitForSelector('ul.product-grid, .product-list, [data-products]', { timeout: 10000 }).catch(() => {
                    logger.warn('Product container not found');
                });
                // Extract category title
                const categoryTitle = await page.evaluate(() => {
                    return (document.querySelector('h1')?.textContent?.trim() ||
                        document.querySelector('.category-title')?.textContent?.trim() ||
                        document.title.split('|')[0].trim() ||
                        'Books');
                });
                categoryData = { title: categoryTitle };
                logger.log(`Category: ${categoryTitle}`);
                // Wait for dynamic content
                await new Promise(resolve => setTimeout(resolve, 3000));
                // Extract products
                const productData = await page.evaluate(() => {
                    const items = [];
                    const selectors = [
                        'ul.product-grid li.grid__item',
                        'li.grid__item',
                        '.product-item',
                        '.product-card',
                        '[data-product-item]',
                        'article',
                    ];
                    let elements = null;
                    for (const selector of selectors) {
                        elements = document.querySelectorAll(selector);
                        if (elements.length > 0) {
                            break;
                        }
                    }
                    if (elements && elements.length > 0) {
                        elements.forEach((el, index) => {
                            if (index >= 50)
                                return;
                            const titleEl = el.querySelector('h3, h2, .product-title, [class*="title"]');
                            const title = titleEl?.textContent?.trim() || '';
                            const linkEl = el.querySelector('a[href*="/product"], a[href*="/en-gb/"], a');
                            const href = linkEl?.getAttribute('href') || '';
                            const imgEl = el.querySelector('img');
                            const imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
                            const priceEl = el.querySelector('.price, [class*="price"], .money, [class*="money"]');
                            const priceText = priceEl?.textContent?.trim() || '';
                            const priceMatch = priceText.match(/[\d.]+/);
                            const price = priceMatch ? parseFloat(priceMatch[0]) : null;
                            const authorEl = el.querySelector('.author, [class*="author"], .by, [class*="by"]');
                            const author = authorEl?.textContent?.trim().replace(/^by\s+/i, '') || '';
                            if (title && href) {
                                items.push({
                                    title,
                                    author: author || null,
                                    price,
                                    imageUrl,
                                    url: href,
                                });
                            }
                        });
                    }
                    return items;
                });
                products.push(...productData);
                logger.log(`✓ Found ${products.length} products`);
            },
        });
        try {
            await crawler.run([categoryUrl]);
            await crawler.teardown();
            logger.log(`Successfully scraped ${products.length} products`);
            // Get or create navigation
            let nav = await prisma.navigation.findFirst({
                where: { title: 'World of Books' },
            });
            if (!nav) {
                nav = await prisma.navigation.create({
                    data: {
                        title: 'World of Books',
                        slug: 'world-of-books',
                    },
                });
            }
            // Get or create category
            const categorySlug = slugify(categoryData?.title || 'books');
            let category = await prisma.category.findFirst({
                where: {
                    navigationId: nav.id,
                    slug: categorySlug,
                },
            });
            if (!category) {
                category = await prisma.category.create({
                    data: {
                        navigationId: nav.id,
                        title: categoryData?.title || 'Books',
                        slug: categorySlug,
                        lastScrapedAt: new Date(),
                    },
                });
                logger.log(`Created category: ${categoryData?.title}`);
            }
            // Store products in database
            let createdCount = 0;
            let updatedCount = 0;
            for (const prod of products.slice(0, 50)) {
                try {
                    const fullUrl = prod.url.startsWith('http')
                        ? prod.url
                        : new URL(prod.url, categoryUrl).toString();
                    const sourceId = hashUrl(fullUrl);
                    const existingProduct = await prisma.product.findUnique({
                        where: { sourceId },
                    });
                    if (!existingProduct) {
                        const product = await prisma.product.create({
                            data: {
                                sourceId,
                                sourceUrl: fullUrl,
                                categoryId: category.id,
                                title: prod.title,
                                author: prod.author,
                                price: prod.price,
                                currency: 'GBP',
                                imageUrl: prod.imageUrl,
                                lastScrapedAt: new Date(),
                            },
                        });
                        await prisma.productDetail.create({
                            data: {
                                productId: product.id,
                                description: prod.title,
                            },
                        });
                        createdCount++;
                    }
                    else {
                        // Update existing product
                        await prisma.product.update({
                            where: { id: existingProduct.id },
                            data: {
                                title: prod.title,
                                author: prod.author,
                                price: prod.price,
                                imageUrl: prod.imageUrl,
                                lastScrapedAt: new Date(),
                            },
                        });
                        updatedCount++;
                    }
                }
                catch (error) {
                    logger.error(`Failed to save product ${prod.title}:`, error.message);
                }
            }
            logger.log(`Successfully saved ${createdCount} new products and updated ${updatedCount} existing products`);
            // Update category product count
            const productCount = await prisma.product.count({
                where: { categoryId: category.id },
            });
            await prisma.category.update({
                where: { id: category.id },
                data: {
                    productCount,
                    lastScrapedAt: new Date(),
                },
            });
            logger.log(`Updated category product count: ${productCount}`);
        }
        catch (error) {
            logger.error(`Failed to scrape category:`, error.message);
            throw error;
        }
    }
}
exports.CategoryScraper = CategoryScraper;
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/--+/g, '-')
        .slice(0, 50);
}
function extractPrice(text) {
    const match = text.match(/£?([\d.]+)/);
    return match ? parseFloat(match[1]) : null;
}
function hashUrl(url) {
    return require('crypto').createHash('md5').update(url).digest('hex');
}
