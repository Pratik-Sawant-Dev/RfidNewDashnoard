import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Printer, 
  Mail,
  Plus,
  RefreshCw,
  Calendar,
  User,
  CreditCard,
  Receipt
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import useToast from '../../hooks/useToast';
import invoiceService from '../../services/invoiceService';

const InvoiceListPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    searchTerm: '',
    paymentMethod: 'All',
    invoiceType: 'All',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const paymentMethods = ['All', 'Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'];
  const invoiceTypes = ['All', 'Sale', 'Return', 'Exchange'];
  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'soldOn', label: 'Sale Date' },
    { value: 'finalAmount', label: 'Amount' },
    { value: 'customerName', label: 'Customer' },
    { value: 'invoiceNumber', label: 'Invoice Number' }
  ];

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      if (filters.searchTerm) params.searchTerm = filters.searchTerm;
      if (filters.paymentMethod !== 'All') params.paymentMethod = filters.paymentMethod;
      if (filters.invoiceType !== 'All') params.invoiceType = filters.invoiceType;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await invoiceService.getAllInvoices(params);
      
      if (response && response.data) {
        setInvoices(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
        }));
        success(`Loaded ${response.data.items?.length || 0} invoices`);
      } else {
        setInvoices([]);
        error('No invoices found');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setInvoices([]);
      error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [pagination.page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    fetchInvoices();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.deleteInvoice(id);
        success('Invoice deleted successfully');
        fetchInvoices();
      } catch (err) {
        console.error('Error deleting invoice:', err);
        error('Failed to delete invoice');
      }
    }
  };

  const handlePrintInvoice = async (id) => {
    try {
      const response = await invoiceService.printInvoice(id);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      success('Invoice printed successfully');
    } catch (err) {
      console.error('Error printing invoice:', err);
      error('Failed to print invoice');
    }
  };

  const handleSendEmail = async (id) => {
    const email = prompt('Enter customer email address:');
    if (email) {
      try {
        await invoiceService.sendInvoiceEmail(id, email);
        success('Invoice sent via email successfully');
      } catch (err) {
        console.error('Error sending email:', err);
        error('Failed to send email');
      }
    }
  };

  const getStatusColor = (invoice) => {
    if (invoice.isGstApplied) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  const getStatusText = (invoice) => {
    return invoice.isGstApplied ? 'Pakka Bill' : 'Kaccha Bill';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Invoice List
        </label>
        
        {/* Refresh and New Invoice - Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Refresh Button */}
          <Button
            onClick={fetchInvoices}
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          {/* New Invoice Button */}
          <Link to="/invoices/create">
            <Button className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto">
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search invoices, customers, products..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              icon={Search}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select
            value={filters.paymentMethod}
            onChange={(value) => handleFilterChange('paymentMethod', value)}
            options={paymentMethods.map(method => ({ value: method, label: method }))}
            placeholder="Payment Method"
          />
          
          <Select
            value={filters.invoiceType}
            onChange={(value) => handleFilterChange('invoiceType', value)}
            options={invoiceTypes.map(type => ({ value: type, label: type }))}
            placeholder="Invoice Type"
          />
          
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            placeholder="Start Date"
          />
          
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            placeholder="End Date"
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleSearch} className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                searchTerm: '',
                paymentMethod: 'All',
                invoiceType: 'All',
                startDate: '',
                endDate: '',
                sortBy: 'createdAt',
                sortOrder: 'desc'
              });
            }}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Clear Filters</span>
          </Button>
          
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
            options={sortOptions.map(option => [
              { value: `${option.value}-asc`, label: `${option.label} (A-Z)` },
              { value: `${option.value}-desc`, label: `${option.label} (Z-A)` }
            ]).flat()}
            placeholder="Sort By"
          />
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Invoice #
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Payment
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading invoices...</span>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No invoices found. Try adjusting your filters or create a new invoice.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4 text-primary-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          #{invoice.invoiceNumber || invoice.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invoice.customerName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {invoice.customerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invoice.productName || 'Product'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {invoice.rfidCode}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ₹{invoice.finalAmount?.toLocaleString() || 0}
                        </p>
                        {invoice.discountAmount > 0 && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            -₹{invoice.discountAmount.toLocaleString()} discount
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {invoice.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice)}`}>
                        {getStatusText(invoice)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(invoice.soldOn || invoice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintInvoice(invoice.id)}
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendEmail(invoice.id)}
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Link to={`/invoices/details/${invoice.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          title="Delete Invoice"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InvoiceListPage;
