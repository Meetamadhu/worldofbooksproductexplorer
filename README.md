# Product Data Explorer

A production-ready, full-stack product exploration platform that enables users to browse and discover products from World of Books through a hierarchical navigation system powered by real-time web scraping.

## 🌐 Live Demo

- **Frontend**: [Deployed URL - To be added]
- **Backend API**: [Deployed URL - To be added]
- **API Documentation**: [Backend URL]/api-docs

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Scraping Strategy](#scraping-strategy)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Product Data Explorer is a comprehensive full-stack web application that allows users to explore products from World of Books. The platform features:

- **Hierarchical Navigation**: Browse from high-level navigation headings → categories → products → detailed product pages
- **Real-time Scraping**: On-demand data extraction using Playwright and Crawlee
- **Smart Caching**: Intelligent caching strategies to minimize unnecessary scraping
- **Responsive Design**: Mobile-first, accessible UI with smooth transitions and loading states
- **Persistent History**: Track user browsing patterns both client-side and server-side

## ✨ Features

### Core Features

- 🏠 **Landing Page**: Display navigation headings scraped from World of Books
- 📁 **Category Drilldown**: Explore categories and subcategories with product counts
- 🛍️ **Product Grid**: Paginated product listings with search and sort functionality
- 📖 **Product Details**: Comprehensive product pages with:
  - Full descriptions and metadata
  - User reviews and ratings
  - Recommended products
  - Publisher information, ISBN, publication date
- 📊 **Admin Panel**: Trigger on-demand scrapes for navigation, categories, and products
- 🔍 **Search**: Real-time product search across titles and authors
- 📱 **Responsive**: Mobile-optimized layout with accessible navigation

### Additional Features

- ⚡ **Loading States**: Skeleton screens and smooth transitions
- 🎨 **Modern UI**: Dark blue/orange gradient theme with frosted glass effects
- 📈 **Browsing History**: Client-side localStorage + server-side persistence
- 🔄 **Data Caching**: Smart caching with `lastScrapedAt` timestamps
- 🛡️ **Error Handling**: Comprehensive error boundaries and fallbacks
- ♿ **Accessibility**: WCAG AA compliant with semantic HTML

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching**: [SWR](https://swr.vercel.app/) (Stale-While-Revalidate)
- **State Management**: React Hooks + SWR Cache

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Web Scraping**: 
  - [Crawlee](https://crawlee.dev/) (v3.5.5)
  - [Playwright](https://playwright.dev/)
  - [Puppeteer](https://pptr.dev/) (fallback)
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI (via @nestjs/swagger)

### DevOps & Tools

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Version Control**: Git
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Prettier

## 🏗️ Architecture

### System Overview

```
┌─────────────┐      HTTP/REST      ┌──────────────┐
│   Frontend  │ ◄─────────────────► │   Backend    │
│  (Next.js)  │                      │  (NestJS)    │
└─────────────┘                      └──────┬───────┘
                                            │
                                            │ ORM
                                            ▼
                                     ┌──────────────┐
                                     │  PostgreSQL  │
                                     │   Database   │
                                     └──────────────┘

External:  ┌────────────────────┐
           │ World of Books     │ ◄── Scrapers (Crawlee + Playwright)
           └────────────────────┘
```

### Data Flow

1. **User Request** → Frontend sends API request to Backend
2. **Backend Processing** → Checks cache (lastScrapedAt)
3. **Scraping Decision**:
   - If data is stale → Trigger scraper
   - If data is fresh → Return cached data
4. **Scraper Execution** → Playwright/Crawlee extracts data from World of Books
5. **Data Persistence** → Store/update in PostgreSQL via Prisma
6. **Response** → Return data to Frontend
7. **UI Update** → SWR manages cache and optimistic updates

### Database Schema

See [prisma/schema.prisma](backend/prisma/schema.prisma) for the complete schema.

**Key Entities:**
- `Navigation` - Top-level navigation headings
- `Category` - Categories and subcategories (self-referential)
- `Product` - Product listings with source tracking
- `ProductDetail` - Extended product metadata (publisher, ISBN, etc.)
- `Review` - User reviews and ratings
- `ScrapeJob` - Scraping job tracking and history
- `ViewHistory` - User browsing history

**Key Relationships:**
- Navigation (1) → (N) Category
- Category (1) → (N) Product
- Product (1) → (1) ProductDetail
- Product (1) → (N) Review

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v20+ recommended)
- **npm** or **yarn**
- **PostgreSQL** v14+
- **Docker** (optional, for containerized setup)

### Environment Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/product-data-explorer.git
cd product-data-explorer
```

2. **Create environment files**

**Backend** (`backend/.env`):

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/productdataexplorer"

# Application
PORT=4001
NODE_ENV=development

# CORS (adjust for production)
CORS_ORIGIN=http://localhost:3000

# Scraping (optional)
SCRAPE_DELAY_MS=1000
SCRAPE_TIMEOUT_MS=60000
```

**Frontend** (`frontend/.env.local`):

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4001/api

# Optional: Analytics, monitoring, etc.
```

3. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Database Setup

1. **Start PostgreSQL**

Using Docker:
```bash
docker-compose up -d postgres
```

Or use your local PostgreSQL instance.

2. **Run migrations**

```bash
cd backend
npx prisma migrate deploy
```

3. **Seed the database** (optional)

```bash
npx prisma db seed
```

This will create initial navigation and category data.

### Running Locally

**Option 1: Manual Start**

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option 2: Docker Compose** (Coming soon)

```bash
docker-compose up
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4001/api
- **API Docs**: http://localhost:4001/api-docs
- **Admin Panel**: http://localhost:3000/admin

## 📚 API Documentation

### Main Endpoints

#### Products

```
GET    /api/products              # List all products (paginated)
GET    /api/products/:id          # Get product by ID
GET    /api/products/category/:id # Get products by category
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search in title/author
- `sortBy` - Sort field (price, title, createdAt)
- `order` - Sort order (asc, desc)

#### Categories

```
GET    /api/categories                    # List all categories
GET    /api/categories/:id                # Get category by ID
GET    /api/categories/navigation/:navId  # Get categories by navigation
```

#### Navigation

```
GET    /api/navigation           # List all navigation items
GET    /api/navigation/:id       # Get navigation by ID
```

#### Scraper

```
POST   /api/scraper/trigger      # Trigger manual scrape
GET    /api/scraper/jobs         # List scrape jobs
GET    /api/scraper/job/:id      # Get job status
```

**Trigger Scrape Example:**

```json
POST /api/scraper/trigger
{
  "targetUrl": "https://www.worldofbooks.com/en-gb/collections/law-books",
  "targetType": "category"
}
```

**Target Types:**
- `navigation` - Scrape navigation headings
- `category` - Scrape products from category page
- `product` - Scrape single product details

#### Reviews

```
GET    /api/reviews/product/:id  # Get reviews for product
POST   /api/reviews              # Create review
```

#### History

```
POST   /api/history              # Save browsing history
GET    /api/history/:sessionId   # Get history by session
```

For complete API documentation, visit `/api-docs` when running the backend.

## 🕷️ Scraping Strategy

### Ethical Scraping Practices

1. **Rate Limiting**: 1-second delay between requests
2. **Caching**: Cache results with `lastScrapedAt` timestamps
3. **Deduplication**: Use `sourceId` hashing to prevent duplicates
4. **Error Handling**: Exponential backoff on failures
5. **Respect robots.txt**: Follow site's scraping guidelines

### Scraper Types

1. **Navigation Scraper**: Extracts main navigation headings
2. **Category Scraper**: Extracts products from category listings
3. **Product Scraper**: Extracts detailed product information

### Smart Caching

- Products cached for 24 hours
- Categories cached for 12 hours
- Navigation cached for 7 days
- Re-scrape triggered automatically when data is stale

### Data Extraction

From World of Books, we extract:
- **Product Info**: Title, author, price, images
- **Metadata**: ISBN, publisher, publication date, pages
- **Reviews**: User ratings and review text
- **Relationships**: Category associations

## 📁 Project Structure

```
product-data-explorer/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── product/         # Product CRUD
│   │   │   ├── category/        # Category management
│   │   │   ├── navigation/      # Navigation endpoints
│   │   │   ├── scraper/         # Scraping logic
│   │   │   │   └── scrapers/    # Individual scrapers
│   │   │   ├── review/          # Review system
│   │   │   ├── history/         # Browsing history
│   │   │   └── prisma/          # Database service
│   │   ├── common/              # Shared utilities
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   ├── config/              # App configuration
│   │   └── main.ts              # Entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.ts              # Seed data
│   │   └── migrations/          # Migration history
│   ├── test/                    # E2E tests
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── products/            # Product listing
│   │   ├── product/[id]/        # Product detail
│   │   ├── category/            # Category pages
│   │   ├── admin/               # Admin panel
│   │   ├── about/               # About page
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── Pagination.tsx
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   │   ├── useProducts.ts
│   │   ├── useCategories.ts
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   ├── types.ts             # TypeScript types
│   │   ├── utils.ts             # Utility functions
│   │   └── swr-config.tsx       # SWR configuration
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.js
├── .github/
│   └── workflows/
│       ├── backend-ci.yml       # Backend CI pipeline
│       └── frontend-ci.yml      # Frontend CI pipeline
├── docker-compose.yml           # Docker orchestration
├── README.md                    # This file
├── SCRAPER_README.md            # Scraper documentation
└── .env.example                 # Example environment variables
```

## 🧠 Design Decisions

### Why Next.js App Router?

- **Server Components**: Improved performance with RSC
- **File-based Routing**: Intuitive page organization
- **Built-in Optimization**: Image optimization, code splitting
- **Modern React**: Latest React 18 features

### Why NestJS?

- **TypeScript-first**: Strong typing throughout
- **Modular Architecture**: Easy to scale and maintain
- **Dependency Injection**: Testable, clean code
- **Built-in Features**: Guards, interceptors, pipes out of the box

### Why PostgreSQL + Prisma?

- **Relational Data**: Perfect for hierarchical product data
- **ACID Compliance**: Data integrity for e-commerce
- **Prisma Benefits**: Type-safe queries, easy migrations
- **Performance**: Efficient indexing and querying

### Why Crawlee + Playwright?

- **Reliability**: Handles complex, dynamic websites
- **Maintainability**: Clean scraper code with helpers
- **Features**: Auto-retry, request queuing, concurrency control
- **Browser Automation**: Handles JavaScript-rendered content

### Why SWR?

- **Caching**: Automatic request deduplication
- **Optimistic UI**: Fast perceived performance
- **Revalidation**: Automatic background updates
- **Developer Experience**: Simple API, React-friendly

## 🧪 Testing

### Run Tests

```bash
# Backend unit tests
cd backend
npm test

# Backend e2e tests
npm run test:e2e

# Frontend tests
cd frontend
npm test

# Coverage report
npm run test:cov
```

### Test Coverage

- **Unit Tests**: Service layer, utilities
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Complete user flows

Current test files:
- `backend/src/modules/product/product.service.spec.ts`
- `backend/src/modules/category/category.service.spec.ts`
- `backend/src/modules/review/review.service.spec.ts`
- `backend/test/app.e2e-spec.ts`

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Environment Variables: Add `NEXT_PUBLIC_API_URL`
3. **Deploy**: Automatic deployments on push to main

### Backend Deployment (Render/Railway/Fly.io)

1. **Database**: Create PostgreSQL instance
2. **Configure Environment Variables**:
   - `DATABASE_URL`
   - `PORT`
   - `CORS_ORIGIN` (your frontend URL)
3. **Deploy**:
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`
4. **Run Migrations**: `npx prisma migrate deploy`
5. **Seed Database**: `npx prisma db seed` (optional)

### Docker Deployment

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables for Production

**Backend:**
```env
DATABASE_URL=postgresql://user:password@host:5432/db
PORT=4001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (ESLint/Prettier configured)
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [World of Books](https://www.worldofbooks.com) - Data source
- [NestJS](https://nestjs.com) - Backend framework
- [Next.js](https://nextjs.org) - Frontend framework
- [Prisma](https://prisma.io) - Database ORM
- [Crawlee](https://crawlee.dev) - Web scraping framework

## 📞 Support

If you have any questions or issues, please:
- Open an issue on GitHub
- Check existing documentation
- Contact via email

---

**Built with ❤️ for the Product Data Explorer Assignment**
