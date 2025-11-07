import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  CreditCard
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import useToast from '../../hooks/useToast';
import invoiceService from '../../services/invoiceService';

const InvoiceAnalyticsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [groupBy, setGroupBy] = useState('day');
  const [analytics, setAnalytics] = useState({
    statistics: {},
    revenueData: [],
    topProducts: [],
    topCustomers: [],
    paymentMethodData: []
  });

  const groupByOptions = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'year', label: 'Yearly' }
  ];

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statistics, revenueData, topProducts, topCustomers, paymentMethodData] = await Promise.all([
        invoiceService.getInvoiceStatistics(),
        invoiceService.getRevenueAnalytics(dateRange.startDate, dateRange.endDate, groupBy),
        invoiceService.getTopProducts(10, dateRange.startDate, dateRange.endDate),
        invoiceService.getTopCustomers(10, dateRange.startDate, dateRange.endDate),
        invoiceService.getPaymentMethodAnalytics(dateRange.startDate, dateRange.endDate)
      ]);

      setAnalytics({
        statistics: statistics.data || statistics || {},
        revenueData: revenueData.data || revenueData || [],
        topProducts: topProducts.data || topProducts || [],
        topCustomers: topCustomers.data || topCustomers || [],
        paymentMethodData: paymentMethodData.data || paymentMethodData || []
      });

      success('Analytics data loaded successfully');
    } catch (err) {
      console.error('Error fetching analytics:', err);
      error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, groupBy]);

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGroupByChange = (value) => {
    setGroupBy(value);
  };

  const exportAnalytics = async () => {
    try {
      const response = await invoiceService.exportInvoices('excel', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        groupBy
      });
      
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-analytics-${dateRange.startDate}-to-${dateRange.endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      success('Analytics exported successfully');
    } catch (err) {
      console.error('Error exporting analytics:', err);
      error('Failed to export analytics');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getGrowthPercentage = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.statistics.totalRevenue || 0),
      change: getGrowthPercentage(analytics.statistics.totalRevenue || 0, analytics.statistics.previousRevenue || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Total Invoices',
      value: formatNumber(analytics.statistics.totalInvoices || 0),
      change: getGrowthPercentage(analytics.statistics.totalInvoices || 0, analytics.statistics.previousInvoices || 0),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(analytics.statistics.averageOrderValue || 0),
      change: getGrowthPercentage(analytics.statistics.averageOrderValue || 0, analytics.statistics.previousAverageOrderValue || 0),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Unique Customers',
      value: formatNumber(analytics.statistics.uniqueCustomers || 0),
      change: getGrowthPercentage(analytics.statistics.uniqueCustomers || 0, analytics.statistics.previousUniqueCustomers || 0),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Invoice Analytics
        </label>
        
        {/* Refresh and Export - Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Refresh Button */}
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          {/* Export Button */}
          <Button
            onClick={exportAnalytics}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group By
            </label>
            <Select
              value={groupBy}
              onChange={handleGroupByChange}
              options={groupByOptions}
            />
          </div>
        </div>
      </Card>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className={`text-sm flex items-center ${
                  parseFloat(stat.change) >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {parseFloat(stat.change) >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(parseFloat(stat.change))}% from previous period
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
          Revenue Trend
        </h3>
        <div className="h-64 flex items-center justify-center">
          {analytics.revenueData.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No revenue data available for the selected period</p>
            </div>
          ) : (
            <div className="w-full h-full">
              {/* Simple bar chart representation */}
              <div className="flex items-end justify-between h-full space-x-2">
                {analytics.revenueData.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-primary-500 rounded-t w-full min-h-[20px] mb-2"
                      style={{ 
                        height: `${Math.max(20, (item.revenue / Math.max(...analytics.revenueData.map(d => d.revenue))) * 200)}px` 
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {item.period}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-primary-500" />
            Top Products
          </h3>
          <div className="space-y-3">
            {analytics.topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No product data available
              </div>
            ) : (
              analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.productName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.rfidCode}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.totalQuantity} sold
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top Customers */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-500" />
            Top Customers
          </h3>
          <div className="space-y-3">
            {analytics.topCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No customer data available
              </div>
            ) : (
              analytics.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {customer.customerName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.totalOrders} orders
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Payment Method Distribution */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-primary-500" />
          Payment Method Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.paymentMethodData.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No payment method data available
            </div>
          ) : (
            analytics.paymentMethodData.map((method, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {method.paymentMethod}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {method.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatNumber(method.count)} transactions</span>
                  <span>{formatCurrency(method.totalAmount)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default InvoiceAnalyticsPage;
