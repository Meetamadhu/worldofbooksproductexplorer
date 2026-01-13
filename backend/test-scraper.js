#!/usr/bin/env node

/**
 * Script to trigger scraping for World of Books
 * Usage: node test-scraper.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:4001';
const TARGET_URL = 'https://www.worldofbooks.com';

async function triggerScrape(type, url) {
  try {
    console.log(`\n🚀 Triggering ${type} scrape for: ${url}`);
    
    const response = await axios.post(`${API_URL}/api/scraper/trigger`, {
      targetUrl: url,
      targetType: type,
    });

    console.log('✅ Scrape job created:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error triggering scrape:`, error.response?.data || error.message);
    throw error;
  }
}

async function checkStatus(jobId) {
  try {
    const response = await axios.get(`${API_URL}/api/scraper/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error checking status:', error.response?.data || error.message);
    throw error;
  }
}

async function waitForCompletion(jobId, maxWaitTime = 120000) {
  const startTime = Date.now();
  const pollInterval = 2000; // 2 seconds

  while (Date.now() - startTime < maxWaitTime) {
    const status = await checkStatus(jobId);
    console.log(`⏳ Job ${jobId} status: ${status.status}`);

    if (status.status === 'completed') {
      console.log('✅ Scraping completed successfully!');
      return status;
    } else if (status.status === 'failed') {
      console.error('❌ Scraping failed:', status.errorLog);
      throw new Error(`Scraping failed: ${status.errorLog}`);
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Scraping timed out');
}

async function main() {
  try {
    console.log('🌐 World of Books Scraper Test');
    console.log('================================\n');

    // Test 1: Scrape navigation (categories)
    console.log('📋 Test 1: Scraping Navigation...');
    const navJob = await triggerScrape('navigation', TARGET_URL);
    await waitForCompletion(navJob.id);

    // Test 2: Scrape a category (example URL - adjust based on actual site structure)
    console.log('\n📚 Test 2: Scraping Category...');
    const categoryUrl = `${TARGET_URL}/categories/fiction`; // Adjust based on actual URL structure
    const categoryJob = await triggerScrape('category', categoryUrl);
    await waitForCompletion(categoryJob.id);

    // Test 3: Get all jobs
    console.log('\n📊 Fetching all scrape jobs...');
    const allJobs = await axios.get(`${API_URL}/api/scraper/jobs`);
    console.log(`Total jobs: ${allJobs.data.length}`);
    allJobs.data.slice(0, 5).forEach(job => {
      console.log(`  - ${job.targetType}: ${job.status} (${new Date(job.createdAt).toLocaleString()})`);
    });

    console.log('\n✨ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { triggerScrape, checkStatus, waitForCompletion };
