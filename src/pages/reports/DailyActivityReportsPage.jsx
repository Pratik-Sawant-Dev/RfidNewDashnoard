import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  BarChart3,
  Building,
  Calculator
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import reportingService from '../../services/reportingService';

const DailyActivityReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [groupBy, setGroupBy] = useState('day');
  const [activities, setActivities] = useState([]);

  const fetchDailyActivities = async () => {
    setLoading(true);
    try {
      const response = await reportingService.getDailyActivityByRange(
        dateRange.startDate,
        dateRange.endDate,
        groupBy
      );
      
      // Use real API data only
      if (response && (response.data || response.length > 0)) {
        const activitiesData = response.data || response;
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        success(`Loaded ${activitiesData.length || 0} days of activity data`);
      } else {
        setActivities([]);
        error('No data available from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setActivities([]);
      error(err.response?.data?.message || 'Failed to load data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateTotals = () => {
    return {
      totalActivities: activities.reduce((sum, a) => sum + a.totalActivities, 0),
      totalProducts: activities.reduce((sum, a) => sum + a.productCreated, 0),
      totalInvoices: activities.reduce((sum, a) => sum + a.invoicesCreated, 0),
      totalValue: activities.reduce((sum, a) => sum + a.totalValue, 0),
      uniqueUsers: new Set(activities.map(a => a.activeUsers)).size,
      averageDaily: activities.length > 0 
        ? activities.reduce((sum, a) => sum + a.totalActivities, 0) / activities.length 
        : 0
    };
  };

  const totals = calculateTotals();

  const handleExport = () => {
    success('Exporting daily activity report...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Activity Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track daily operations and user activities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchDailyActivities} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="accent" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Group By
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="primary" onClick={fetchDailyActivities} disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Activities
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totals.totalActivities}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Products Created
              </p>
              <p className="text-2xl font-bold text-green-600">
                {totals.totalProducts}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Invoices Created
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totals.totalInvoices}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Daily Average
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {totals.averageDaily.toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Details Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Activity Breakdown
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {activities.length} days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Products</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Invoices</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">RFID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Transfers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Active Users</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Location</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No activity data available. Select a date range and click Apply Filters.
                  </td>
                </tr>
              ) : (
                activities.map((activity, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{activity.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                        <span>+{activity.productCreated} created</span>
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs">
                        <span>{activity.productUpdated} updated</span>
                      </div>
                      {activity.productDeleted > 0 && (
                        <div className="flex items-center text-red-600 dark:text-red-400 text-xs">
                          <span>-{activity.productDeleted} deleted</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="text-green-600 dark:text-green-400 text-xs">
                        +{activity.invoicesCreated} created
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 text-xs">
                        {activity.invoicesUpdated} updated
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-purple-600 dark:text-purple-400 font-medium">
                    +{activity.rfidCreated}
                  </td>
                  <td className="py-3 px-4 text-orange-600 dark:text-orange-400 font-medium">
                    {activity.stockTransfers}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{activity.activeUsers}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ₹{(activity.totalValue / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Building className="w-3 h-3 mr-1" />
                        {activity.branchName}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calculator className="w-3 h-3 mr-1" />
                        {activity.counterName}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Activity Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Type Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Products Created', value: activities.reduce((sum, a) => sum + a.productCreated, 0), color: 'bg-green-600' },
              { label: 'Products Updated', value: activities.reduce((sum, a) => sum + a.productUpdated, 0), color: 'bg-blue-600' },
              { label: 'Invoices Created', value: activities.reduce((sum, a) => sum + a.invoicesCreated, 0), color: 'bg-purple-600' },
              { label: 'RFID Created', value: activities.reduce((sum, a) => sum + a.rfidCreated, 0), color: 'bg-orange-600' },
              { label: 'Stock Transfers', value: activities.reduce((sum, a) => sum + a.stockTransfers, 0), color: 'bg-pink-600' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${(item.value / totals.totalActivities * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Trend
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Activity trend chart</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div>
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Most Active Day
            </p>
            <p className="text-xl font-bold text-primary-900 dark:text-primary-100">
              {activities.length > 0 ? activities.reduce((max, a) => 
                a.totalActivities > max.totalActivities ? a : max, activities[0]
              ).date : 'N/A'}
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
              {activities.length > 0 ? activities.reduce((max, a) => 
                a.totalActivities > max.totalActivities ? a : max, activities[0]
              ).totalActivities : 0} activities
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Daily Average Activities
            </p>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {totals.averageDaily.toFixed(0)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Per day
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
              Total Transaction Value
            </p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              ₹{(totals.totalValue / 1000000).toFixed(2)}M
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Period total
            </p>
          </div>
        </Card>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default DailyActivityReportsPage;

