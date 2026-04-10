'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Navigation } from '@/lib/types';

export default function Home() {
  const [navigations, setNavigations] = useState<Navigation[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = ['📚', '🧭', '✨', '🛒', '🧠', '🎯', '📖', '🗂️'];

  useEffect(() => {
    const fetchNavigations = async () => {
      try {
        const data = await api.getNavigations();
        setNavigations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNavigations();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-books-bg" aria-hidden="true">
          <img
            className="hero-book hero-book-1"
            src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=70"
            alt=""
          />
          <img
            className="hero-book hero-book-2"
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=70"
            alt=""
          />
          <img
            className="hero-book hero-book-3"
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=70"
            alt=""
          />
          <img
            className="hero-book hero-book-4"
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=70"
            alt=""
          />
        </div>
        <div className="container">
          <h1>📚 Explore World of Books</h1>
          <p>Discover thousands of amazing books across various categories</p>
          <div style={{ marginTop: '2rem' }}>
            <Link href="/products">
              <button className="btn btn-primary" style={{ marginRight: '1rem' }}>Browse Products</button>
            </Link>
            <Link href="/category">
              <button className="btn btn-secondary">View Categories</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Categories */}
      <section className="container home-categories" style={{ padding: '3rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', textAlign: 'center', color: 'var(--text-dark)' }}>
          Browse by Category
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-gray)', marginBottom: '2rem' }}>
          Jump straight into curated book collections
        </p>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
        ) : (
          <div className="product-grid home-category-grid">
            {navigations.map((nav, index) => (
              <Link key={nav.id} href={`/category?navigation=${encodeURIComponent(nav.title)}`}>
                <div className="category-card home-category-card">
                  <div className="home-category-badge">{categoryIcons[index % categoryIcons.length]}</div>
                  <h3>{nav.title}</h3>
                  <p>Explore collection</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
