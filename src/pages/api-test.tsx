import React, { useState } from 'react';
import { API_CONFIG } from '../lib/config';

export default function ApiTestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints = [
    { name: 'Health Check', url: `${API_CONFIG.BASE_URL}/health` },
    { name: 'CORS Test', url: `${API_CONFIG.BASE_URL}/api/cors-test` },
    { name: 'Auth Endpoint', url: `${API_CONFIG.BASE_URL}/api/auth` },
    { name: 'Users Endpoint', url: `${API_CONFIG.BASE_URL}/api/users` },
  ];

  const testEndpoint = async (name: string, url: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const startTime = new Date().getTime();
      const response = await fetch(url);
      const endTime = new Date().getTime();
      
      const statusText = response.statusText;
      const status = response.status;
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Could not parse JSON response' };
      }
      
      setResults(prev => ({
        ...prev,
        [name]: {
          status,
          statusText,
          data,
          time: `${endTime - startTime}ms`
        }
      }));
    } catch (err) {
      console.error(`Error testing ${name}:`, err);
      setResults(prev => ({
        ...prev,
        [name]: {
          status: 'Error',
          statusText: err instanceof Error ? err.message : 'Unknown error',
          data: null,
          time: 'N/A'
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    setLoading(true);
    setResults({});
    
    for (const endpoint of apiEndpoints) {
      await testEndpoint(endpoint.name, endpoint.url);
    }
    
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Tests</h1>
      
      <div className="mb-6">
        <p className="font-semibold mb-2">API Base URL:</p>
        <pre className="bg-gray-100 p-2 rounded">{API_CONFIG.BASE_URL}</pre>
      </div>
      
      <div className="mb-6">
        <button
          onClick={testAllEndpoints}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Test All Endpoints
        </button>
        
        {apiEndpoints.map(endpoint => (
          <button
            key={endpoint.name}
            onClick={() => testEndpoint(endpoint.name, endpoint.url)}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
          >
            Test {endpoint.name}
          </button>
        ))}
      </div>
      
      {loading && <p className="text-blue-500">Testing endpoints...</p>}
      
      {Object.keys(results).length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="mb-4 p-4 border rounded">
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="mb-2">
                <span className="font-semibold">Status:</span> 
                <span className={result.status === 200 ? 'text-green-600' : 'text-red-600'}>
                  {result.status} {result.statusText}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">Response Time:</span> {result.time}
              </p>
              <div>
                <p className="font-semibold mb-1">Response Data:</p>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 