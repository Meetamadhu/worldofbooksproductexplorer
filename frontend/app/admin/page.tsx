'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { ScrapeJob } from '@/lib/types';

const QUICK_SCRAPES = [
  { label: 'Navigation', url: 'https://www.worldofbooks.com', type: 'navigation' as const },
  { label: 'All Fiction', url: 'https://www.worldofbooks.com/en-gb/collections/fiction', type: 'category' as const },
  { label: 'Crime and Mystery', url: 'https://www.worldofbooks.com/en-gb/collections/crime-and-mystery-books', type: 'category' as const },
  { label: 'Science Fiction', url: 'https://www.worldofbooks.com/en-gb/collections/science-fiction-books', type: 'category' as const },
  { label: 'Fantasy', url: 'https://www.worldofbooks.com/en-gb/collections/fantasy-books', type: 'category' as const },
  { label: 'Romance', url: 'https://www.worldofbooks.com/en-gb/collections/romance-books', type: 'category' as const },
  { label: 'Horror', url: 'https://www.worldofbooks.com/en-gb/collections/horror-books', type: 'category' as const },
  { label: 'Biography', url: 'https://www.worldofbooks.com/en-gb/collections/biography-and-true-stories-books', type: 'category' as const },
  { label: 'Science', url: 'https://www.worldofbooks.com/en-gb/collections/science-books', type: 'category' as const },
  { label: 'Law', url: 'https://www.worldofbooks.com/en-gb/collections/law-books', type: 'category' as const },
  { label: 'Economics', url: 'https://www.worldofbooks.com/en-gb/collections/economics-and-finance-books', type: 'category' as const },
  { label: 'Art and Photography', url: 'https://www.worldofbooks.com/en-gb/collections/art-fashion-and-photography-books', type: 'category' as const },
  { label: 'Cookery', url: 'https://www.worldofbooks.com/en-gb/collections/lifestyle-cooking-and-leisure-books', type: 'category' as const },
  { label: 'Childrens', url: 'https://www.worldofbooks.com/en-gb/collections/all-childrens-books', type: 'category' as const },
  { label: 'Non-Fiction', url: 'https://www.worldofbooks.com/en-gb/collections/all-non-fiction-books', type: 'category' as const },
  { label: 'Video Games', url: 'https://www.worldofbooks.com/en-gb/collections/all-video-games', type: 'category' as const },
];

export default function AdminPage() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [scrapeType, setScrapeType] = useState<'navigation' | 'category' | 'product'>('category');
  const [stats, setStats] = useState({ nav: 0, cats: 0, products: 0 });
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const data = await api.getScrapeJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const [navData, catData, prodData] = await Promise.all([
        api.getNavigations(),
        api.getCategories(),
        api.getProducts({ limit: 1 }),
      ]);
      setStats({ nav: navData.length, cats: catData.length, products: prodData.total });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [fetchJobs, fetchStats]);

  useEffect(() => {
    const hasActive = jobs.some((job) => job.status === 'in_progress');
    if (!hasActive) return;

    const timer = setInterval(() => {
      fetchJobs();
      fetchStats();
    }, 4000);

    return () => clearInterval(timer);
  }, [jobs, fetchJobs, fetchStats]);

  const triggerScrape = async (
    url: string,
    type: 'navigation' | 'category' | 'product',
    label: string,
  ) => {
    if (!url.trim()) {
      setMessage('Please provide a URL.');
      return;
    }

    setLoading(label);
    setMessage('');

    try {
      await api.triggerScrape(url, type);
      setMessage(`${label} scrape started.`);
      setTimeout(() => {
        fetchJobs();
        fetchStats();
      }, 1500);
    } catch (error) {
      console.error('Failed to trigger scrape', error);
      setMessage(`Failed to start ${label} scrape.`);
    } finally {
      setLoading(null);
    }
  };

  const statusBg: Record<string, string> = {
    completed: '#d4edda',
    failed: '#f8d7da',
    in_progress: '#fff3cd',
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--admin-accent)' }}>
        Admin - Scraper Control
      </h1>

      <div className="admin-stat-grid">
        {[
          { label: 'Navigation entries', value: stats.nav },
          { label: 'Categories', value: stats.cats },
          { label: 'Products in DB', value: stats.products },
        ].map((item) => (
          <div key={item.label} className="admin-stat-card">
            <div className="admin-stat-card__value">{item.value}</div>
            <div className="admin-stat-card__label">{item.label}</div>
          </div>
        ))}
      </div>

      {message && (
        <div
          style={{
            padding: '1rem',
            background: message.toLowerCase().includes('failed') ? '#f8d7da' : '#d4edda',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          {message}
        </div>
      )}

      <div className="admin-panel">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Scrape</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {QUICK_SCRAPES.map((item) => (
            <button
              key={item.label}
              onClick={() => triggerScrape(item.url, item.type, item.label)}
              disabled={loading !== null}
              className="btn btn-secondary"
              style={{ opacity: loading === item.label ? 0.6 : 1 }}
            >
              {loading === item.label ? 'Starting...' : item.label}
            </button>
          ))}

          <button
            onClick={() => {
              fetchJobs();
              fetchStats();
            }}
            className="btn btn-secondary"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Custom Scrape</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr auto',
            gap: '0.75rem',
            alignItems: 'end',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.875rem' }}>
              Type
            </label>
            <select
              value={scrapeType}
              onChange={(e) => setScrapeType(e.target.value as 'navigation' | 'category' | 'product')}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-gray)',
                fontSize: '0.875rem',
              }}
            >
              <option value="navigation">navigation</option>
              <option value="category">category</option>
              <option value="product">product</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.875rem' }}>
              Target URL
            </label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://www.worldofbooks.com/en-gb/collections/..."
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-gray)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <button
            onClick={() => triggerScrape(customUrl.trim(), scrapeType, scrapeType)}
            disabled={loading !== null || !customUrl.trim()}
            className="btn btn-primary"
          >
            Run
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Recent Jobs</h2>
          {jobs.some((job) => job.status === 'in_progress') && (
            <span
              style={{
                fontSize: '0.875rem',
                color: '#856404',
                background: '#fff3cd',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
              }}
            >
              Auto-refreshing...
            </span>
          )}
        </div>

        {jobs.length === 0 ? (
          <p style={{ color: 'var(--text-gray)' }}>No jobs yet. Trigger a scrape or refresh.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-gray)', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem' }}>Type</th>
                  <th style={{ padding: '0.6rem' }}>URL</th>
                  <th style={{ padding: '0.6rem' }}>Status</th>
                  <th style={{ padding: '0.6rem' }}>Started</th>
                  <th style={{ padding: '0.6rem' }}>Finished</th>
                  <th style={{ padding: '0.6rem' }}>Error</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border-gray)' }}>
                    <td style={{ padding: '0.6rem' }}>{job.targetType}</td>
                    <td
                      style={{
                        padding: '0.6rem',
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={job.targetUrl}
                    >
                      {job.targetUrl}
                    </td>
                    <td style={{ padding: '0.6rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: statusBg[job.status] ?? '#f1f5f9',
                        }}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem', whiteSpace: 'nowrap' }}>
                      {new Date(job.startedAt ?? job.createdAt).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '0.6rem', whiteSpace: 'nowrap' }}>
                      {job.finishedAt ? new Date(job.finishedAt).toLocaleTimeString() : '-'}
                    </td>
                    <td style={{ padding: '0.6rem' }}>
                      {job.errorLog ? (
                        <button
                          onClick={() => setExpandedError(expandedError === job.id ? null : job.id)}
                          style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                        >
                          {expandedError === job.id ? 'Hide' : 'Show'}
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {expandedError && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#fff5f5',
                  border: '1px solid #f5c2c7',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8rem',
                  color: '#842029',
                }}
              >
                {jobs.find((job) => job.id === expandedError)?.errorLog}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
