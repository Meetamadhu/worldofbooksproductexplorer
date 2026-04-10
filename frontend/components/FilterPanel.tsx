'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';

interface FilterPanelProps {
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (sortBy: string) => void;
}

export default function FilterPanel({ onCategoryChange, onSortChange }: FilterPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy);
    onSortChange(sortBy);
  };

  return (
    <div
      className="filter-panel"
      style={{
        position: 'sticky',
        top: '5rem',
        background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
        border: '1px solid #1d4ed8',
        borderRadius: '0.75rem',
        padding: '1rem',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
      }}
    >
      <h3
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#1e40af',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid #60a5fa',
          color: '#eff6ff',
          fontWeight: 700,
        }}
      >
        🔍 Filters
      </h3>
      
      {/* Category Filter */}
      <div className="filter-group" style={{ marginBottom: '1rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#dbeafe',
            fontSize: '0.95rem',
          }}
        >
          📚 Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            border: '1px solid #93c5fd',
            borderRadius: '0.5rem',
            backgroundColor: '#ffffff',
            color: '#111827',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="filter-group">
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#dbeafe',
            fontSize: '0.95rem',
          }}
        >
          🔄 Sort By
        </label>
        <select
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            border: '1px solid #93c5fd',
            borderRadius: '0.5rem',
            backgroundColor: '#ffffff',
            color: '#111827',
          }}
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Active Filters Badge */}
      {(selectedCategory || selectedSort) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedSort('');
              onCategoryChange('');
              onSortChange('');
            }}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}