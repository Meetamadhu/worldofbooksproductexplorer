'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { ScrapeJob } from '@/lib/types';

export default function AdminPage() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [scrapeType, setScrapeType] = useState<'navigation' | 'category' | 'product'>('category');

  const handleScrapeNavigation = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.triggerScrape('https://www.worldofbooks.com', 'navigation');
      setMessage('✅ Navigation scraper started! Check jobs below.');
      setTimeout(fetchJobs, 2000);
    } catch (error) {
      setMessage('❌ Failed to start scraper');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeCategory = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.triggerScrape(
        'https://www.worldofbooks.com/en-gb/collections/crime-and-mystery-books',
        'category'
      );
      setMessage('✅ Category scraper started! Check jobs below.');
      setTimeout(fetchJobs, 2000);
    } catch (error) {
      setMessage('❌ Failed to start scraper');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomScrape = async () => {
    if (!customUrl.trim()) {
      setMessage('❌ Please enter a URL');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.triggerScrape(customUrl.trim(), scrapeType);
      setMessage(`✅ ${scrapeType} scraper started! Check jobs below.`);
      setTimeout(fetchJobs, 2000);
    } catch (error) {
      setMessage('❌ Failed to start scraper');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await api.getScrapeJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary-orange)' }}>
        🔧 Admin - Scraper Control
      </h1>

      <div style={{ 
        background: 'var(--bg-white)', 
        padding: '2rem', 
        borderRadius: '12px', 
        border: '1px solid var(--border-gray)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleScrapeNavigation}
            disabled={loading}
            className="btn btn-primary"
          >
            🌐 Scrape Navigation
          </button>
          
          <button
            onClick={handleScrapeCategory}
            disabled={loading}
            className="btn btn-secondary"
          >
            📚 Scrape Crime & Mystery
          </button>

          <button
            onClick={fetchJobs}
            className="btn btn-secondary"
          >
            🔄 Refresh Jobs
          </button>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            {message}
          </div>
        )}
      </div>

      <div style={{ 
        background: 'var(--bg-white)', 
        padding: '2rem', 
        borderRadius: '12px', 
        border: '1px solid var(--border-gray)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Custom Scrape</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Scrape Type</label>
          <select
            value={scrapeType}
            onChange={(e) => setScrapeType(e.target.value as any)}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-gray)',
              fontSize: '1rem'
            }}
          >
            <option value="category">Category (scrapes products from a category page)</option>
            <option value="navigation">Navigation (scrapes main navigation links)</option>
            <option value="product">Product (scrapes single product details)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target URL</label>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://www.worldofbooks.com/en-gb/collections/..."
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-gray)',
              fontSize: '1rem'
            }}
          />
          <small style={{ color: 'var(--text-gray)', marginTop: '0.25rem', display: 'block' }}>
            Example: https://www.worldofbooks.com/en-gb/collections/law-books
          </small>
        </div>

        <button
          onClick={handleCustomScrape}
          disabled={loading || !customUrl.trim()}
          className="btn btn-primary"
        >
          🚀 Start Scraping
        </button>
      </div>

      <div style={{ 
        background: 'var(--bg-white)', 
        padding: '2rem', 
        borderRadius: '12px', 
        border: '1px solid var(--border-gray)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scrape Jobs</h2>
        
        {jobs.length === 0 ? (
          <p style={{ color: 'var(--text-gray)' }}>No jobs yet. Click "Refresh Jobs" to load.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-gray)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>URL</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Started</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Finished</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border-gray)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        background: 'var(--pale-blue)',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        {job.targetType}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.targetUrl}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        background: job.status === 'completed' ? '#d4edda' : job.status === 'failed' ? '#f8d7da' : '#fff3cd',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                      {new Date(job.startedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                      {job.finishedAt ? new Date(job.finishedAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
