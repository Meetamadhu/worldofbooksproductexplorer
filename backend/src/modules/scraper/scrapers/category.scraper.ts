import { PrismaClient, type Category } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';

export class CategoryScraper {
  private logger = new Logger(CategoryScraper.name);

  constructor(private prisma: PrismaClient) {}

  async scrape(categoryUrl: string): Promise<void> {
    this.logger.log(`Scraping category from ${categoryUrl} using Playwright + Crawlee`);

    const prisma = this.prisma;
    const logger = this.logger;
    const products: any[] = [];
    const subcategories: { title: string; url: string }[] = [];
    let categoryData: any = null;

    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
          ],
        },
      },
      requestHandlerTimeoutSecs: 60,
      maxRequestRetries: 3,
      maxConcurrency: 1,

      requestHandler: async ({ page }) => {
        logger.log('Loading category page...');

        // Wait for the network to settle so JS-rendered content is present
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
          logger.warn('Network did not reach idle; continuing with whatever is rendered');
        });

        // Progressive selector probe – try from most-specific to most-generic
        const PRODUCT_SELECTORS = [
          // Algolia InstantSearch (classic and infinite-hits variants)
          '.ais-Hits-list',
          '.ais-Hits-item',
          '.ais-InfiniteHits-list',
          '.ais-InfiniteHits-item',
          // World of Books / Shopify Hydrogen custom classes
          '[class*="ProductCard"]',
          '[class*="product-card"]',
          '[class*="productCard"]',
          '[class*="BookCard"]',
          '[class*="book-card"]',
          // Generic product grid / list containers
          '[data-product-id]',
          '[data-testid*="product"]',
          'article[class*="product"]',
          'article[class*="book"]',
          'li[class*="product"]',
          'li[class*="book"]',
          '.product-grid',
          '.product-list',
          '.products-grid',
          '.books-list',
          '.book-item',
          // Last-resort: any link pointing at a product/book URL
          'a[href*="/products/"]',
          'a[href*="/en-gb/"]',
        ];

        let foundSelector = '';
        for (const sel of PRODUCT_SELECTORS) {
          try {
            await page.waitForSelector(sel, { timeout: 4000 });
            foundSelector = sel;
            logger.log(`Product container located via selector: "${sel}"`);
            break;
          } catch { /* try next */ }
        }

        if (!foundSelector) {
          logger.warn('Product container not found with any known selector');
          // Save a debug snapshot so we can inspect the markup offline
          const html = await page.content().catch(() => '');
          logger.debug(`Page HTML snippet (first 2000 chars): ${html.slice(0, 2000)}`);
        }

        // Extra render buffer for slow JS frameworks
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Extract category title
        const categoryTitle = await page.evaluate(() => {
          return (
            document.querySelector('h1')?.textContent?.trim() ||
            document.querySelector('.category-title')?.textContent?.trim() ||
            document.querySelector('[class*="category-heading"]')?.textContent?.trim() ||
            document.querySelector('[class*="PageTitle"]')?.textContent?.trim() ||
            document.title.split('|')[0].trim() ||
            'Books'
          );
        });

        categoryData = { title: categoryTitle };
        logger.log(`Category: ${categoryTitle}`);

        // Extract products using multiple fallback strategies
        const productData = await page.evaluate(() => {
          const items: any[] = [];

          // Helper: extract text from first matching selector within a root element
          const getText = (root: Element, ...sels: string[]): string => {
            for (const s of sels) {
              const el = root.querySelector(s);
              if (el?.textContent?.trim()) return el.textContent.trim();
            }
            return '';
          };

          // Helper: extract href from first matching anchor within a root element
          const getHref = (root: Element, ...sels: string[]): string => {
            for (const s of sels) {
              const el = root.querySelector<HTMLAnchorElement>(s);
              if (el?.href) return el.href;
              if (el?.getAttribute('href')) return el.getAttribute('href') as string;
            }
            return '';
          };

          // Strategy 1: Algolia InstantSearch variants
          const algoliaContainerSels = [
            '.ais-Hits-list',
            '.ais-InfiniteHits-list',
          ];
          const algoliaItemSels = [
            '.ais-Hits-item',
            '.ais-InfiniteHits-item',
          ];

          for (let ci = 0; ci < algoliaContainerSels.length; ci++) {
            const container = document.querySelector(algoliaContainerSels[ci]);
            const elements = container
              ? container.querySelectorAll<HTMLElement>(algoliaItemSels[ci])
              : document.querySelectorAll<HTMLElement>(algoliaItemSels[ci]);
            if (elements.length > 0) {
              elements.forEach((el, i) => {
                if (i >= 50) return;
                const title = getText(el, 'h3', 'h2', 'h4', '[class*="title"]', '[class*="Title"]', '[class*="name"]');
                const href = getHref(el, 'a[href*="/products/"]', 'a[href*="/en-gb/"]', 'a');
                const imgEl = el.querySelector('img');
                const imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
                const priceText = getText(el, '[class*="price"]', '[class*="Price"]', '.money', '[data-price]');
                const priceMatch = priceText.match(/[\d.]+/);
                const price = priceMatch ? parseFloat(priceMatch[0]) : null;
                const author = getText(el, '[class*="author"]', '[class*="Author"]', '.by').replace(/^by\s+/i, '');
                if (title && href) items.push({ title, author: author || null, price, imageUrl, url: href });
              });
              if (items.length > 0) return items;
            }
          }

          // Strategy 2: generic product card / article elements
          const cardSelectors = [
            '[class*="ProductCard"]',
            '[class*="product-card"]',
            '[class*="productCard"]',
            '[class*="BookCard"]',
            '[class*="book-card"]',
            'article[class*="product"]',
            'article[class*="book"]',
            'li[class*="product"]',
            '[data-product-id]',
            '[data-testid*="product"]',
          ];

          for (const sel of cardSelectors) {
            const elements = document.querySelectorAll<HTMLElement>(sel);
            if (elements.length === 0) continue;
            elements.forEach((el, i) => {
              if (i >= 50) return;
              const title = getText(el, 'h3', 'h2', 'h4', '[class*="title"]', '[class*="Title"]', '[class*="name"]');
              const href = getHref(el, 'a[href*="/products/"]', 'a[href*="/en-gb/"]', 'a');
              const imgEl = el.querySelector('img');
              const imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
              const priceText = getText(el, '[class*="price"]', '[class*="Price"]', '.money');
              const priceMatch = priceText.match(/[\d.]+/);
              const price = priceMatch ? parseFloat(priceMatch[0]) : null;
              const author = getText(el, '[class*="author"]', '[class*="Author"]', '.by').replace(/^by\s+/i, '');
              if (title && href) items.push({ title, author: author || null, price, imageUrl, url: href });
            });
            if (items.length > 0) return items;
          }

          // Strategy 3: fall back to any product-URL anchors on the page
          const productLinks = document.querySelectorAll<HTMLAnchorElement>(
            'a[href*="/products/"], a[href*="/en-gb/books/"], a[href*="/en-gb/product"]'
          );
          const seen = new Set<string>();
          productLinks.forEach((link) => {
            const href = link.href;
            if (!href || seen.has(href)) return;
            seen.add(href);
            const title = link.querySelector('h2,h3,h4,[class*="title"]')?.textContent?.trim()
              || link.getAttribute('aria-label')
              || link.textContent?.trim()
              || '';
            const imgEl = link.querySelector('img');
            const imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
            if (title && title.length > 3) {
              items.push({ title, author: null, price: null, imageUrl, url: href });
            }
          });

          return items;
        });

        products.push(...productData);
        logger.log(`✓ Found ${products.length} products`);

        // If no products were found, try to extract subcategories instead
        if (products.length === 0) {
          const subcatData = await page.evaluate(() => {
            const items: { title: string; url: string }[] = [];
            const selectors = [
              '.collection-list__item a',
              '.collection-list a',
              '.category-list a',
              '.category-tile a',
              '.facet__list a',
              '.collection-grid a',
              '.ais-HierarchicalMenu-link',
              '.level-two__item-link',
              '.menu-drawer__menu-item',
              '[class*="CategoryCard"] a',
              '[class*="category-card"] a',
              'a[href*="/en-gb/collections/"]',
              'a[href*="/en-gb/category/"]',
              'a[href*="/collections/"]',
              'a[href*="/categories/"]',
            ];

            const seen = new Set<string>();

            for (const selector of selectors) {
              const links = document.querySelectorAll<HTMLAnchorElement>(selector);
              if (links.length === 0) continue;

              links.forEach((link) => {
                const href = link.href;
                const text = link.textContent?.trim() || '';
                if (!href || !text || text.length < 3) return;
                if (seen.has(href)) return;
                seen.add(href);
                items.push({ title: text, url: href });
              });

              if (items.length > 0) break;
            }

            return items;
          });

          subcategories.push(...subcatData);
          logger.log(`✓ Found ${subcategories.length} subcategories`);
        }
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

      // Resolve category without duplicates: prefer URL-derived slug, then title slug,
      // then same title under this navigation, then any existing row with same slug.
      const urlSlug = slugFromSourceUrl(categoryUrl);
      const titleSlug = slugify(categoryData?.title || 'books');
      const slugCandidates = [...new Set([urlSlug, titleSlug].filter(Boolean))] as string[];

      let category: Category | null = null;

      for (const s of slugCandidates) {
        const found = await prisma.category.findFirst({
          where: { navigationId: nav.id, slug: s },
        });
        if (found) {
          category = found;
          logger.log(`Found existing category by slug "${s}": ${found.title} (${found.id})`);
          break;
        }
      }

      if (!category && categoryData?.title) {
        const byTitle = await prisma.category.findFirst({
          where: {
            navigationId: nav.id,
            title: categoryData.title,
          },
        });
        if (byTitle) {
          category = byTitle;
          logger.log(`Found existing category by title: ${byTitle.title} (${byTitle.id})`);
        }
      }

      if (!category) {
        for (const s of slugCandidates) {
          const existingBySlug = await prisma.category.findFirst({
            where: { slug: s },
            orderBy: [{ productCount: 'desc' }, { createdAt: 'asc' }],
          });
          if (existingBySlug) {
            category = existingBySlug;
            logger.log(
              `Reusing existing category (global slug "${s}"): ${existingBySlug.title} (${existingBySlug.id})`,
            );
            break;
          }
        }
      }

      const finalSlug = urlSlug || titleSlug;

      if (!category) {
        category = await prisma.category.create({
          data: {
            navigationId: nav.id,
            title: categoryData?.title || 'Books',
            slug: finalSlug,
            lastScrapedAt: new Date(),
          },
        });
        logger.log(`Created category: ${categoryData?.title} (slug: ${finalSlug})`);
      } else {
        await prisma.category.update({
          where: { id: category.id },
          data: { lastScrapedAt: new Date() },
        });
      }

      if (products.length > 0) {
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
            } else {
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
          } catch (error: any) {
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
      } else if (subcategories.length > 0) {
        // No products but we found subcategories – create child categories
        let createdSubcats = 0;
        const parentUrlNorm = normalizeUrlForDedupe(categoryUrl);
        for (const sub of subcategories) {
          try {
            if (normalizeUrlForDedupe(sub.url) === parentUrlNorm) {
              continue;
            }
            const slug = slugify(sub.title);
            // @@unique([navigationId, slug]) — skip if any category with this slug exists
            const existing = await prisma.category.findFirst({
              where: {
                navigationId: nav.id,
                slug,
              },
            });

            if (!existing) {
              await prisma.category.create({
                data: {
                  navigationId: nav.id,
                  parentId: category.id,
                  title: sub.title,
                  slug,
                },
              });
              createdSubcats++;
            }
          } catch (error: any) {
            logger.error(`Failed to create subcategory ${sub.title}:`, error.message);
          }
        }

        logger.log(`Created ${createdSubcats} subcategories under ${category.title}`);
      }
    } catch (error: any) {
      logger.error(`Failed to scrape category:`, error.message);
      throw error;
    }
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .slice(0, 50);
}

/** Last path segment from WOB collection URLs, or search?q=… as a stable slug. */
function slugFromSourceUrl(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    const path = u.pathname.replace(/\/$/, '');
    const segments = path.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (last && last.length > 1 && !last.includes('.')) {
      return last.toLowerCase();
    }
    if (u.pathname.includes('search')) {
      const q = u.searchParams.get('q')?.trim();
      if (q) {
        return slugify(`search-${q}`);
      }
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeUrlForDedupe(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = '';
    u.search = '';
    const path = u.pathname.replace(/\/$/, '') || '/';
    return `${u.origin}${path}`.toLowerCase();
  } catch {
    return raw.split('#')[0].split('?')[0].toLowerCase();
  }
}

function extractPrice(text: string): number | null {
  const match = text.match(/£?([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

function hashUrl(url: string): string {
  return require('crypto').createHash('md5').update(url).digest('hex');
}
