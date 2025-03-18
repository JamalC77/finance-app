import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../lib/config';

export default function CorsTestPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    setApiUrl(API_CONFIG.BASE_URL);
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing CORS with URL:', `${API_CONFIG.BASE_URL}/api/cors-test`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/cors-test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('CORS test response:', data);
      
      setSuccess(true);
      setResponse(data);
    } catch (err) {
      console.error('CORS test error:', err);
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CORS Test</h1>
      
      <div className="mb-6">
        <p className="font-semibold">API URL:</p>
        <pre className="bg-gray-100 p-2 rounded">{apiUrl || 'Not configured'}</pre>
      </div>
      
      <div className="mb-6">
        <p className="font-semibold">Environment:</p>
        <pre className="bg-gray-100 p-2 rounded">
          NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
        </pre>
      </div>
      
      <div className="mb-6">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      {loading && <p>Testing connection...</p>}
      
      {!loading && (
        <div className="mt-6">
          <div className={`p-4 rounded ${success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h2 className="text-xl font-bold mb-2">
              {success ? '✅ Connection Successful' : '❌ Connection Failed'}
            </h2>
            
            {error && (
              <div className="mb-4">
                <p className="font-semibold">Error:</p>
                <pre className="bg-red-50 p-2 rounded">{error}</pre>
              </div>
            )}
            
            {success && response && (
              <div>
                <p className="font-semibold">Response:</p>
                <pre className="bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 