# Product Data Explorer - API Documentation

## Base URL

**Development**: `http://localhost:4001/api`  
**Production**: `https://your-backend-url.com/api`

## Interactive API Documentation

Visit the Swagger UI for interactive API testing:
- **Local**: http://localhost:4001/api-docs
- **Production**: https://your-backend-url.com/api-docs

---

## Table of Contents

1. [Health Check](#health-check)
2. [Products](#products)
3. [Categories](#categories)
4. [Navigation](#navigation)
5. [Reviews](#reviews)
6. [Scraper](#scraper)
7. [History](#history)
8. [Error Responses](#error-responses)

---

## Health Check

### Check API Health

**Endpoint**: `GET /api/health`

**Description**: Check if the API is running and responsive

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T10:00:00.000Z"
}
```

---

## Products

### Get All Products

**Endpoint**: `GET /api/products`

**Description**: Retrieve a paginated list of products with optional search and sorting

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 12 | Items per page |
| search | string | No | - | Search in title and author |
| sortBy | string | No | - | Sort by field (price, title, createdAt) |

**Example Request**:
```bash
GET /api/products?page=1&limit=12&search=law&sortBy=price
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "sourceId": "abc123def456",
      "sourceUrl": "https://www.worldofbooks.com/...",
      "title": "Introduction to Law",
      "author": "John Doe",
      "price": 15.99,
      "currency": "GBP",
      "imageUrl": "https://...",
      "description": "A comprehensive introduction to law...",
      "categoryId": "clx0987654321",
      "lastScrapedAt": "2026-01-13T10:00:00.000Z",
      "createdAt": "2026-01-10T10:00:00.000Z",
      "updatedAt": "2026-01-13T10:00:00.000Z"
    }
  ],
  "total": 90,
  "page": 1,
  "limit": 12
}
```

---

### Get Product by ID

**Endpoint**: `GET /api/products/:id`

**Description**: Retrieve detailed information about a specific product

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID |

**Example Request**:
```bash
GET /api/products/clx1234567890
```

**Response** (200 OK):
```json
{
  "id": "clx1234567890",
  "sourceId": "abc123def456",
  "sourceUrl": "https://www.worldofbooks.com/...",
  "title": "Introduction to Law",
  "author": "John Doe",
  "price": 15.99,
  "currency": "GBP",
  "imageUrl": "https://...",
  "description": "A comprehensive introduction to law...",
  "categoryId": "clx0987654321",
  "lastScrapedAt": "2026-01-13T10:00:00.000Z",
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-01-13T10:00:00.000Z",
  "details": {
    "id": "clx9999999999",
    "productId": "clx1234567890",
    "description": "Full description...",
    "publisher": "Legal Publishers Ltd",
    "publicationDate": "2025-01-01T00:00:00.000Z",
    "isbn": "978-1234567890",
    "pages": 350,
    "language": "English",
    "specs": {
      "format": "Paperback"
    },
    "ratingsAvg": 4.5,
    "reviewsCount": 25
  },
  "reviews": [
    {
      "id": "clx8888888888",
      "productId": "clx1234567890",
      "author": "Jane Smith",
      "rating": 5,
      "text": "Excellent book!",
      "createdAt": "2026-01-12T10:00:00.000Z"
    }
  ]
}
```

---

### Get Products by Category

**Endpoint**: `GET /api/products/category/:categoryId`

**Description**: Retrieve products belonging to a specific category

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| categoryId | string | Category ID |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 12 | Items per page |

**Example Request**:
```bash
GET /api/products/category/clx0987654321?page=1&limit=12
```

**Response**: Same format as "Get All Products"

---

## Categories

### Get All Categories

**Endpoint**: `GET /api/categories`

**Description**: Retrieve all product categories with their hierarchical relationships

**Example Request**:
```bash
GET /api/categories
```

**Response** (200 OK):
```json
[
  {
    "id": "clx0987654321",
    "navigationId": "clx1111111111",
    "parentId": null,
    "title": "Law Books",
    "slug": "law-books",
    "productCount": 45,
    "description": "Legal books and resources",
    "imageUrl": "https://...",
    "lastScrapedAt": "2026-01-13T10:00:00.000Z",
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-13T10:00:00.000Z",
    "children": []
  }
]
```

---

### Get Category by ID

**Endpoint**: `GET /api/categories/:id`

**Description**: Retrieve detailed information about a specific category

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Category ID |

**Example Request**:
```bash
GET /api/categories/clx0987654321
```

---

### Get Categories by Navigation

**Endpoint**: `GET /api/categories/navigation/:navigationId`

**Description**: Retrieve all categories belonging to a specific navigation heading

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| navigationId | string | Navigation ID |

**Example Request**:
```bash
GET /api/categories/navigation/clx1111111111
```

---

## Navigation

### Get All Navigation Headings

**Endpoint**: `GET /api/navigation`

**Description**: Retrieve all top-level navigation headings from World of Books

**Example Request**:
```bash
GET /api/navigation
```

**Response** (200 OK):
```json
[
  {
    "id": "clx1111111111",
    "title": "Books",
    "slug": "books",
    "sourceUrl": "https://www.worldofbooks.com",
    "lastScrapedAt": "2026-01-13T10:00:00.000Z",
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-13T10:00:00.000Z"
  }
]
```

---

### Get Navigation by ID

**Endpoint**: `GET /api/navigation/:id`

**Description**: Retrieve a specific navigation heading by its ID

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Navigation ID |

**Example Request**:
```bash
GET /api/navigation/clx1111111111
```

---

## Reviews

### Get Reviews by Product

**Endpoint**: `GET /api/reviews/product/:productId`

**Description**: Retrieve all reviews for a specific product

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| productId | string | Product ID |

**Example Request**:
```bash
GET /api/reviews/product/clx1234567890
```

**Response** (200 OK):
```json
[
  {
    "id": "clx8888888888",
    "productId": "clx1234567890",
    "author": "Jane Smith",
    "rating": 5,
    "text": "Excellent book! Highly recommend.",
    "createdAt": "2026-01-12T10:00:00.000Z",
    "updatedAt": "2026-01-12T10:00:00.000Z"
  }
]
```

---

### Get Review by ID

**Endpoint**: `GET /api/reviews/:id`

**Description**: Retrieve a specific review by its ID

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Review ID |

**Example Request**:
```bash
GET /api/reviews/clx8888888888
```

---

## Scraper

### Trigger Manual Scrape

**Endpoint**: `POST /api/scraper/trigger`

**Description**: Start a web scraping job for a specific URL and type

**Request Body**:
```json
{
  "targetUrl": "https://www.worldofbooks.com/en-gb/collections/law-books",
  "targetType": "category"
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| targetUrl | string | Yes | URL to scrape |
| targetType | string | Yes | Type of scrape (navigation, category, product) |

**Target Types**:
- `navigation` - Scrape navigation headings from homepage
- `category` - Scrape products from a category page
- `product` - Scrape detailed product information

**Example Request**:
```bash
POST /api/scraper/trigger
Content-Type: application/json

{
  "targetUrl": "https://www.worldofbooks.com/en-gb/collections/law-books",
  "targetType": "category"
}
```

**Response** (201 Created):
```json
{
  "id": "clx7777777777",
  "targetUrl": "https://www.worldofbooks.com/en-gb/collections/law-books",
  "targetType": "category",
  "status": "in_progress",
  "startedAt": "2026-01-13T10:00:00.000Z",
  "finishedAt": null,
  "errorLog": null,
  "createdAt": "2026-01-13T10:00:00.000Z",
  "updatedAt": "2026-01-13T10:00:00.000Z"
}
```

---

### Quick Scrape World of Books

**Endpoint**: `POST /api/scraper/scrape-worldofbooks`

**Description**: Quickly trigger a scrape of World of Books navigation (convenience endpoint)

**Example Request**:
```bash
POST /api/scraper/scrape-worldofbooks
```

**Response**: Same format as "Trigger Manual Scrape"

---

### Get Scrape Job Status

**Endpoint**: `GET /api/scraper/job/:jobId`

**Description**: Check the status of a specific scrape job

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| jobId | string | Scrape job ID |

**Example Request**:
```bash
GET /api/scraper/job/clx7777777777
```

**Response** (200 OK):
```json
{
  "id": "clx7777777777",
  "targetUrl": "https://www.worldofbooks.com/en-gb/collections/law-books",
  "targetType": "category",
  "status": "completed",
  "startedAt": "2026-01-13T10:00:00.000Z",
  "finishedAt": "2026-01-13T10:05:00.000Z",
  "errorLog": null,
  "createdAt": "2026-01-13T10:00:00.000Z",
  "updatedAt": "2026-01-13T10:05:00.000Z"
}
```

**Status Values**:
- `pending` - Job queued but not started
- `in_progress` - Currently scraping
- `completed` - Successfully finished
- `failed` - Encountered an error

---

### Get All Scrape Jobs

**Endpoint**: `GET /api/scraper/jobs`

**Description**: Retrieve a list of all scrape jobs with their status

**Example Request**:
```bash
GET /api/scraper/jobs
```

**Response** (200 OK):
```json
[
  {
    "id": "clx7777777777",
    "targetUrl": "https://www.worldofbooks.com/en-gb/collections/law-books",
    "targetType": "category",
    "status": "completed",
    "startedAt": "2026-01-13T10:00:00.000Z",
    "finishedAt": "2026-01-13T10:05:00.000Z",
    "errorLog": null,
    "createdAt": "2026-01-13T10:00:00.000Z",
    "updatedAt": "2026-01-13T10:05:00.000Z"
  }
]
```

---

## History

### Get Browsing History

**Endpoint**: `GET /api/history/:sessionId`

**Description**: Retrieve browsing history for a specific session

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| sessionId | string | Session ID (can be user ID or browser session ID) |

**Example Request**:
```bash
GET /api/history/session-abc123
```

**Response** (200 OK):
```json
{
  "id": "clx6666666666",
  "sessionId": "session-abc123",
  "pathJson": "[{\"path\":\"/products\",\"timestamp\":\"2026-01-13T10:00:00Z\"},{\"path\":\"/product/clx1234567890\",\"timestamp\":\"2026-01-13T10:05:00Z\"}]",
  "createdAt": "2026-01-13T10:00:00.000Z",
  "updatedAt": "2026-01-13T10:05:00.000Z"
}
```

---

### Save Browsing History

**Endpoint**: `POST /api/history/:sessionId`

**Description**: Save or update browsing history for a session

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| sessionId | string | Session ID |

**Request Body**:
```json
{
  "pathJson": "[{\"path\":\"/products\",\"timestamp\":\"2026-01-13T10:00:00Z\"}]"
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pathJson | string | Yes | JSON string of visited paths |

**Example Request**:
```bash
POST /api/history/session-abc123
Content-Type: application/json

{
  "pathJson": "[{\"path\":\"/products\",\"timestamp\":\"2026-01-13T10:00:00Z\"}]"
}
```

**Response** (201 Created):
```json
{
  "id": "clx6666666666",
  "sessionId": "session-abc123",
  "pathJson": "[{\"path\":\"/products\",\"timestamp\":\"2026-01-13T10:00:00Z\"}]",
  "createdAt": "2026-01-13T10:00:00.000Z",
  "updatedAt": "2026-01-13T10:00:00.000Z"
}
```

---

## Error Responses

### Common Error Codes

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

#### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests",
  "error": "Too Many Requests"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit**: 100 requests per minute per IP
- **Response Header**: `X-RateLimit-Remaining`

When rate limit is exceeded, you'll receive a 429 status code.

---

## CORS

The API supports CORS for the following origins:
- Development: `http://localhost:3000`
- Production: Configured via `CORS_ORIGIN` environment variable

---

## Authentication

Currently, the API does not require authentication. In production, consider implementing:
- API Keys
- JWT Tokens
- OAuth 2.0

---

## Best Practices

1. **Pagination**: Always use pagination for large datasets
2. **Caching**: The API caches scraped data to minimize load on World of Books
3. **Rate Limiting**: Respect rate limits to ensure service availability
4. **Error Handling**: Always check status codes and handle errors gracefully
5. **Search**: Use the search parameter for better user experience
6. **Sorting**: Utilize sortBy parameter for organized results

---

## Example Workflows

### Workflow 1: Browse Products

1. Get all navigation headings: `GET /api/navigation`
2. Get categories for a navigation: `GET /api/categories/navigation/:navigationId`
3. Get products for a category: `GET /api/products/category/:categoryId`
4. Get product details: `GET /api/products/:id`
5. Save browsing history: `POST /api/history/:sessionId`

### Workflow 2: Trigger Data Refresh

1. Trigger category scrape: `POST /api/scraper/trigger`
2. Check job status: `GET /api/scraper/job/:jobId`
3. Once completed, fetch updated products: `GET /api/products/category/:categoryId`

### Workflow 3: Search Products

1. Search products: `GET /api/products?search=law&sortBy=price`
2. Get product details: `GET /api/products/:id`
3. Get related reviews: `GET /api/reviews/product/:id`

---

## Support

For issues or questions:
- GitHub Issues: [Repository Issues](https://github.com/yourusername/product-data-explorer/issues)
- Email: your.email@example.com

---

**Last Updated**: January 13, 2026  
**API Version**: 1.0
