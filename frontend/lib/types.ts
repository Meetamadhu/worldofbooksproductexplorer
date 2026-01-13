// Navigation types
export interface Navigation {
  id: string;
  title: string;
  slug: string;
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export interface Category {
  id: string;
  navigationId: string;
  title: string;
  slug: string;
  description?: string;
  sourceUrl?: string;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product {
  id: string;
  categoryId: string;
  title: string;
  author?: string;
  price?: number;
  imageUrl?: string;
  sourceUrl?: string;
  hashUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  details?: ProductDetail;
  reviews?: Review[];
}

export interface ProductDetail {
  id: string;
  productId: string;
  description?: string;
  isbn?: string;
  publisher?: string;
  publicationDate?: Date;
  pages?: number;
  language?: string;
  dimensions?: string;
  weight?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  author?: string;
  rating?: number;
  title?: string;
  content?: string;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Scraper types
export interface ScrapeJob {
  id: string;
  type: string;
  status: string;
  startTime: Date;
  endTime?: Date;
  itemsScraped?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// View History types
export interface ViewHistory {
  id: string;
  productId: string;
  viewedAt: Date;
  product?: Product;
}

// Scraper types
export interface ScrapeJob {
  id: string;
  targetUrl: string;
  targetType: string;
  status: string;
  startedAt: Date;
  finishedAt?: Date;
  errorLog?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
