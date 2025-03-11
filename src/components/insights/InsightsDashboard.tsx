import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert } from '@/components/ui';
import { api } from '@/utils/api';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

type InsightType = 'CASH_FLOW' | 'PROFITABILITY' | 'EXPENSE' | 'RECEIVABLES' | 'TAX' | 'BUDGET' | 'GENERAL';

interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: number;
  isRead: boolean;
  createdAt: string;
  data: any;
}

/**
 * Dashboard component displaying accounting insights
 */
export const InsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load insights on component mount
  useEffect(() => {
    fetchInsights();
  }, []);

  // Fetch insights from the API
  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await api.get('/insights?limit=10');
      setInsights(response.data.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setError('Failed to load insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Generate new insights
  const handleGenerateInsights = async () => {
    try {
      setRefreshing(true);
      await api.post('/insights/generate');
      
      // Wait a bit for insights to be generated before fetching
      setTimeout(async () => {
        await fetchInsights();
        setRefreshing(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating insights:', error);
      setError('Failed to generate new insights. Please try again later.');
      setRefreshing(false);
    }
  };

  // Mark an insight as read
  const handleMarkAsRead = async (insightId: string) => {
    try {
      await api.patch(`/insights/${insightId}/read`);
      
      // Update local state
      setInsights(prevInsights => 
        prevInsights.map(insight => 
          insight.id === insightId ? { ...insight, isRead: true } : insight
        )
      );
    } catch (error) {
      console.error('Error marking insight as read:', error);
    }
  };

  // Get icon for insight type
  const getInsightIcon = (type: InsightType) => {
    switch (type) {
      case 'CASH_FLOW':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'PROFITABILITY':
        return <ArrowTrendingUpIcon className="w-6 h-6" />;
      case 'EXPENSE':
        return <ArrowTrendingDownIcon className="w-6 h-6" />;
      case 'RECEIVABLES':
        return <ClockIcon className="w-6 h-6" />;
      case 'TAX':
        return <DocumentTextIcon className="w-6 h-6" />;
      case 'BUDGET':
        return <ChartBarIcon className="w-6 h-6" />;
      default:
        return <CurrencyDollarIcon className="w-6 h-6" />;
    }
  };

  // Get color for insight type and priority
  const getInsightColor = (type: InsightType, priority: number) => {
    if (priority >= 5) return 'text-red-500 bg-red-50';
    if (priority >= 4) return 'text-orange-500 bg-orange-50';
    if (priority >= 3) return 'text-yellow-500 bg-yellow-50';
    if (type === 'PROFITABILITY' && priority >= 2) return 'text-green-500 bg-green-50';
    return 'text-blue-500 bg-blue-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Financial Insights</h2>
        
        <Button 
          variant="secondary"
          size="sm"
          onClick={handleGenerateInsights}
          disabled={refreshing}
        >
          {refreshing ? <Spinner size="sm" className="mr-2" /> : null}
          Refresh Insights
        </Button>
      </div>
      
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : insights.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No insights available yet. Generate insights to get started.
            </p>
            <Button 
              variant="primary"
              onClick={handleGenerateInsights}
              disabled={refreshing}
            >
              {refreshing ? <Spinner size="sm" className="mr-2" /> : null}
              Generate Insights
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {insights.map(insight => (
            <Card key={insight.id} className={insight.isRead ? 'opacity-75' : ''}>
              <Card.Body>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getInsightColor(insight.type, insight.priority)} flex items-center justify-center mr-4`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-gray-600">{insight.description}</p>
                    
                    {!insight.isRead && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="text"
                          size="xs"
                          onClick={() => handleMarkAsRead(insight.id)}
                        >
                          Mark as read
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      
      {insights.length > 0 && (
        <div className="text-center">
          <Button variant="link" size="sm">
            View All Insights
          </Button>
        </div>
      )}
    </div>
  );
};

export default InsightsDashboard; 