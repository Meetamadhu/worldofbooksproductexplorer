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
exports.ProductScraper = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
class ProductScraper {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ProductScraper.name);
    }
    async scrape(productUrl, categoryId) {
        this.logger.log(`Scraping product from ${productUrl} using Puppeteer`);
        const prisma = this.prisma;
        const logger = this.logger;
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            logger.log(`Navigating to ${productUrl}`);
            await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 60000 });
            logger.debug(`Parsing product details from ${productUrl}`);
            // Extract product information using page.evaluate
            const productData = await page.evaluate(() => {
                const data = {};
                // Extract title
                data.title = (document.querySelector('h1')?.textContent?.trim() ||
                    document.querySelector('.product-title')?.textContent?.trim() ||
                    document.title.split('|')[0].trim());
                // Extract author
                data.author = (document.querySelector('.author')?.textContent?.trim() ||
                    document.querySelector('[class*="author"]')?.textContent?.trim() ||
                    '');
                // Extract price
                const priceText = (document.querySelector('.price')?.textContent?.trim() ||
                    document.querySelector('[class*="price"]')?.textContent?.trim() ||
                    '');
                const priceMatch = priceText.match(/[\d.]+/);
                data.price = priceMatch ? parseFloat(priceMatch[0]) : null;
                // Extract image
                const imgEl = document.querySelector('img[class*="product"], .product-image img, img[itemprop="image"]');
                data.imageUrl = imgEl?.src || imgEl?.dataset.src || '';
                // Extract description
                data.description = (document.querySelector('.description')?.textContent?.trim() ||
                    document.querySelector('[class*="description"]')?.textContent?.trim() ||
                    document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                    '');
                // Extract publisher
                data.publisher = (document.querySelector('[class*="publisher"]')?.textContent?.trim() ||
                    '');
                // Extract ISBN
                data.isbn = (document.querySelector('[class*="isbn"]')?.textContent?.trim() ||
                    '');
                // Extract pages
                const pagesText = document.querySelector('[class*="pages"]')?.textContent || '';
                const pagesMatch = pagesText.match(/\d+/);
                data.pages = pagesMatch ? parseInt(pagesMatch[0]) : null;
                // Extract language
                data.language = (document.querySelector('[class*="language"]')?.textContent?.trim() ||
                    'English');
                // Extract format
                data.format = (document.querySelector('[class*="format"]')?.textContent?.trim() ||
                    '');
                // Extract ratings
                const ratingText = document.querySelector('[class*="rating"]')?.textContent || '';
                const ratingMatch = ratingText.match(/[\d.]+/);
                data.ratingsAvg = ratingMatch ? parseFloat(ratingMatch[0]) : null;
                const reviewCountText = document.querySelector('[class*="review-count"]')?.textContent || '';
                const reviewMatch = reviewCountText.match(/\d+/);
                data.reviewsCount = reviewMatch ? parseInt(reviewMatch[0]) : 0;
                return data;
            });
            if (!productData.title) {
                logger.warn('Could not extract product title, skipping');
                return;
            }
            // Find or create category
            let catId = categoryId;
            if (!catId) {
                const defaultCat = await prisma.category.findFirst();
                catId = defaultCat?.id;
                if (!catId) {
                    const nav = await prisma.navigation.findFirst();
                    if (nav) {
                        const newCat = await prisma.category.create({
                            data: {
                                navigationId: nav.id,
                                title: 'General',
                                slug: 'general',
                            },
                        });
                        catId = newCat.id;
                    }
                }
            }
            if (!catId) {
                logger.warn('No category found, skipping product');
                return;
            }
            const sourceId = hashUrl(productUrl);
            // Create or update product
            const product = await prisma.product.upsert({
                where: { sourceId },
                update: {
                    title: productData.title,
                    author: productData.author || null,
                    price: productData.price,
                    currency: 'GBP',
                    imageUrl: productData.imageUrl || null,
                    description: productData.description || null,
                    lastScrapedAt: new Date(),
                },
                create: {
                    sourceId,
                    sourceUrl: productUrl,
                    categoryId: catId,
                    title: productData.title,
                    author: productData.author || null,
                    price: productData.price,
                    currency: 'GBP',
                    imageUrl: productData.imageUrl || null,
                    description: productData.description || null,
                    lastScrapedAt: new Date(),
                },
            });
            // Create or update product details
            const publicationDate = productData.publicationDate ? new Date(productData.publicationDate) : null;
            await prisma.productDetail.upsert({
                where: { productId: product.id },
                update: {
                    description: productData.description || productData.title,
                    publisher: productData.publisher || null,
                    publicationDate,
                    isbn: productData.isbn || null,
                    pages: productData.pages,
                    language: productData.language,
                    specs: productData.format ? { format: productData.format } : {},
                    ratingsAvg: productData.ratingsAvg,
                    reviewsCount: productData.reviewsCount,
                },
                create: {
                    productId: product.id,
                    description: productData.description || productData.title,
                    publisher: productData.publisher || null,
                    publicationDate,
                    isbn: productData.isbn || null,
                    pages: productData.pages,
                    language: productData.language,
                    specs: productData.format ? { format: productData.format } : {},
                    ratingsAvg: productData.ratingsAvg,
                    reviewsCount: productData.reviewsCount,
                },
            });
            logger.log(`Successfully scraped product: ${productData.title}`);
        }
        catch (error) {
            logger.error(`Failed to scrape product:`, error.message);
            throw error;
        }
        finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}
exports.ProductScraper = ProductScraper;
function hashUrl(url) {
    return require('crypto').createHash('md5').update(url).digest('hex');
}
