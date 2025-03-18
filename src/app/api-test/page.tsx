'use client';

import React, { useState, useEffect } from 'react';

// Add metadata for the page
export const metadata = {
  title: 'API Connection Test',
  description: 'Test API connectivity and CORS configuration',
};

// Mark this page as static
export const dynamic = 'force-static';

export default function ApiTest() {
  const [apiUrl, setApiUrl] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('/health');

  // Set initial API URL from environment on client side
  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'https://cfo-line-api.up.railway.app');
  }, []);

  const runTest = async () => {
    if (!apiUrl) return;
    
    setLoading(true);
    try {
      const url = `${apiUrl}${endpoint}`;
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      // Get all headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      // Get response data
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Failed to parse JSON response' };
      }
      
      // Add result
      setResults([{
        url,
        status: response.status,
        statusText: response.statusText,
        headers,
        data,
        timestamp: new Date().toISOString()
      }, ...results]);
      
    } catch (error) {
      console.error('Error:', error);
      setResults([{
        url: `${apiUrl}${endpoint}`,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }, ...results]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded shadow">
        <div className="mb-4">
          <label className="block mb-1">API URL:</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Endpoint:</label>
          <div className="flex">
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="flex-grow p-2 border rounded-l"
            />
            <button 
              onClick={runTest}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
            >
              {loading ? 'Testing...' : 'Test'}
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          Environment API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
        </p>
      </div>
      
      {results.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Test Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded p-4 bg-white shadow">
                <div className="flex justify-between">
                  <h3 className="font-medium">{result.url}</h3>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                
                {result.error ? (
                  <div className="mt-2 p-3 bg-red-50 text-red-700 rounded">
                    <strong>Error:</strong> {result.error}
                    <p className="mt-1 text-sm">This is likely a CORS error. Check your browser console for more details.</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        result.status >= 200 && result.status < 300 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Status: {result.status} {result.statusText}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-medium mb-1">Response Headers:</h4>
                      <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                        {JSON.stringify(result.headers, null, 2)}
                      </pre>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-medium mb-1">Response Data:</h4>
                      <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h2 className="text-lg font-semibold mb-2">CORS Troubleshooting</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Check if the API endpoint includes your origin in its allowed origins</li>
          <li>Verify the API's CORS configuration includes <code>credentials: true</code></li>
          <li>Look for <code>Access-Control-Allow-Origin</code> in the response headers</li>
          <li>Try the simple endpoint tests first (/health, /api/cors-test)</li>
        </ul>
      </div>
    </div>
  );
} 