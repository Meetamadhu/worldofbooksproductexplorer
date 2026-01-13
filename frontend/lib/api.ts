import { API_BASE_URL } from './constants';
import type { Navigation, Category, Product, ProductDetail, PaginatedResponse, ViewHistory, ScrapeJob } from './types';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Navigation endpoints
  async getNavigations(): Promise<Navigation[]> {
    return this.request<Navigation[]>('/navigation');
  }

  async getNavigation(id: string): Promise<Navigation> {
    return this.request<Navigation>(`/navigation/${id}`);
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategoriesByNavigation(navigationId: string): Promise<Category[]> {
    return this.request<Category[]>(`/categories/navigation/${navigationId}`);
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.request<Category>(`/categories/slug/${slug}`);
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    skip?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    sortBy?: string;
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', params.page.toString());
    if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    
    const endpoint = params?.categoryId
      ? `/products/category/${params.categoryId}?${searchParams}`
      : `/products?${searchParams}`;
    
    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  // Scraper endpoints
  async triggerScrape(targetUrl: string, targetType: 'navigation' | 'category' | 'product') {
    return this.request('/scraper/trigger', {
      method: 'POST',
      body: JSON.stringify({ targetUrl, targetType }),
    });
  }

  async scrapeWorldOfBooks() {
    return this.request('/scraper/scrape-worldofbooks', {
      method: 'POST',
    });
  }

  async getScrapeJobs(): Promise<ScrapeJob[]> {
    return this.request<ScrapeJob[]>('/scraper/jobs');
  }

  async getScrapeJob(jobId: string) {
    return this.request(`/scraper/job/${jobId}`);
  }

  // History endpoints
  async getHistory(limit?: number): Promise<ViewHistory[]> {
    const searchParams = new URLSearchParams();
    if (limit !== undefined) searchParams.set('limit', limit.toString());
    return this.request<ViewHistory[]>(`/history${searchParams.toString() ? `?${searchParams}` : ''}`);
  }

  async saveHistory(productId: string): Promise<ViewHistory> {
    return this.request<ViewHistory>('/history', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
