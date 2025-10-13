import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Receipt,
  Clock,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import useToast from '../../hooks/useToast';
import invoiceService from '../../services/invoiceService';

const InvoiceReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState('summary');
  const [reportData, setReportData] = useState({});
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: 'summary', label: 'Summary Report', description: 'Overview of all invoice data' },
    { value: 'revenue', label: 'Revenue Report', description: 'Detailed revenue analysis' },
    { value: 'customer', label: 'Customer Report', description: 'Customer-wise invoice analysis' },
    { value: 'product', label: 'Product Report', description: 'Product-wise sales analysis' },
    { value: 'payment', label: 'Payment Method Report', description: 'Payment method distribution' },
    { value: 'gst', label: 'GST Report', description: 'GST compliance and analysis' },
    { value: 'daily', label: 'Daily Sales Report', description: 'Day-wise sales breakdown' },
    { value: 'monthly', label: 'Monthly Report', description: 'Month-wise comprehensive report' }
  ];

  const exportFormats = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: '📊' },
    { value: 'pdf', label: 'PDF (.pdf)', icon: '📄' },
    { value: 'csv', label: 'CSV (.csv)', icon: '📋' }
  ];

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let response;
      
      switch (reportType) {
        case 'summary':
          response = await invoiceService.getInvoiceStatistics();
          break;
        case 'revenue':
          response = await invoiceService.getRevenueAnalytics(dateRange.startDate, dateRange.endDate, 'day');
          break;
        case 'customer':
          response = await invoiceService.getTopCustomers(50, dateRange.startDate, dateRange.endDate);
          break;
        case 'product':
          response = await invoiceService.getTopProducts(50, dateRange.startDate, dateRange.endDate);
          break;
        case 'payment':
          response = await invoiceService.getPaymentMethodAnalytics(dateRange.startDate, dateRange.endDate);
          break;
        case 'daily':
          response = await invoiceService.getDailySalesSummary(dateRange.startDate);
          break;
        case 'monthly':
          const month = new Date(dateRange.startDate).getMonth() + 1;
          const year = new Date(dateRange.startDate).getFullYear();
          response = await invoiceService.getMonthlySalesSummary(year, month);
          break;
        default:
          response = await invoiceService.getInvoiceStatistics();
      }

      setReportData(response.data || response || {});
      success('Report data loaded successfully');
    } catch (err) {
      console.error('Error fetching report data:', err);
      error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const handleExport = async (format) => {
    setGenerating(true);
    try {
      const response = await invoiceService.exportInvoices(format, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        reportType
      });
      
      const blob = new Blob([response], { 
        type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
              format === 'pdf' ? 'application/pdf' : 'text/csv'
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${reportType}-report-${dateRange.startDate}-to-${dateRange.endDate}.${
        format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'
      }`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      success(`${format.toUpperCase()} report exported successfully`);
    } catch (err) {
      console.error('Error exporting report:', err);
      error('Failed to export report');
    } finally {
      setGenerating(false);
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

  const renderReportContent = () => {
    switch (reportType) {
      case 'summary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <Receipt className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-blue-900">{formatNumber(reportData.totalInvoices || 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(reportData.totalRevenue || 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Average Order</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(reportData.averageOrderValue || 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-600">Unique Customers</p>
                  <p className="text-2xl font-bold text-orange-900">{formatNumber(reportData.uniqueCustomers || 0)}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="space-y-2">
                {reportData.slice(0, 10).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium">{item.period}</span>
                    <span className="text-green-600 font-semibold">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
            )}
          </div>
        );

      case 'customer':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Customers</h3>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="space-y-2">
                {reportData.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{customer.customerName}</p>
                      <p className="text-sm text-gray-500">{customer.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-sm text-gray-500">{customer.totalOrders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No customer data available</p>
            )}
          </div>
        );

      case 'product':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h3>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="space-y-2">
                {reportData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-gray-500">{product.rfidCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(product.totalRevenue)}</p>
                      <p className="text-sm text-gray-500">{product.totalQuantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No product data available</p>
            )}
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method Distribution</h3>
            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.map((method, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{method.paymentMethod}</h4>
                      <span className="text-sm text-gray-500">{method.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatNumber(method.count)} transactions</span>
                      <span>{formatCurrency(method.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No payment method data available</p>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a report type to view data</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Invoice Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and export detailed invoice reports
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            onClick={fetchReportData}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-primary-500" />
          Report Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <Select
              value={reportType}
              onChange={setReportType}
              options={reportTypes.map(type => ({ value: type.value, label: type.label }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {reportTypes.find(type => type.value === reportType)?.description}
          </p>
        </div>
      </Card>

      {/* Export Options */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2 text-primary-500" />
          Export Options
        </h3>
        <div className="flex flex-wrap gap-3">
          {exportFormats.map((format) => (
            <Button
              key={format.value}
              onClick={() => handleExport(format.value)}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={generating}
            >
              <span className="text-lg">{format.icon}</span>
              <span>{format.label}</span>
              {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            </Button>
          ))}
        </div>
      </Card>

      {/* Report Content */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary-500" />
            Report Data
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading report data...</p>
            </div>
          </div>
        ) : (
          renderReportContent()
        )}
      </Card>
    </div>
  );
};

export default InvoiceReportsPage;
