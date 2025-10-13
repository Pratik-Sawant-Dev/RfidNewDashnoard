import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard,
  Calendar,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  Printer,
  Mail,
  RefreshCw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useToast from '../../hooks/useToast';
import invoiceService from '../../services/invoiceService';

const InvoiceManagementPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    todayInvoices: 0,
    todayRevenue: 0,
    pendingInvoices: 0,
    completedInvoices: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await invoiceService.getInvoiceStatistics();
      if (response && response.data) {
        setStatistics(response.data);
        success('Statistics loaded successfully');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentInvoices = async () => {
    try {
      const response = await invoiceService.getAllInvoices({
        page: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      if (response && response.data) {
        setRecentInvoices(response.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching recent invoices:', err);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchRecentInvoices();
  }, []);

  const quickStats = [
    {
      title: 'Total Invoices',
      value: statistics.totalInvoices,
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `₹${(statistics.totalRevenue / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Today\'s Invoices',
      value: statistics.todayInvoices,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Pending Invoices',
      value: statistics.pendingInvoices,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: '-2',
      changeType: 'negative'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Invoice',
      description: 'Create a new invoice for sale',
      icon: Plus,
      path: '/invoices/create',
      color: 'bg-primary-500 hover:bg-primary-600',
      textColor: 'text-white'
    },
    {
      title: 'View All Invoices',
      description: 'Browse and manage all invoices',
      icon: FileText,
      path: '/invoices/list',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Invoice Analytics',
      description: 'View detailed analytics and reports',
      icon: BarChart3,
      path: '/invoices/analytics',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Invoice Reports',
      description: 'Generate and download reports',
      icon: Download,
      path: '/invoices/reports',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white'
    }
  ];

  const invoiceTypes = [
    {
      name: 'Kaccha Bill',
      description: 'No GST applied',
      count: statistics.completedInvoices - statistics.pendingInvoices,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      name: 'Pakka Bill',
      description: 'GST applied',
      count: statistics.pendingInvoices,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Invoice Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage invoices, track sales, and generate reports
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Link to="/invoices/create">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
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

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <div className={`p-4 rounded-lg ${action.color} transition-all duration-200 hover:scale-105 cursor-pointer`}>
                <div className="flex items-center space-x-3">
                  <action.icon className={`w-6 h-6 ${action.textColor}`} />
                  <div>
                    <h3 className={`font-medium ${action.textColor}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${action.textColor} opacity-90`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Invoice Types Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invoice Types
          </h3>
          <div className="space-y-4">
            {invoiceTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${type.bgColor}`}>
                    <Receipt className={`w-5 h-5 ${type.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {type.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {type.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {type.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Invoices
            </h3>
            <Link to="/invoices/list">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No recent invoices found
              </div>
            ) : (
              recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/20">
                      <Receipt className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        #{invoice.invoiceNumber || invoice.id}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₹{invoice.finalAmount?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invoice.soldOn || invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/invoices/list">
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  All Invoices
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View, search, and manage all invoices
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/invoices/analytics">
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Analytics
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Detailed analytics and insights
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/invoices/reports">
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Reports
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate and download reports
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default InvoiceManagementPage;
