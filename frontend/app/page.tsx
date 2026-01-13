'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Navigation } from '@/lib/types';

export default function Home() {
  const [navigations, setNavigations] = useState<Navigation[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section className="container" style={{ padding: '3rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-blue)' }}>
          Browse by Category
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
        ) : (
          <div className="product-grid">
            {navigations.map((nav) => (
              <Link key={nav.id} href={`/category?navigation=${encodeURIComponent(nav.title)}`}>
                <div className="category-card">
                  <h3>{nav.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
