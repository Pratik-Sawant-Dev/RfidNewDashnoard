import React, { useState, useEffect } from 'react';
import { 
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  BarChart3,
  Building,
  Calculator,
  Layers,
  PieChart
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import reportingService from '../../services/reportingService';

const StockSummaryReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [groupBy, setGroupBy] = useState('category');
  const [summaryData, setSummaryData] = useState([]);

  const fetchStockSummary = async () => {
    setLoading(true);
    try {
      let response;
      if (groupBy === 'category') {
        response = await reportingService.getStockSummary();
      } else {
        response = await reportingService.getStockSummaryByRange(
          dateRange.startDate,
          dateRange.endDate,
          groupBy
        );
      }
      
      // Use real API data only
      if (response && (response.data || response.length > 0)) {
        const data = response.data || response;
        setSummaryData(Array.isArray(data) ? data : []);
        success(`Loaded ${data.length || 0} ${groupBy} summaries`);
      } else {
        setSummaryData([]);
        error('No data available from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setSummaryData([]);
      error(err.response?.data?.message || 'Failed to load data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  const calculateOverallSummary = () => {
    return {
      totalProducts: summaryData.reduce((sum, s) => sum + s.totalProducts, 0),
      totalValue: summaryData.reduce((sum, s) => sum + s.totalValue, 0),
      totalActive: summaryData.reduce((sum, s) => sum + s.activeProducts, 0),
      totalSold: summaryData.reduce((sum, s) => sum + s.soldProducts, 0),
      averageStockPercentage: summaryData.length > 0
        ? summaryData.reduce((sum, s) => sum + s.stockPercentage, 0) / summaryData.length
        : 0
    };
  };

  const overall = calculateOverallSummary();

  const handleExport = () => {
    success('Exporting stock summary report...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stock Summary Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive inventory summary and analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchStockSummary} disabled={loading}>
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
              <option value="category">Category</option>
              <option value="branch">Branch</option>
              <option value="counter">Counter</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="primary" onClick={fetchStockSummary} disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Products
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {overall.totalProducts}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Active Stock
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {overall.totalActive}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Sold Items
              </p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {overall.totalSold}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Total Value
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                ₹{(overall.totalValue / 10000000).toFixed(1)}Cr
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Avg. Stock %
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {overall.averageStockPercentage.toFixed(1)}%
              </p>
            </div>
            <PieChart className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Stock Summary Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Stock Summary by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {summaryData.length} {groupBy === 'category' ? 'categories' : groupBy === 'branch' ? 'branches' : 'counters'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {groupBy === 'category' ? 'Category' : groupBy === 'branch' ? 'Branch' : 'Counter'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Products</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Sold</th>
                {groupBy === 'category' && (
                  <>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Weight</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Avg. Value</th>
                  </>
                )}
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Stock %</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No stock summary data available. Click Refresh to load data from API.
                  </td>
                </tr>
              ) : (
                summaryData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {groupBy === 'category' && <Layers className="w-4 h-4 mr-2 text-primary-500" />}
                      {groupBy === 'branch' && <Building className="w-4 h-4 mr-2 text-blue-500" />}
                      {groupBy === 'counter' && <Calculator className="w-4 h-4 mr-2 text-green-500" />}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.categoryName || item.branchName || item.counterName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {item.totalProducts}
                  </td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">
                    {item.activeProducts}
                  </td>
                  <td className="py-3 px-4 text-red-600 dark:text-red-400 font-medium">
                    {item.soldProducts}
                  </td>
                  {groupBy === 'category' && (
                    <>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {item.totalWeight}g
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        ₹{(item.averageValue / 1000).toFixed(0)}K
                      </td>
                    </>
                  )}
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ₹{(item.totalValue / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.stockPercentage >= 90 ? 'bg-green-600' :
                            item.stockPercentage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${item.stockPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.stockPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stock Distribution by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Distribution chart</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Value Distribution
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Value distribution chart</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing {groupBy === 'category' ? 'Categories' : groupBy === 'branch' ? 'Branches' : 'Counters'}
        </h3>
        {summaryData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No data available to show top performers.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryData.slice(0, 3).map((item, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                  #{index + 1}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.stockPercentage >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {item.stockPercentage.toFixed(1)}% Stock
                </span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                {item.categoryName || item.branchName || item.counterName}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-white dark:bg-gray-800 p-2 rounded">
                  <p className="text-gray-600 dark:text-gray-400">Products</p>
                  <p className="font-bold text-gray-900 dark:text-white">{item.totalProducts}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded">
                  <p className="text-gray-600 dark:text-gray-400">Value</p>
                  <p className="font-bold text-gray-900 dark:text-white">₹{(item.totalValue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </Card>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default StockSummaryReportsPage;

