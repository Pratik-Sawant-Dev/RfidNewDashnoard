import React, { useState } from 'react';
import { 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  DollarSign,
  Download,
  Filter,
  Calendar,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const PurchaseReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [filterSupplier, setFilterSupplier] = useState('');

  const purchaseData = [
    {
      id: 'PUR-001',
      date: '2024-01-15',
      supplier: 'Diamond Wholesale Co.',
      invoiceNumber: 'INV-DWC-001',
      totalAmount: 15000,
      items: 5,
      status: 'Completed',
      paymentStatus: 'Paid',
    },
    {
      id: 'PUR-002',
      date: '2024-01-12',
      supplier: 'Gold Suppliers Ltd.',
      invoiceNumber: 'INV-GSL-002',
      totalAmount: 8500,
      items: 3,
      status: 'Completed',
      paymentStatus: 'Paid',
    },
    {
      id: 'PUR-003',
      date: '2024-01-10',
      supplier: 'Silver Craft Inc.',
      invoiceNumber: 'INV-SCI-003',
      totalAmount: 3200,
      items: 8,
      status: 'Completed',
      paymentStatus: 'Pending',
    },
    {
      id: 'PUR-004',
      date: '2024-01-08',
      supplier: 'Pearl Importers',
      invoiceNumber: 'INV-PI-004',
      totalAmount: 4800,
      items: 4,
      status: 'Completed',
      paymentStatus: 'Paid',
    },
    {
      id: 'PUR-005',
      date: '2024-01-05',
      supplier: 'Gemstone Direct',
      invoiceNumber: 'INV-GD-005',
      totalAmount: 12000,
      items: 6,
      status: 'Completed',
      paymentStatus: 'Paid',
    },
  ];

  const suppliers = ['All', 'Diamond Wholesale Co.', 'Gold Suppliers Ltd.', 'Silver Craft Inc.', 'Pearl Importers', 'Gemstone Direct'];

  const filteredData = purchaseData.filter(item => 
    filterSupplier === '' || filterSupplier === 'All' || item.supplier === filterSupplier
  );

  const totalPurchases = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalItems = filteredData.reduce((sum, item) => sum + item.items, 0);
  const pendingPayments = filteredData.filter(item => item.paymentStatus === 'Pending').length;
  const averagePurchaseValue = totalPurchases / filteredData.length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track inventory purchases and supplier performance
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
              Supplier:
            </span>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
            >
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
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
                Total Purchases
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalPurchases.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                This period
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <DollarSign className="w-6 h-6 text-blue-600" />
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
                {filteredData.length}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Purchase orders
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Items Purchased
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalItems}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Total units
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Pending Payments
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingPayments}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Need attention
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Purchase Trend
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Purchase trend chart will be displayed here</p>
            </div>
          </div>
        </Card>

        {/* Supplier Analysis */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Supplier Performance
          </h3>
          <div className="space-y-4">
            {purchaseData
              .reduce((acc, purchase) => {
                const existing = acc.find(item => item.supplier === purchase.supplier);
                if (existing) {
                  existing.totalAmount += purchase.totalAmount;
                  existing.orderCount += 1;
                } else {
                  acc.push({
                    supplier: purchase.supplier,
                    totalAmount: purchase.totalAmount,
                    orderCount: 1,
                  });
                }
                return acc;
              }, [])
              .sort((a, b) => b.totalAmount - a.totalAmount)
              .map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {supplier.supplier}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {supplier.orderCount} orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${supplier.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Total value
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Purchase Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Purchase Orders
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredData.length} orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Supplier
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Invoice #
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Items
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Total Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((purchase) => (
                <tr key={purchase.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {purchase.id}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {purchase.date}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {purchase.supplier}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {purchase.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {purchase.items} items
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ${purchase.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(purchase.paymentStatus)}`}>
                      {purchase.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Average Purchase Value */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Average Purchase Value
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Per order this period
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${averagePurchaseValue.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Per purchase order
            </p>
          </div>
        </div>
      </Card>

      {/* Pending Payments Alert */}
      {pendingPayments > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Pending Payments Alert
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {pendingPayments} purchase order{pendingPayments > 1 ? 's' : ''} have pending payments. 
                Review and process payments to maintain good supplier relationships.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PurchaseReportsPage;
