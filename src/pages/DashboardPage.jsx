import React from 'react';
import { 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertCircle,
  ShoppingCart,
  BarChart3,
  Gem
} from 'lucide-react';
import Card from '../components/ui/Card';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Total Products',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Monthly Sales',
      value: '$45,230',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+5.1%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-3',
      changeType: 'negative',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'sale',
      description: 'New sale: Diamond Ring - $2,500',
      time: '2 minutes ago',
      icon: ShoppingCart,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'stock',
      description: 'Stock updated: Gold Necklace (Qty: 5)',
      time: '15 minutes ago',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'customer',
      description: 'New customer registered: Sarah Johnson',
      time: '1 hour ago',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      id: 4,
      type: 'alert',
      description: 'Low stock alert: Silver Earrings',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  const topProducts = [
    { name: 'Diamond Ring', sales: 45, revenue: '$12,500' },
    { name: 'Gold Necklace', sales: 38, revenue: '$9,200' },
    { name: 'Silver Bracelet', sales: 32, revenue: '$6,800' },
    { name: 'Pearl Earrings', sales: 28, revenue: '$5,600' },
    { name: 'Ruby Pendant', sales: 25, revenue: '$4,200' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Here's what's happening with your jewelry business.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Gem className="w-6 h-6 text-primary-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
                <p className={`text-sm ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Sales Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Overview
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {/* Sales Chart Placeholder */}
            <div className="h-48 bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/20 dark:to-primary-900/20 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-700">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                <p className="text-blue-600 dark:text-blue-400 font-medium">Sales Analytics</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chart integration coming soon</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$45.2K</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">This Month</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">+8.2%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Growth</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">127</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Orders</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Selling Products
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            This month
          </span>
        </div>
        
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {product.sales} units sold
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {product.revenue}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Revenue
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium py-2 transition-colors">
            View All Products →
          </button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
