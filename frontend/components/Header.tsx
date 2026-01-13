'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          <span>📚</span>
          <span>Product Explorer</span>
        </Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
        </form>

        <nav>
          <ul className="nav-links">
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/category">Categories</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/admin">🔧 Admin</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
