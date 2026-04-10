import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h4>📚 Product Explorer</h4>
          <p style={{ color: 'var(--text-gray)', marginBottom: '1rem' }}>
            Discover and explore amazing products from World of Books.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-gray)' }}>
            © 2026 Product Data Explorer
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <Link href="/products">All Products</Link>
          <Link href="/category">Categories</Link>
          <Link href="/about">About Us</Link>
        </div>

        <div>
          <h4>Popular Categories</h4>
          <Link href="/category">Fiction</Link>
          <Link href="/category">Non-Fiction</Link>
          <Link href="/category">Children's Books</Link>
        </div>
      </div>
    </footer>
  );
}
