import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Printer, 
  Mail, 
  Download,
  Receipt,
  User,
  CreditCard,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useToast from '../../hooks/useToast';
import invoiceService from '../../services/invoiceService';

const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    try {
      const response = await invoiceService.getInvoiceById(id);
      if (response && response.data) {
        setInvoice(response.data);
        success('Invoice details loaded successfully');
      } else {
        error('Invoice not found');
        navigate('/invoices');
      }
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      error('Failed to load invoice details');
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvoiceDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      try {
        await invoiceService.deleteInvoice(id);
        success('Invoice deleted successfully');
        navigate('/invoices');
      } catch (err) {
        console.error('Error deleting invoice:', err);
        error('Failed to delete invoice');
      }
    }
  };

  const handlePrint = async () => {
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

  const handleSendEmail = async () => {
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

  const getStatusIcon = (invoice) => {
    return invoice.isGstApplied ? CheckCircle : AlertCircle;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading invoice details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The invoice you're looking for doesn't exist.</p>
          <Link to="/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Invoice #{invoice.invoiceNumber || invoice.id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Created on {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleSendEmail}
            className="flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/edit/${id}`)}
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Status */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  invoice.isGstApplied ? 'bg-green-100 dark:bg-green-900/20' : 'bg-orange-100 dark:bg-orange-900/20'
                }`}>
                  <Receipt className={`w-6 h-6 ${
                    invoice.isGstApplied ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Invoice Status
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {invoice.invoiceType} • {invoice.paymentMethod}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice)}`}>
                {React.createElement(getStatusIcon(invoice), { className: "w-4 h-4 mr-1" })}
                {getStatusText(invoice)}
              </span>
            </div>
          </Card>

          {/* Customer Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-500" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {invoice.customerName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {invoice.customerPhone}
                </p>
              </div>
            </div>
          </Card>

          {/* Product Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-primary-500" />
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {invoice.productName || 'Product'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RFID Code
                </label>
                <p className="text-gray-900 dark:text-white font-medium font-mono">
                  {invoice.rfidCode}
                </p>
              </div>
            </div>
          </Card>

          {/* Transaction Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary-500" />
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Type
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {invoice.invoiceType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {invoice.paymentMethod}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sale Date
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(invoice.soldOn).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created Date
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(invoice.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Remarks */}
          {invoice.remarks && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Remarks
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {invoice.remarks}
              </p>
            </Card>
          )}
        </div>

        {/* Amount Summary Sidebar */}
        <div className="space-y-6">
          {/* Amount Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Amount Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Selling Price:</span>
                <span className="font-medium">₹{invoice.sellingPrice?.toLocaleString() || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                <span className="font-medium text-green-600">-₹{invoice.discountAmount?.toLocaleString() || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount after discount:</span>
                <span className="font-medium">₹{((invoice.sellingPrice || 0) - (invoice.discountAmount || 0)).toLocaleString()}</span>
              </div>
              
              {invoice.isGstApplied && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GST ({invoice.gstPercentage}%):</span>
                  <span className="font-medium">₹{((((invoice.sellingPrice || 0) - (invoice.discountAmount || 0)) * (invoice.gstPercentage || 0)) / 100).toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Final Amount:</span>
                  <span className="text-lg font-bold text-primary-600">₹{invoice.finalAmount?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* GST Information */}
          {invoice.isGstApplied && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                GST Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GST Applied:</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GST Rate:</span>
                  <span className="font-medium">{invoice.gstPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GST Amount:</span>
                  <span className="font-medium">₹{((((invoice.sellingPrice || 0) - (invoice.discountAmount || 0)) * (invoice.gstPercentage || 0)) / 100).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={handlePrint}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </Button>
              
              <Button
                onClick={handleSendEmail}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </Button>
              
              <Button
                onClick={() => navigate(`/invoices/edit/${id}`)}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Invoice</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
