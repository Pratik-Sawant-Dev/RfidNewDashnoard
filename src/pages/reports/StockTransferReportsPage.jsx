import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Building,
  Calculator,
  Package,
  Eye
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import reportingService from '../../services/reportingService';

const StockTransferReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'All',
    transferType: 'All'
  });

  const statuses = ['All', 'Pending', 'In Transit', 'Completed', 'Cancelled', 'Rejected'];
  const transferTypes = ['All', 'Branch', 'Counter', 'Box', 'Mixed'];

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        pageSize: 50
      };
      if (filters.status !== 'All') params.status = filters.status;
      
      const response = await reportingService.getAllTransfers(params);
      
      // Use real API data only
      if (response && (response.data?.items || response.items || response.data)) {
        const items = response.data?.items || response.items || response.data || [];
        setTransfers(Array.isArray(items) ? items : []);
        success(`Loaded ${items.length} transfer records`);
      } else {
        setTransfers([]);
        error('No data available from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setTransfers([]);
      error(err.response?.data?.message || 'Failed to load data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTransfers = transfers.filter(t => 
    (filters.status === 'All' || t.status === filters.status) &&
    (filters.transferType === 'All' || t.transferType === filters.transferType)
  );

  const calculateSummary = () => {
    return {
      totalTransfers: filteredTransfers.length,
      pending: filteredTransfers.filter(t => t.status === 'Pending').length,
      inTransit: filteredTransfers.filter(t => t.status === 'In Transit').length,
      completed: filteredTransfers.filter(t => t.status === 'Completed').length,
      cancelled: filteredTransfers.filter(t => t.status === 'Cancelled').length,
      totalValue: filteredTransfers.reduce((sum, t) => sum + t.productValue, 0)
    };
  };

  const summary = calculateSummary();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleExport = () => {
    success('Exporting transfer report...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stock Transfer Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track stock movements between branches, counters, and boxes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchTransfers} disabled={loading}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Start Date
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              End Date
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Transfer Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filters.transferType}
              onChange={(e) => setFilters({...filters, transferType: e.target.value})}
            >
              {transferTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="primary" onClick={fetchTransfers} disabled={loading}>
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Transfers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.totalTransfers}
              </p>
            </div>
            <ArrowRightLeft className="w-6 h-6 text-gray-600" />
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {summary.pending}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                In Transit
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {summary.inTransit}
              </p>
            </div>
            <ArrowRightLeft className="w-6 h-6 text-blue-600" />
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Completed
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {summary.completed}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Total Value
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                ₹{(summary.totalValue / 1000000).toFixed(1)}M
              </p>
            </div>
            <Package className="w-6 h-6 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Transfer Details Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transfer Details
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredTransfers.length} transfers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Source</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Destination</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No transfer records found. Create a transfer or adjust your filters.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transfer.productName}</p>
                      <code className="text-xs text-gray-500 dark:text-gray-400">{transfer.rfidCode}</code>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {transfer.transferType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Building className="w-3 h-3 mr-1" />
                        {transfer.sourceBranch}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calculator className="w-3 h-3 mr-1" />
                        {transfer.sourceCounter}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Building className="w-3 h-3 mr-1" />
                        {transfer.destinationBranch}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calculator className="w-3 h-3 mr-1" />
                        {transfer.destinationCounter}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    <div className="text-xs">
                      <p>Requested: {transfer.requestedDate}</p>
                      {transfer.completedDate && <p>Completed: {transfer.completedDate}</p>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ₹{transfer.productValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transfer Status Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: summary.pending, color: 'bg-yellow-600', icon: Clock },
              { label: 'In Transit', value: summary.inTransit, color: 'bg-blue-600', icon: ArrowRightLeft },
              { label: 'Completed', value: summary.completed, color: 'bg-green-600', icon: CheckCircle },
              { label: 'Cancelled', value: summary.cancelled, color: 'bg-red-600', icon: XCircle }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                      style={{ width: `${summary.totalTransfers > 0 ? (item.value / summary.totalTransfers * 100) : 0}%` }}
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
            Transfer Summary
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Transfers</span>
                <span className="text-2xl font-bold text-blue-600">{summary.totalTransfers}</span>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                <span className="text-2xl font-bold text-green-600">
                  {summary.totalTransfers > 0 
                    ? ((summary.completed / summary.totalTransfers) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
                <span className="text-2xl font-bold text-purple-600">₹{(summary.totalValue / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default StockTransferReportsPage;

