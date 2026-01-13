import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';

export class NavigationScraper {
  private logger = new Logger(NavigationScraper.name);

  constructor(private prisma: PrismaClient) {}

  async scrape(baseUrl: string): Promise<void> {
    this.logger.log(`Scraping navigation from ${baseUrl} using Playwright + Crawlee`);

    const prisma = this.prisma;
    const logger = this.logger;
    const headings: { title: string; url: string }[] = [];

    const crawler = new PlaywrightCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
      requestHandlerTimeoutSecs: 60,
      maxRequestRetries: 3,
      maxConcurrency: 2,

      requestHandler: async ({ page }) => {
        logger.log('Scraping homepage...');

        await page.waitForSelector('nav, header', { timeout: 10000 }).catch(() => null);

        const navItems = await page.evaluate(() => {
          const items: { title: string; url: string }[] = [];
          const selectors = [
            'nav a[href*="/en-"]',
            'header a[href*="/en-"]',
            '.navigation a',
            '[role="navigation"] a',
          ];

          for (const selector of selectors) {
            const links = document.querySelectorAll(selector);
            if (links.length > 0) {
              links.forEach((link) => {
                const href = (link as HTMLAnchorElement).href;
                const text = link.textContent?.trim() || '';

                if (
                  text &&
                  href &&
                  !href.includes('account') &&
                  !href.includes('cart') &&
                  !href.includes('search') &&
                  text.length > 2
                ) {
                  items.push({
                    title: text,
                    url: href,
                  });
                }
              });
              break;
            }
          }

          return items;
        });

        const seen = new Set<string>();
        navItems.forEach((item) => {
          if (!seen.has(item.url)) {
            seen.add(item.url);
            headings.push(item);
          }
        });

        logger.log(`✓ Found ${headings.length} navigation headings`);
      },
    });

    try {
      await crawler.run([baseUrl]);
      await crawler.teardown();

      logger.log(`Successfully scraped ${headings.length} navigation items`);

      // Process each navigation item and save to database
      for (const item of headings) {
        try {
          const slug = slugify(item.title);

          await prisma.navigation.upsert({
            where: { slug },
            update: {
              title: item.title,
              sourceUrl: item.url,
              lastScrapedAt: new Date(),
            },
            create: {
              title: item.title,
              slug,
              sourceUrl: item.url,
              lastScrapedAt: new Date(),
            },
          });

          logger.debug(`Created/updated navigation: ${item.title} (${item.url})`);
        } catch (error: any) {
          logger.error(`Failed to create navigation ${item.title}:`, error.message);
        }
      }

      logger.log(`Successfully processed ${headings.length} navigation items into database`);
    } catch (error: any) {
      logger.error(`Failed to scrape navigation:`, error.message);
      throw error;
    }
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .slice(0, 50);
}
