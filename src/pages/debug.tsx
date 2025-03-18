import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../lib/config';

export default function DebugPage() {
  const [fetchedUrl, setFetchedUrl] = useState<string>('');

  useEffect(() => {
    // Add a timestamp to prevent caching
    fetch(`/api/health?t=${Date.now()}`)
      .then(res => {
        setFetchedUrl(res.url);
        return res.json();
      })
      .catch(err => {
        console.error('Fetch error:', err);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Configuration Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">API Config</h2>
        <p><strong>BASE_URL:</strong> {API_CONFIG.BASE_URL}</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Network Test</h2>
        <p><strong>Fetched URL:</strong> {fetchedUrl || 'Fetching...'}</p>
      </div>
      
      <div className="mt-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
} 