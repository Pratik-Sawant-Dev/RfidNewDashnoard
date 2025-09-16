import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Download,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const SalesReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [filterPeriod, setFilterPeriod] = useState('month');

  const salesData = [
    {
      id: 1,
      date: '2024-01-15',
      customerName: 'Sarah Johnson',
      productName: 'Diamond Ring',
      quantity: 1,
      unitPrice: 2500,
      totalAmount: 2500,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 2,
      date: '2024-01-14',
      customerName: 'Michael Chen',
      productName: 'Gold Necklace',
      quantity: 1,
      unitPrice: 1800,
      totalAmount: 1800,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
    {
      id: 3,
      date: '2024-01-13',
      customerName: 'Emily Rodriguez',
      productName: 'Silver Bracelet',
      quantity: 2,
      unitPrice: 400,
      totalAmount: 800,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
    {
      id: 4,
      date: '2024-01-12',
      customerName: 'David Wilson',
      productName: 'Pearl Earrings',
      quantity: 1,
      unitPrice: 650,
      totalAmount: 650,
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
    },
    {
      id: 5,
      date: '2024-01-11',
      customerName: 'Lisa Brown',
      productName: 'Ruby Pendant',
      quantity: 1,
      unitPrice: 1200,
      totalAmount: 1200,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
  ];

  const monthlyStats = {
    totalSales: 6950,
    totalOrders: 5,
    averageOrderValue: 1390,
    topProduct: 'Diamond Ring',
    growthRate: 12.5,
  };

  const paymentMethods = {
    'Credit Card': 3,
    'Cash': 1,
    'Bank Transfer': 1,
  };

  const calculateTotalSales = () => {
    return salesData.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const calculateAverageOrderValue = () => {
    return calculateTotalSales() / salesData.length;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sales Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze sales performance and customer trends
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="accent">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range:
            </span>
          </div>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="w-40"
          />
          <span className="text-gray-500">to</span>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="w-40"
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Period:
            </span>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Sales
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${calculateTotalSales().toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                +{monthlyStats.growthRate}% from last month
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {salesData.length}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {salesData.length} this period
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Average Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${calculateAverageOrderValue().toFixed(0)}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Per transaction
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Unique Customers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(salesData.map(item => item.customerName)).size}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Active buyers
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Trend
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Sales chart will be displayed here</p>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Methods
          </h3>
          <div className="space-y-4">
            {Object.entries(paymentMethods).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">{method}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(count / salesData.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales Transactions
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {salesData.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Qty
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Unit Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Payment
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {sale.date}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {sale.customerName}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {sale.productName}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {sale.quantity}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    ${sale.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ${sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {sale.paymentMethod}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Products */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Selling Products
        </h3>
        <div className="space-y-3">
          {salesData
            .reduce((acc, sale) => {
              const existing = acc.find(item => item.productName === sale.productName);
              if (existing) {
                existing.totalSales += sale.totalAmount;
                existing.totalQuantity += sale.quantity;
              } else {
                acc.push({
                  productName: sale.productName,
                  totalSales: sale.totalAmount,
                  totalQuantity: sale.quantity,
                });
              }
              return acc;
            }, [])
            .sort((a, b) => b.totalSales - a.totalSales)
            .map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.productName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {product.totalQuantity} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${product.totalSales.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total sales
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default SalesReportsPage;
