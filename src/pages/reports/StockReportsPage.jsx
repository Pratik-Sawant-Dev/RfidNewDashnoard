import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const StockReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [filterCategory, setFilterCategory] = useState('');

  const stockData = [
    {
      id: 1,
      productName: 'Diamond Ring',
      sku: 'DR-001',
      category: 'Rings',
      currentStock: 15,
      minStock: 5,
      maxStock: 50,
      value: 37500,
      status: 'In Stock',
      lastUpdated: '2024-01-15',
    },
    {
      id: 2,
      productName: 'Gold Necklace',
      sku: 'GN-002',
      category: 'Necklaces',
      currentStock: 3,
      minStock: 5,
      maxStock: 30,
      value: 12000,
      status: 'Low Stock',
      lastUpdated: '2024-01-14',
    },
    {
      id: 3,
      productName: 'Silver Bracelet',
      sku: 'SB-003',
      category: 'Bracelets',
      currentStock: 25,
      minStock: 10,
      maxStock: 40,
      value: 7500,
      status: 'In Stock',
      lastUpdated: '2024-01-13',
    },
    {
      id: 4,
      productName: 'Pearl Earrings',
      sku: 'PE-004',
      category: 'Earrings',
      currentStock: 0,
      minStock: 8,
      maxStock: 25,
      value: 0,
      status: 'Out of Stock',
      lastUpdated: '2024-01-12',
    },
    {
      id: 5,
      productName: 'Ruby Pendant',
      sku: 'RP-005',
      category: 'Pendants',
      currentStock: 8,
      minStock: 5,
      maxStock: 20,
      value: 16000,
      status: 'In Stock',
      lastUpdated: '2024-01-11',
    },
  ];

  const categories = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants'];

  const filteredData = stockData.filter(item => 
    filterCategory === '' || filterCategory === 'All' || item.category === filterCategory
  );

  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);
  const lowStockItems = filteredData.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = filteredData.filter(item => item.status === 'Out of Stock').length;
  const inStockItems = filteredData.filter(item => item.status === 'In Stock').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Stock':
        return <CheckCircle className="w-4 h-4" />;
      case 'Low Stock':
        return <AlertCircle className="w-4 h-4" />;
      case 'Out of Stock':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stock Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor inventory levels and stock status across all products
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
              Category:
            </span>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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
                Total Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                In Stock
              </p>
              <p className="text-2xl font-bold text-green-600">
                {inStockItems}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {lowStockItems}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Out of Stock
              </p>
              <p className="text-2xl font-bold text-red-600">
                {outOfStockItems}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Stock Status Report
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredData.length} products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  SKU
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Current Stock
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Min/Max
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.productName}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {item.sku}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {item.category}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.currentStock}
                      </span>
                      {item.currentStock <= item.minStock && (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {item.minStock}/{item.maxStock}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    ${item.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {item.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Low Stock Alert
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {lowStockItems} product{lowStockItems > 1 ? 's' : ''} are running low on stock. 
                Consider reordering to avoid stockouts.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StockReportsPage;
