import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Package, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  BarChart3,
  Building,
  Calculator
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import reportingService from '../../services/reportingService';

const StockMovementReportsPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    movementType: 'All',
    branchId: '',
    counterId: '',
    productId: ''
  });

  const movementTypes = ['All', 'Addition', 'Sale', 'Transfer', 'Adjustment', 'Return'];

  const fetchStockMovements = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.movementType !== 'All') params.movementType = filters.movementType;
      
      const response = await reportingService.getStockMovements(params);
      
      // Use real API data only
      if (response && response.data) {
        setMovements(Array.isArray(response.data) ? response.data : []);
        success(`Loaded ${response.data.length || 0} stock movements`);
      } else {
        setMovements([]);
        error('No data available from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setMovements([]);
      error(err.response?.data?.message || 'Failed to load data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMovements = movements.filter(m => 
    filters.movementType === 'All' || m.movementType === filters.movementType
  );

  const totalAdditions = filteredMovements.filter(m => m.movementType === 'Addition').length;
  const totalSales = filteredMovements.filter(m => m.movementType === 'Sale').length;
  const totalTransfers = filteredMovements.filter(m => m.movementType === 'Transfer').length;
  const totalValue = filteredMovements.reduce((sum, m) => sum + m.totalAmount, 0);

  const getMovementTypeColor = (type) => {
    switch (type) {
      case 'Addition':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Sale':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Transfer':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Adjustment':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Return':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case 'Addition':
        return <ArrowUpCircle className="w-4 h-4" />;
      case 'Sale':
        return <ArrowDownCircle className="w-4 h-4" />;
      case 'Transfer':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleExport = () => {
    success('Exporting stock movement report...');
    // Implement CSV export logic
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-4">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Stock Movement Reports
        </label>
        
        {/* Refresh and Export - Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Refresh Button */}
          <Button variant="outline" onClick={fetchStockMovements} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto">
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
              Movement Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filters.movementType}
              onChange={(e) => setFilters({...filters, movementType: e.target.value})}
            >
              {movementTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full" onClick={fetchStockMovements}>
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
                Total Additions
              </p>
              <p className="text-2xl font-bold text-green-600">
                {totalAdditions}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <ArrowUpCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Sales
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totalSales}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <ArrowDownCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Transfers
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {totalTransfers}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Movement Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Movement Type Distribution
          </h3>
          <div className="space-y-3">
            {movementTypes.filter(t => t !== 'All').map(type => {
              const count = filteredMovements.filter(m => m.movementType === type).length;
              const percentage = filteredMovements.length > 0 ? (count / filteredMovements.length * 100) : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{type}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Movement Trend
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Movement trend chart</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Movements Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Stock Movement Details
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredMovements.length} movements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">RFID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reference</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No stock movements found. Try adjusting your filters or add some stock movements.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement) => (
                <tr key={movement.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {movement.movementDate}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 dark:text-white">{movement.productName}</p>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {movement.rfidCode}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(movement.movementType)}`}>
                      {getMovementIcon(movement.movementType)}
                      <span className="ml-1">{movement.movementType}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {movement.quantity}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    ₹{movement.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    <code className="text-xs">{movement.referenceNumber}</code>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Building className="w-3 h-3 mr-1" />
                        {movement.branchName}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                        <Calculator className="w-3 h-3 mr-1" />
                        {movement.counterName}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default StockMovementReportsPage;

