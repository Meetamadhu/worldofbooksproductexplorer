import type { Product } from './types';

const HISTORY_KEY = 'product_browsing_history';
const MAX_HISTORY_ITEMS = 20;

export interface HistoryItem {
  productId: string;
  title: string;
  imageUrl?: string;
  viewedAt: string;
}

// Get browsing history from localStorage
export function getBrowsingHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load browsing history:', error);
    return [];
  }
}

// Save product to browsing history
export function saveToHistory(product: Product): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getBrowsingHistory();
    
    // Remove existing entry if present
    const filtered = history.filter((item) => item.productId !== product.id);
    
    // Add new entry at the beginning
    const newHistory: HistoryItem[] = [
      {
        productId: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_HISTORY_ITEMS); // Keep only last MAX_HISTORY_ITEMS items
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Failed to save to browsing history:', error);
  }
}

// Clear browsing history
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear browsing history:', error);
  }
}

// Get recent history items
export function getRecentHistory(limit: number = 5): HistoryItem[] {
  return getBrowsingHistory().slice(0, limit);
}