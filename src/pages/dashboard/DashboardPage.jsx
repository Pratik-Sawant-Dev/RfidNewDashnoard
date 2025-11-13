import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Package, 
  ShoppingCart,
  Scale,
  DollarSign,
  ShoppingCart as SoldIcon,
  BarChart3,
  Gem,
  ArrowUp,
  ArrowDown,
  Radio,
  CheckCircle,
  XCircle,
  Layers
} from 'lucide-react';
import Card from '../../components/ui/Card';
import apiService from '../../services/apiService';
import { ToastContainer } from '../../components/ui/Toast';
import useToast from '../../hooks/useToast';
import { fetchWeightByCategory, selectWeightByCategory, selectWeightByCategoryLoading } from '../../store/slices/dashboardSlice';
import Chatbot from '../../components/chatbot/Chatbot';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { toasts, removeToast, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalSoldProducts: 0,
    totalNetWeight: 0,
    totalRevenue: 0,
  });
  const [rfidData, setRfidData] = useState({
    totalRfidTags: 0,
    usedRfidTags: 0,
    unusedRfidTags: 0,
  });

  // Redux selectors for weight by category
  const weightByCategory = useSelector(selectWeightByCategory);
  const weightByCategoryLoading = useSelector(selectWeightByCategoryLoading);

  useEffect(() => {
    fetchDashboardData();
    // Fetch weight by category using Redux
    dispatch(fetchWeightByCategory());
  }, [dispatch]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const dashboardResponse = await apiService.getDashboardSummary().catch(() => ({}));
      const data = dashboardResponse?.data || dashboardResponse || {};
      
      setDashboardData({
        totalProducts: data.totalProductCount || 0,
        totalSoldProducts: data.totalSoldProducts || 0,
        totalNetWeight: data.totalNetWeight || 0,
        totalRevenue: data.totalRevenue || 0,
      });

      // Get RFID data from dashboard summary or calculate from RFID tags
      if (data.totalRfidTags !== undefined) {
        // Use RFID data from dashboard summary if available
        setRfidData({
          totalRfidTags: data.totalRfidTags || 0,
          usedRfidTags: data.usedRfidTags || 0,
          unusedRfidTags: data.unusedRfidTags || 0,
        });
      } else {
        // Fallback: Calculate from RFID tags API
        try {
          const rfidResponse = await apiService.getAllRfidTags();
          const rfidTags = rfidResponse?.data || rfidResponse || [];
          const totalRfidTags = Array.isArray(rfidTags) ? rfidTags.length : 0;
          const usedRfidTags = Array.isArray(rfidTags) 
            ? rfidTags.filter(tag => tag.isUsed === true || tag.status === 'Used' || tag.isAssigned === true).length 
            : 0;
          const unusedRfidTags = totalRfidTags - usedRfidTags;

          setRfidData({
            totalRfidTags,
            usedRfidTags,
            unusedRfidTags,
          });
        } catch (rfidErr) {
          console.error('Error fetching RFID data:', rfidErr);
          setRfidData({
            totalRfidTags: 0,
            usedRfidTags: 0,
            unusedRfidTags: 0,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatWeight = (value) => {
    return `${parseFloat(value).toFixed(2)}g`;
  };

  const dashboardStats = [
    {
      title: 'Total Products',
      value: loading ? '...' : formatNumber(dashboardData.totalProducts),
      icon: Package,
      gradient: 'from-[#0077D4] to-[#0099FF]',
    },
    {
      title: 'Total Sold Products',
      value: loading ? '...' : formatNumber(dashboardData.totalSoldProducts),
      icon: SoldIcon,
      gradient: 'from-[#00AA55] to-[#00CC66]',
    },
    {
      title: 'Total Net Weight',
      value: loading ? '...' : formatWeight(dashboardData.totalNetWeight),
      icon: Scale,
      gradient: 'from-[#8B3D8B] to-[#AA55AA]',
    },
    {
      title: 'Total Revenue',
      value: loading ? '...' : formatCurrency(dashboardData.totalRevenue),
      icon: DollarSign,
      gradient: 'from-[#D60000] to-[#FF3333]',
    },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Dashboard Summary Section - 4 Small Cards + RFID Section + Weight by Category */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-black dark:text-white">
            Dashboard Summary
          </h2>
          <div className="flex items-center space-x-1.5">
            <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0077D4]" />
            <span className="text-[10px] sm:text-xs text-black/60 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3">
          {/* 4 Dashboard Stats Cards - 2x2 Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-2 lg:col-span-5 gap-2 sm:gap-3">
            {dashboardStats.map((stat, index) => (
              <Card 
                key={index} 
                className="relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800"
              >
                {/* Gradient Background Accent */}
                <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${stat.gradient} opacity-10 dark:opacity-5 rounded-bl-full`}></div>
                
                <div className="relative z-10 p-2.5 sm:p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-medium text-black/60 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-black dark:text-white truncate">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-md flex-shrink-0 ml-1.5`}>
                      <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* RFID Section */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800 lg:col-span-2">
            {/* Gradient Background Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#0077D4] to-[#0099FF] opacity-10 dark:opacity-5 rounded-bl-full"></div>
            
            <div className="relative z-10 p-2.5 sm:p-3">
              {/* Header */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#0077D4] to-[#0099FF] shadow-md">
                  <Radio className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-xs font-semibold text-black dark:text-white">
                  RFID Tags
                </h3>
              </div>

              {/* Bar Chart - Compact */}
              <div className="space-y-1.5 sm:space-y-2">
                {/* Total RFID Tags */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium text-black/70 dark:text-gray-300">Total</span>
                    <span className="text-[10px] font-bold text-[#0077D4] dark:text-[#0077D4]">
                      {loading ? '...' : formatNumber(rfidData.totalRfidTags)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0077D4] to-[#0099FF] rounded-full transition-all duration-500"
                      style={{ 
                        width: rfidData.totalRfidTags > 0 ? '100%' : '0%' 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Used RFID Tags */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium text-black/70 dark:text-gray-300 flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 text-[#0077D4]" />
                      Used
                    </span>
                    <span className="text-[10px] font-bold text-[#0077D4] dark:text-[#0077D4]">
                      {loading ? '...' : formatNumber(rfidData.usedRfidTags)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0077D4] to-[#0099FF] rounded-full transition-all duration-500"
                      style={{ 
                        width: rfidData.totalRfidTags > 0 
                          ? `${(rfidData.usedRfidTags / rfidData.totalRfidTags) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Unused RFID Tags */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium text-black/70 dark:text-gray-300 flex items-center gap-1">
                      <XCircle className="w-2.5 h-2.5 text-green-600" />
                      Unused
                    </span>
                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400">
                      {loading ? '...' : formatNumber(rfidData.unusedRfidTags)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00AA55] to-[#00CC66] rounded-full transition-all duration-500"
                      style={{ 
                        width: rfidData.totalRfidTags > 0 
                          ? `${(rfidData.unusedRfidTags / rfidData.totalRfidTags) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Summary Stats - Compact */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-[#0077D4] dark:text-[#0077D4]">
                      {loading ? '...' : formatNumber(rfidData.totalRfidTags)}
                    </p>
                    <p className="text-[9px] text-black/60 dark:text-gray-400">Total</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#0077D4] dark:text-[#0077D4]">
                      {loading ? '...' : formatNumber(rfidData.usedRfidTags)}
                    </p>
                    <p className="text-[9px] text-black/60 dark:text-gray-400">Used</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-600 dark:text-green-400">
                      {loading ? '...' : formatNumber(rfidData.unusedRfidTags)}
                    </p>
                    <p className="text-[9px] text-black/60 dark:text-gray-400">Unused</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Weight by Category Table Section */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800 lg:col-span-5">
            {/* Gradient Background Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#8B3D8B] to-[#AA55AA] opacity-10 dark:opacity-5 rounded-bl-full"></div>
            
            <div className="relative z-10 p-2.5 sm:p-3">
              {/* Header */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#8B3D8B] to-[#AA55AA] shadow-md">
                  <Layers className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-xs font-semibold text-black dark:text-white">
                  Weight by Category
                </h3>
              </div>

              {/* Table */}
              {weightByCategoryLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-[10px] text-black/60 dark:text-gray-400">Loading...</div>
                </div>
              ) : weightByCategory && weightByCategory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-1.5 px-2 text-[10px] font-semibold text-black/70 dark:text-gray-300">Category</th>
                        <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-black/70 dark:text-gray-300">Products</th>
                        <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-black/70 dark:text-gray-300">Gross Wt</th>
                        <th className="text-right py-1.5 px-2 text-[10px] font-semibold text-black/70 dark:text-gray-300">Net Wt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightByCategory.map((item, index) => (
                        <tr 
                          key={index} 
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-1.5 px-2 text-[10px] font-medium text-black dark:text-white">
                            {item.categoryName || '-'}
                          </td>
                          <td className="py-1.5 px-2 text-[10px] font-semibold text-black dark:text-white text-right">
                            {formatNumber(item.productCount || 0)}
                          </td>
                          <td className="py-1.5 px-2 text-[10px] font-semibold text-[#0077D4] dark:text-[#0077D4] text-right">
                            {formatWeight(item.totalGrossWeight || 0)}
                          </td>
                          <td className="py-1.5 px-2 text-[10px] font-semibold text-[#8B3D8B] dark:text-[#8B3D8B] text-right">
                            {formatWeight(item.totalNetWeight || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="text-[10px] text-black/60 dark:text-gray-400">No data available</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Sales Chart */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white">
              Sales Overview
            </h3>
            <BarChart3 className="w-5 h-5 text-[#0077D4]" />
          </div>
          <div className="space-y-4">
            {/* Sales Chart Placeholder */}
            <div className="h-40 sm:h-48 bg-gradient-to-br from-[#E6F2FF] to-[#FFE6E6] dark:from-[#0077D4]/10 dark:to-[#D60000]/10 rounded-lg flex items-center justify-center border-2 border-dashed border-[#0077D4]/30 dark:border-[#0077D4]/20">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-[#0077D4] mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-[#0077D4] dark:text-[#0077D4] font-medium">Sales Analytics</p>
                <p className="text-xs sm:text-sm text-black/60 dark:text-gray-400">Chart integration coming soon</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#0077D4]/10 to-[#0099FF]/10 dark:from-[#0077D4]/20 dark:to-[#0099FF]/20 rounded-lg border border-[#0077D4]/20 dark:border-[#0077D4]/30">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0077D4] dark:text-[#0077D4]">
                  {loading ? '...' : formatCurrency(dashboardData.totalRevenue)}
                </p>
                <p className="text-xs text-black/60 dark:text-gray-400">Total Revenue</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#00AA55]/10 to-[#00CC66]/10 dark:from-[#00AA55]/20 dark:to-[#00CC66]/20 rounded-lg border border-[#00AA55]/20 dark:border-[#00AA55]/30">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#00AA55] dark:text-[#00AA55]">
                  {loading ? '...' : formatNumber(dashboardData.totalSoldProducts)}
                </p>
                <p className="text-xs text-black/60 dark:text-gray-400">Sold Products</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#8B3D8B]/10 to-[#AA55AA]/10 dark:from-[#8B3D8B]/20 dark:to-[#AA55AA]/20 rounded-lg border border-[#8B3D8B]/20 dark:border-[#8B3D8B]/30">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#8B3D8B] dark:text-[#8B3D8B]">
                  {loading ? '...' : formatWeight(dashboardData.totalNetWeight)}
                </p>
                <p className="text-xs text-black/60 dark:text-gray-400">Net Weight</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-4">
            Recent Activities
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { icon: ShoppingCart, text: 'New sale: Diamond Ring - $2,500', time: '2 minutes ago', gradient: 'from-[#00AA55] to-[#00CC66]' },
              { icon: Package, text: 'Stock updated: Gold Necklace (Qty: 5)', time: '15 minutes ago', gradient: 'from-[#0077D4] to-[#0099FF]' },
              { icon: Scale, text: 'Weight updated: Total Net Weight', time: '1 hour ago', gradient: 'from-[#8B3D8B] to-[#AA55AA]' },
              { icon: DollarSign, text: 'Revenue updated: Total Revenue', time: '2 hours ago', gradient: 'from-[#D60000] to-[#FF3333]' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${activity.gradient} shadow-md flex-shrink-0`}>
                  <activity.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-black dark:text-white">
                    {activity.text}
                  </p>
                  <p className="text-xs text-black/60 dark:text-gray-400 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
};

export default DashboardPage;