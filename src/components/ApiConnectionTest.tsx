'use client';

import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../lib/config';
import apiService from '../lib/services/apiService';

const ApiConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Checking API connection...');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    async function checkApiConnection() {
      try {
        setApiUrl(API_CONFIG.BASE_URL);
        const data = await apiService.checkHealth();
        
        setStatus('success');
        setMessage(`Connected to API! Environment: ${data.environment}`);
      } catch (error) {
        setStatus('error');
        setMessage(`Error connecting to API: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    checkApiConnection();
  }, []);

  return (
    <div className="p-4 mb-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">API Connection Status</h2>
      <div className="space-y-2">
        <p className="text-sm">
          API URL: <code className="bg-gray-100 px-1 py-0.5 rounded">{apiUrl}</code>
        </p>
        <div 
          className={`p-3 rounded ${
            status === 'loading' ? 'bg-blue-50 text-blue-700' : 
            status === 'success' ? 'bg-green-50 text-green-700' : 
            'bg-red-50 text-red-700'
          }`}
        >
          <p>
            {status === 'loading' && '⏳ '}
            {status === 'success' && '✅ '}
            {status === 'error' && '❌ '}
            {message}
          </p>
        </div>
        {status === 'error' && (
          <div className="text-sm text-gray-600 mt-2">
            <p>Troubleshooting:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Ensure the backend server is running on port 5000</li>
              <li>Check that CORS is configured correctly on the backend</li>
              <li>Verify the NEXT_PUBLIC_API_URL environment variable is set correctly</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiConnectionTest; 