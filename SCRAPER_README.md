# World of Books Scraper

This scraper fetches real product data from worldofbooks.com and stores it in the database.

## Scraper Types

1. **Navigation Scraper** - Extracts main categories from the homepage
2. **Category Scraper** - Extracts products from a category page
3. **Product Scraper** - Extracts detailed information from a single product page
4. **Product Detail Scraper** - Extracts additional details (reviews, specs) for a product

## API Endpoints

### Trigger a Scrape

```http
POST http://localhost:4000/api/scraper/trigger
Content-Type: application/json

{
  "targetUrl": "https://www.worldofbooks.com",
  "targetType": "navigation"
}
```

**Target Types:**
- `navigation` - Scrape navigation/categories from homepage
- `category` - Scrape products from a category page
- `product` - Scrape single product details
- `product-detail` - Scrape additional product details (reviews, specs)

### Quick Start - Scrape World of Books

```http
POST http://localhost:4000/api/scraper/scrape-worldofbooks
```

This endpoint automatically scrapes the navigation from worldofbooks.com.

### Check Scrape Job Status

```http
GET http://localhost:4000/api/scraper/job/{jobId}
```

### Get All Scrape Jobs

```http
GET http://localhost:4000/api/scraper/jobs
```

Returns the last 20 scrape jobs with their status.

## Using the Test Script

A Node.js test script is provided to automate scraping:

```bash
cd backend
node test-scraper.js
```

This script will:
1. Scrape navigation/categories from worldofbooks.com
2. Scrape products from a category
3. Display all scrape jobs

## Using cURL

### Scrape Navigation

```bash
curl -X POST http://localhost:4000/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://www.worldofbooks.com","targetType":"navigation"}'
```

### Scrape a Category

```bash
curl -X POST http://localhost:4000/api/scraper/trigger \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://www.worldofbooks.com/category/fiction","targetType":"category"}'
```

### Check Job Status

```bash
curl http://localhost:4000/api/scraper/job/{jobId}
```

### List All Jobs

```bash
curl http://localhost:4000/api/scraper/jobs
```

## Using PowerShell

### Scrape Navigation

```powershell
$body = @{
    targetUrl = "https://www.worldofbooks.com"
    targetType = "navigation"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/scraper/trigger" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Check Job Status

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/scraper/job/{jobId}"
```

### List All Jobs

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/scraper/jobs"
```

## How It Works

1. **Navigation Scraper** (`navigation.scraper.ts`)
   - Visits the homepage
   - Extracts category links from navigation menus
   - Creates Navigation and Category records in database
   - Supports multiple selector strategies for flexibility

2. **Category Scraper** (`category.scraper.ts`)
   - Visits a category page
   - Extracts product listings (title, author, price, image, URL)
   - Creates Product and ProductDetail records
   - Limits to first 50 products per category

3. **Product Scraper** (`product.scraper.ts`)
   - Visits a single product page
   - Extracts detailed product information
   - Updates product with additional metadata (ISBN, publisher, pages, etc.)

4. **Product Detail Scraper** (`product-detail.scraper.ts`)
   - Extracts customer reviews
   - Extracts product specifications
   - Updates review counts and ratings

## Scraper Features

- **Multiple Selectors**: Uses fallback selectors to adapt to different page structures
- **Duplicate Prevention**: Uses MD5 hash of URL as sourceId to prevent duplicates
- **Error Handling**: Continues on individual item failures
- **Logging**: Detailed logging of scraping progress
- **Job Tracking**: All scrape jobs are tracked in the database with status
- **Background Processing**: Scraping runs in background without blocking API

## Database Schema

Scraped data is stored in the following tables:
- `Navigation` - Top-level navigation items
- `Category` - Product categories
- `Product` - Product listings with basic info
- `ProductDetail` - Extended product information
- `Review` - Customer reviews
- `ScrapeJob` - Scrape job tracking and status

## Limitations

- Scraping is rate-limited to prevent server overload
- Only one scrape job can run at a time
- Each category is limited to first 50 products
- Navigation scraper limits to first 20 categories

## Troubleshooting

### "Scraping already in progress"
Only one scrape job can run at a time. Wait for the current job to complete.

### "Navigation not found"
Run the navigation scraper first to create the navigation structure.

### "No products found"
The website structure may have changed. Check the selectors in the scraper files.

### Check Scrape Job Logs
Use the `/api/scraper/job/{jobId}` endpoint to see error logs if a job fails.

## Environment Variables

Add to `.env` file:

```env
WOB_BASE_URL=https://www.worldofbooks.com
```

## Next Steps

After scraping:
1. View data in Prisma Studio: `npx prisma studio`
2. Access data via API: `GET http://localhost:4000/api/products`
3. Browse categories: `GET http://localhost:4000/api/navigation`
