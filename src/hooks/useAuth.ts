import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Mock user data - in a real app, this would be fetched from an API
        setUser({
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          organizationId: '1'
        });
      } catch (err) {
        setError('Authentication error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading, error };
};

export default useAuth; 