import React, { useState, useEffect } from 'react';
import { useApi } from '../lib/contexts/ApiContext';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
  error?: string;
  time?: number;
}

const ApiConnectivityTest = () => {
  const api = useApi();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
  const [manualEndpoint, setManualEndpoint] = useState('/health');

  // Endpoints to test
  const endpoints = [
    '/health',
    '/api/cors-test',
    '/api/users/me'
  ];

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
    }
    
    setLoading(false);
  };

  const testEndpoint = async (endpoint: string) => {
    try {
      const startTime = performance.now();
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const endTime = performance.now();
      const timeElapsed = Math.round(endTime - startTime);
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { message: 'Could not parse response as JSON' };
      }
      
      setResults(prev => [...prev, {
        endpoint,
        status: response.ok ? 'success' : 'error',
        message: response.ok ? `Status: ${response.status} OK` : `Failed with status: ${response.status}`,
        data,
        time: timeElapsed
      }]);
      
      // Log response headers for debugging
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      console.log(`Response headers for ${endpoint}:`, headers);
      
    } catch (error) {
      setResults(prev => [...prev, {
        endpoint,
        status: 'error',
        message: 'Request failed to complete',
        error: error instanceof Error ? error.message : String(error)
      }]);
    }
  };

  const testManualEndpoint = async () => {
    await testEndpoint(manualEndpoint);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Connectivity Test</h1>
      
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Configuration</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">API URL:</label>
          <input 
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Test Specific Endpoint:</label>
          <div className="flex">
            <input 
              type="text"
              value={manualEndpoint}
              onChange={(e) => setManualEndpoint(e.target.value)}
              className="flex-grow p-2 border rounded-l"
            />
            <button 
              onClick={testManualEndpoint}
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
              disabled={loading}
            >
              Test
            </button>
          </div>
        </div>
        <button 
          onClick={runAllTests} 
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Run All Tests'}
        </button>
      </div>

      <div className="my-6">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        {results.length === 0 && !loading && (
          <p className="text-gray-500">No tests run yet.</p>
        )}
        {loading && (
          <p className="text-blue-500">Running tests...</p>
        )}
        {results.map((result, index) => (
          <div key={index} className={`border rounded-lg p-4 mb-4 ${
            result.status === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}>
            <h3 className="font-bold">{result.endpoint}</h3>
            <p className={`${
              result.status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.message}
            </p>
            {result.time && (
              <p className="text-gray-500 text-sm">Response time: {result.time}ms</p>
            )}
            {result.error && (
              <div className="mt-2">
                <p className="font-semibold">Error:</p>
                <pre className="bg-red-100 p-2 rounded text-sm overflow-x-auto">
                  {result.error}
                </pre>
              </div>
            )}
            {result.data && (
              <div className="mt-2">
                <p className="font-semibold">Response data:</p>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="my-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">CORS Debugging Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check the response headers for <code>Access-Control-Allow-Origin</code> values</li>
          <li>Ensure the frontend URL is correctly set in the API's allowed origins</li>
          <li>For preflight requests, ensure the API handles OPTIONS requests properly</li>
          <li>Verify both your local and production environment variables</li>
        </ul>
      </div>

      <div className="my-6 bg-yellow-50 p-4 rounded-lg border border-yellow-300">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <div>
          <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
};

export default ApiConnectivityTest; 