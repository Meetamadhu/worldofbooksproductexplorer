'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About Product Explorer</h1>
          <p className="text-xl text-gray-600">
            A production-minded product exploration platform
          </p>
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">📚 Overview</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Product Explorer is a full-stack web application that enables users to browse and discover products 
            from World of Books. The platform features a hierarchical navigation system that allows users to 
            explore products from high-level navigation headings, through categories, down to individual product 
            detail pages.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Built with modern web technologies, this platform demonstrates scalable architecture, responsive 
            design, and production-ready features including data persistence, optimized caching, and accessible UI.
          </p>
        </div>

        {/* Technical Stack */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">⚙️ Technical Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>Next.js 14</strong> - React framework with App Router
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>TypeScript</strong> - Type-safe development
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>Tailwind CSS</strong> - Utility-first styling
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>SWR</strong> - Data fetching and caching
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">Backend</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>NestJS</strong> - Progressive Node.js framework
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>PostgreSQL</strong> - Relational database
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>Prisma</strong> - Modern ORM
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <strong>Puppeteer</strong> - Web scraping
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">✨ Key Features</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hierarchical Navigation
              </h3>
              <p className="text-gray-700">
                Browse from navigation headings → categories → products → detailed product pages
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Advanced Product Display
              </h3>
              <p className="text-gray-700">
                View product details with reviews, ratings, ISBN, publisher info, and recommendations
              </p>
            </div>

            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search & Filtering
              </h3>
              <p className="text-gray-700">
                Search products and filter by category with sorting options
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browsing History
              </h3>
              <p className="text-gray-700">
                Track viewed products with client-side and server-side persistence
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Responsive Design
              </h3>
              <p className="text-gray-700">
                Fully responsive layout optimized for desktop, tablet, and mobile devices
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Accessibility
              </h3>
              <p className="text-gray-700">
                WCAG AA compliant with semantic HTML, ARIA labels, and keyboard navigation
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🏛️ Architecture</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Frontend:</strong> Next.js 14 with App Router provides server-side rendering and 
              optimal performance. SWR handles client-side data fetching with automatic caching and revalidation.
            </p>
            <p>
              <strong>Backend:</strong> NestJS REST API with modular architecture. Prisma ORM manages database 
              operations with type-safe queries.
            </p>
            <p>
              <strong>Database:</strong> PostgreSQL stores products, categories, reviews, and browsing history 
              with proper relational integrity.
            </p>
            <p>
              <strong>Scraping:</strong> Puppeteer-based scrapers extract product data from World of Books 
              (currently blocked by anti-scraping protection, using seed data instead).
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">📧 Contact & Resources</h2>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <strong>Frontend:</strong> http://localhost:3000
            </p>
            <p className="flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              <strong>Backend API:</strong> http://localhost:4001/api
            </p>
            <p className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <strong>Health Check:</strong> http://localhost:4001/api/health
            </p>
            <p className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <strong>Data Source:</strong> World of Books
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
