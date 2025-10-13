import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  DollarSign,
  Activity
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import reportingService from '../../services/reportingService';

const DailyBalanceReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [groupBy, setGroupBy] = useState('day');
  const [dailyBalances, setDailyBalances] = useState([]);

  const fetchDailyBalances = async () => {
    setLoading(true);
    try {
      const response = await reportingService.getDailyStockBalancesByRange(
        dateRange.startDate,
        dateRange.endDate,
        groupBy
      );
      
      // Use real API data only
      if (response && (response.data || response.length > 0)) {
        const balances = response.data || response;
        setDailyBalances(Array.isArray(balances) ? balances : []);
        success(`Loaded ${balances.length || 0} daily balances`);
      } else {
        setDailyBalances([]);
        error('No data available from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setDailyBalances([]);
      error(err.response?.data?.message || 'Failed to load data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateSummary = () => {
    return {
      totalOpening: dailyBalances.reduce((sum, d) => sum + d.openingBalance, 0),
      totalAdditions: dailyBalances.reduce((sum, d) => sum + d.additions, 0),
      totalSales: dailyBalances.reduce((sum, d) => sum + d.sales, 0),
      totalTransfers: dailyBalances.reduce((sum, d) => sum + d.transfers, 0),
      totalClosing: dailyBalances.reduce((sum, d) => sum + d.closingBalance, 0),
      totalValue: dailyBalances.reduce((sum, d) => sum + d.closingValue, 0)
    };
  };

  const summary = calculateSummary();

  const handleExport = () => {
    success('Exporting daily balance report...');
    // Implement export logic
  };

  const handleCalculateBalance = async () => {
    setLoading(true);
    try {
      await reportingService.calculateAllDailyBalances(dateRange.endDate);
      success('Daily balance calculated successfully');
      fetchDailyBalances();
    } catch (err) {
      error('Failed to calculate daily balance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Stock Balance Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor daily stock balances and movements
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleCalculateBalance} disabled={loading}>
            <Activity className="w-4 h-4 mr-2" />
            Calculate Balance
          </Button>
          <Button variant="outline" onClick={fetchDailyBalances} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="accent" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
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
          <Button variant="primary" onClick={fetchDailyBalances} disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Additions
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {summary.totalAdditions}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-800">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Total Sales
              </p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {summary.totalSales}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-200 dark:bg-red-800">
              <TrendingDown className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Total Transfers
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {summary.totalTransfers}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-200 dark:bg-purple-800">
              <RefreshCw className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Value
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                ₹{(summary.totalValue / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-200 dark:bg-green-800">
              <DollarSign className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Balance Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Balance Details
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {dailyBalances.length} days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Opening</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Additions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Transfers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Closing</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Net Change</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Closing Value</th>
              </tr>
            </thead>
            <tbody>
              {dailyBalances.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No daily balance data available. Select a date range and click Apply Filters.
                  </td>
                </tr>
              ) : (
                dailyBalances.map((balance, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{balance.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {balance.openingBalance}
                  </td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">
                    +{balance.additions}
                  </td>
                  <td className="py-3 px-4 text-red-600 dark:text-red-400 font-medium">
                    -{balance.sales}
                  </td>
                  <td className="py-3 px-4 text-purple-600 dark:text-purple-400">
                    {balance.transfers}
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    {balance.closingBalance}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {balance.netChange >= 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                          <span className="font-medium text-green-600 dark:text-green-400">
                            +{balance.netChange} ({balance.netChangePercentage}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {balance.netChange} ({balance.netChangePercentage}%)
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ₹{(balance.closingValue / 1000000).toFixed(2)}M
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
            Stock Balance Trend
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Balance trend chart</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Value Trend
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Value trend chart</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Period Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Opening Stock</p>
            <p className="text-2xl font-bold text-blue-600">{summary.totalOpening}</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Additions</p>
            <p className="text-2xl font-bold text-green-600">+{summary.totalAdditions}</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sales</p>
            <p className="text-2xl font-bold text-red-600">-{summary.totalSales}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transfers</p>
            <p className="text-2xl font-bold text-purple-600">{summary.totalTransfers}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Closing Stock</p>
            <p className="text-2xl font-bold text-orange-600">{summary.totalClosing}</p>
          </div>
          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-primary-600">₹{(summary.totalValue / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </Card>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default DailyBalanceReportsPage;

