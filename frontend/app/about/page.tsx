'use client';

export default function About() {
  return (
    <div className="page-gradient about-page">
      <div className="about-page__inner px-4 sm:px-6 lg:px-8">
        <header className="about-hero">
          <span className="about-pill">
            <span className="text-lg" aria-hidden>
              📚
            </span>
            Product data explorer for World of Books
          </span>
          <h1 className="about-title">About Product Explorer</h1>
          <p className="about-lead">
            A production‑ready, full‑stack platform for exploring book catalogues with modern UX and reliable
            data flows.
          </p>
        </header>

        <section className="about-panel" aria-labelledby="about-overview">
          <h2 id="about-overview" className="about-panel__title">
            <span className="text-3xl" aria-hidden>
              📚
            </span>
            Overview
          </h2>
          <div className="about-panel__prose">
            <p>
              Product Explorer is a full-stack web application that enables users to browse and discover products
              from World of Books. The platform features a hierarchical navigation system that allows users to
              explore products from high-level navigation headings, through categories, down to individual product
              detail pages.
            </p>
            <p>
              Built with modern web technologies, this platform demonstrates scalable architecture, responsive design,
              and production-ready features including data persistence, optimized caching, and accessible UI.
            </p>
          </div>
        </section>

        <section className="about-panel about-panel--accent" aria-labelledby="about-stack">
          <h2 id="about-stack" className="about-panel__title">
            <span className="text-3xl" aria-hidden>
              ⚙️
            </span>
            Technical Stack
          </h2>
          <div className="about-two-col">
            <div className="about-subcard">
              <h3>Frontend</h3>
              <ul className="list-none p-0 m-0">
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>Next.js 14</strong> — React framework with App Router
                  </span>
                </li>
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>TypeScript</strong> — Type-safe development
                  </span>
                </li>
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>Tailwind CSS</strong> — Utility-first styling
                  </span>
                </li>
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>SWR</strong> — Data fetching and caching
                  </span>
                </li>
              </ul>
            </div>
            <div className="about-subcard">
              <h3>Backend</h3>
              <ul className="list-none p-0 m-0">
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>NestJS</strong> — Progressive Node.js framework
                  </span>
                </li>
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>PostgreSQL</strong> — Relational database
                  </span>
                </li>
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>Prisma</strong> — Modern ORM
                  </span>
                </li>
                <li className="about-check">
                  <span className="about-check-mark" aria-hidden>
                    ✓
                  </span>
                  <span>
                    <strong>Puppeteer</strong> — Web scraping
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-panel" aria-labelledby="about-features">
          <h2 id="about-features" className="about-panel__title">
            <span className="text-3xl" aria-hidden>
              ✨
            </span>
            Key Features
          </h2>
          <div className="about-features">
            <div className="about-feature">
              <h3>Hierarchical Navigation</h3>
              <p>Browse from navigation headings → categories → products → detailed product pages</p>
            </div>
            <div className="about-feature">
              <h3>Advanced Product Display</h3>
              <p>View product details with reviews, ratings, ISBN, publisher info, and recommendations</p>
            </div>
            <div className="about-feature">
              <h3>Search &amp; Filtering</h3>
              <p>Search products and filter by category with sorting options</p>
            </div>
            <div className="about-feature">
              <h3>Browsing History</h3>
              <p>Track viewed products with client-side and server-side persistence</p>
            </div>
            <div className="about-feature">
              <h3>Responsive Design</h3>
              <p>Fully responsive layout optimized for desktop, tablet, and mobile devices</p>
            </div>
            <div className="about-feature">
              <h3>Accessibility</h3>
              <p>WCAG AA compliant with semantic HTML, ARIA labels, and keyboard navigation</p>
            </div>
          </div>
        </section>

        <section className="about-panel about-panel--accent" aria-labelledby="about-arch">
          <h2 id="about-arch" className="about-panel__title">
            <span className="text-3xl" aria-hidden>
              🏛️
            </span>
            Architecture
          </h2>
          <div className="about-panel__prose space-y-4">
            <p>
              <strong className="text-stone-800">Frontend:</strong> Next.js 14 with App Router provides server-side
              rendering and optimal performance. SWR handles client-side data fetching with automatic caching and
              revalidation.
            </p>
            <p>
              <strong className="text-stone-800">Backend:</strong> NestJS REST API with modular architecture. Prisma
              ORM manages database operations with type-safe queries.
            </p>
            <p>
              <strong className="text-stone-800">Database:</strong> PostgreSQL stores products, categories, reviews,
              and browsing history with proper relational integrity.
            </p>
            <p>
              <strong className="text-stone-800">Scraping:</strong> Puppeteer-based scrapers extract product data
              from World of Books (currently blocked by anti-scraping protection, using seed data instead).
            </p>
          </div>
        </section>

        <section className="about-contact" aria-labelledby="about-contact-heading">
          <h2 id="about-contact-heading">📧 Contact &amp; Resources</h2>
          <div className="about-contact__row">
            <span className="text-2xl shrink-0" aria-hidden>
              🌐
            </span>
            <span>
              <strong>Frontend:</strong> http://localhost:3000
            </span>
          </div>
          <div className="about-contact__row">
            <span className="text-2xl shrink-0" aria-hidden>
              🔌
            </span>
            <span>
              <strong>Backend API:</strong> http://localhost:4001/api
            </span>
          </div>
          <div className="about-contact__row">
            <span className="text-2xl shrink-0" aria-hidden>
              📊
            </span>
            <span>
              <strong>Health Check:</strong> http://localhost:4001/api/health
            </span>
          </div>
          <div className="about-contact__row">
            <span className="text-2xl shrink-0" aria-hidden>
              📖
            </span>
            <span>
              <strong>Data Source:</strong> World of Books
            </span>
          </div>
        </section>

        <div className="about-back-wrap">
          <a href="/" className="about-back">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
