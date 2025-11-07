import React, { useState, useEffect } from 'react';
import { 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Eye,
  Plus,
  Building,
  Calculator
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import reportingService from '../../services/reportingService';

const StockVerificationReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [verifications, setVerifications] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    branchName: '',
    status: 'All'
  });

  const statuses = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: 1,
        pageSize: 50
      };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.branchName) params.branchName = filters.branchName;
      if (filters.status !== 'All') params.status = filters.status;
      
      const response = await reportingService.getStockVerificationsList(params);
      
      // Use real API data only
      if (response && (response.data?.items || response.items || response.data)) {
        const items = response.data?.items || response.items || response.data || [];
        setVerifications(Array.isArray(items) ? items : []);
        success(`Loaded ${items.length} verification sessions`);
      } else {
        setVerifications([]);
        error('No data available from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setVerifications([]);
      error(err.response?.data?.message || 'Failed to load data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredVerifications = verifications.filter(v => 
    (filters.status === 'All' || v.status === filters.status)
  );

  const calculateSummary = () => {
    const completed = filteredVerifications.filter(v => v.status === 'Completed');
    return {
      totalSessions: filteredVerifications.length,
      completedSessions: completed.length,
      totalExpected: completed.reduce((sum, v) => sum + v.totalExpectedItems, 0),
      totalMatched: completed.reduce((sum, v) => sum + v.matchedItems, 0),
      totalMissing: completed.reduce((sum, v) => sum + v.missingItems, 0),
      averageAccuracy: completed.length > 0 
        ? completed.reduce((sum, v) => sum + v.accuracyPercentage, 0) / completed.length 
        : 0
    };
  };

  const summary = calculateSummary();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleExport = () => {
    success('Exporting verification report...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-4">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Stock Verification Reports
        </label>
        
        {/* Refresh and Export - Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Refresh Button */}
          <Button variant="outline" onClick={fetchVerifications} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          {/* Export Button */}
          <Button variant="accent" onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
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
          <div className="flex items-end">
            <Button variant="primary" className="w-full" onClick={fetchVerifications}>
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.totalSessions}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Items Matched
              </p>
              <p className="text-2xl font-bold text-green-600">
                {summary.totalMatched}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Items Missing
              </p>
              <p className="text-2xl font-bold text-red-600">
                {summary.totalMissing}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Avg. Accuracy
              </p>
              <p className="text-2xl font-bold text-primary-600">
                {summary.averageAccuracy.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <CheckCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Verification Sessions Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Verification Sessions
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredVerifications.length} sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Session</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Expected</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Matched</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Missing</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Accuracy</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerifications.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No verification sessions found. Create a new verification session or adjust your filters.
                  </td>
                </tr>
              ) : (
                filteredVerifications.map((verification) => (
                <tr key={verification.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 dark:text-white">{verification.sessionName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">By: {verification.verifiedBy}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    <div>
                      <p>{verification.verificationDate}</p>
                      <p className="text-xs text-gray-500">{verification.verificationTime}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Building className="w-3 h-3 mr-1" />
                        {verification.branchName}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                        <Calculator className="w-3 h-3 mr-1" />
                        {verification.counterName}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {verification.categoryName}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {verification.totalExpectedItems}
                  </td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">
                    {verification.matchedItems}
                  </td>
                  <td className="py-3 px-4 text-red-600 dark:text-red-400 font-medium">
                    {verification.missingItems}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            verification.accuracyPercentage >= 95 ? 'bg-green-600' :
                            verification.accuracyPercentage >= 85 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${verification.accuracyPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {verification.accuracyPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                      {verification.status}
                    </span>
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

      {/* Accuracy Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Verification Accuracy Trend
          </h3>
          <div className="space-y-3">
            {filteredVerifications.filter(v => v.status === 'Completed').map((v, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{v.sessionName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{v.verificationDate}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right mr-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {v.matchedItems}/{v.totalExpectedItems}
                    </p>
                  </div>
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        v.accuracyPercentage >= 95 ? 'bg-green-600' :
                        v.accuracyPercentage >= 85 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${v.accuracyPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">
                    {v.accuracyPercentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Summary Statistics
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed Sessions</span>
                <span className="text-xl font-bold text-blue-600">{summary.completedSessions}</span>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Items Verified</span>
                <span className="text-xl font-bold text-green-600">{summary.totalMatched}</span>
              </div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Missing Items</span>
                <span className="text-xl font-bold text-red-600">{summary.totalMissing}</span>
              </div>
            </div>
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</span>
                <span className="text-xl font-bold text-primary-600">{summary.averageAccuracy.toFixed(1)}%</span>
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

export default StockVerificationReportsPage;

