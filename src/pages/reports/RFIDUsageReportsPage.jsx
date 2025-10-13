import React, { useState, useEffect } from 'react';
import { 
  Tag,
  CheckCircle,
  XCircle,
  Percent,
  Download,
  Filter,
  BarChart3,
  Building,
  Calculator,
  Layers,
  RefreshCw
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import reportingService from '../../services/reportingService';

const RFIDUsageReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState({
    totalRFIDs: 0,
    usedRFIDs: 0,
    unusedRFIDs: 0,
    usagePercentage: 0,
    byCategory: [],
    byBranch: []
  });

  const fetchRFIDUsage = async () => {
    setLoading(true);
    try {
      const [usageReport, categoryUsage, branchUsage] = await Promise.all([
        reportingService.getRFIDUsageReport(),
        reportingService.getRFIDUsageByCategory(),
        reportingService.getRFIDUsageByBranch()
      ]);
      
      // Use real API data only
      if (usageReport && categoryUsage && branchUsage) {
        setUsageData({
          totalRFIDs: usageReport.data?.totalRFIDs || usageReport.totalRFIDs || 0,
          usedRFIDs: usageReport.data?.usedRFIDs || usageReport.usedRFIDs || 0,
          unusedRFIDs: usageReport.data?.unusedRFIDs || usageReport.unusedRFIDs || 0,
          usagePercentage: usageReport.data?.usagePercentage || usageReport.usagePercentage || 0,
          byCategory: categoryUsage.data || categoryUsage || [],
          byBranch: branchUsage.data || branchUsage || []
        });
        success('RFID usage data loaded successfully');
      } else {
        setUsageData({
          totalRFIDs: 0,
          usedRFIDs: 0,
          unusedRFIDs: 0,
          usagePercentage: 0,
          byCategory: [],
          byBranch: []
        });
        error('No data available from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setUsageData({
        totalRFIDs: 0,
        usedRFIDs: 0,
        unusedRFIDs: 0,
        usagePercentage: 0,
        byCategory: [],
        byBranch: []
      });
      error(err.response?.data?.message || 'Failed to load data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFIDUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = () => {
    success('Exporting RFID usage report...');
    // Implement CSV export logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            RFID Usage Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze RFID tag utilization across inventory
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchRFIDUsage} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="accent" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total RFID Tags
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {usageData.totalRFIDs.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Used RFID Tags
              </p>
              <p className="text-2xl font-bold text-green-600">
                {usageData.usedRFIDs.toLocaleString()}
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
                Available RFID Tags
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {usageData.unusedRFIDs.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Usage Percentage
              </p>
              <p className="text-2xl font-bold text-primary-600">
                {usageData.usagePercentage}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <Percent className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Progress Bar */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Overall RFID Utilization
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-green-600">
                  Used: {usageData.usedRFIDs} ({usageData.usagePercentage}%)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-yellow-600">
                  Available: {usageData.unusedRFIDs} ({100 - usageData.usagePercentage}%)
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 text-xs flex rounded-lg bg-gray-200 dark:bg-gray-700">
              <div 
                style={{ width: `${usageData.usagePercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
              ></div>
              <div 
                style={{ width: `${100 - usageData.usagePercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* RFID Usage by Category */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          RFID Usage by Category
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total RFIDs</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Used</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Available</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Usage %</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {usageData.byCategory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No RFID usage data available by category.
                  </td>
                </tr>
              ) : (
                usageData.byCategory.map((category, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-primary-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{category.categoryName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {category.totalRFIDs}
                  </td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">
                    {category.usedRFIDs}
                  </td>
                  <td className="py-3 px-4 text-yellow-600 dark:text-yellow-400 font-medium">
                    {category.unusedRFIDs}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${category.usagePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.usagePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {category.usagePercentage >= 70 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        High Usage
                      </span>
                    ) : category.usagePercentage >= 40 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Medium
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Low Usage
                      </span>
                    )}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RFID Usage by Branch */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          RFID Usage by Branch
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Branch</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total RFIDs</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Used</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Available</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Usage %</th>
              </tr>
            </thead>
            <tbody>
              {usageData.byBranch.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No RFID usage data available by branch.
                  </td>
                </tr>
              ) : (
                usageData.byBranch.map((branch, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{branch.branchName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {branch.totalRFIDs}
                  </td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">
                    {branch.usedRFIDs}
                  </td>
                  <td className="py-3 px-4 text-yellow-600 dark:text-yellow-400 font-medium">
                    {branch.unusedRFIDs}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${branch.usagePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {branch.usagePercentage.toFixed(1)}%
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

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            RFID Usage Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Donut Chart Placeholder */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="20"
                  strokeDasharray={`${usageData.usagePercentage * 2.51} ${251 - usageData.usagePercentage * 2.51}`}
                  className="text-green-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {usageData.usagePercentage}%
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Used</span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Used</p>
              <p className="text-xl font-bold text-green-600">{usageData.usedRFIDs}</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-xl font-bold text-yellow-600">{usageData.unusedRFIDs}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category-wise Utilization
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Category utilization chart</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Most Used Category
              </p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {usageData.byCategory[0]?.categoryName || 'N/A'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {usageData.byCategory[0]?.usagePercentage?.toFixed(1) || 0}% utilization
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Most Active Branch
              </p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {usageData.byBranch[0]?.branchName || 'N/A'}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {usageData.byBranch[0]?.usedRFIDs || 0} tags in use
              </p>
            </div>
            <Building className="w-10 h-10 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Average Usage Rate
              </p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {usageData.byCategory.length > 0 
                  ? (usageData.byCategory.reduce((sum, c) => sum + (c.usagePercentage || 0), 0) / usageData.byCategory.length).toFixed(1)
                  : 0}%
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Across all categories
              </p>
            </div>
            <Percent className="w-10 h-10 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default RFIDUsageReportsPage;

