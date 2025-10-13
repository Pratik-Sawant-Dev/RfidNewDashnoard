import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Plus, 
  Minus, 
  Calculator,
  Receipt,
  User,
  CreditCard,
  Tag,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import useToast from '../../hooks/useToast';
import invoiceService from '../../services/invoiceService';
import apiService from '../../services/apiService';

const CreateInvoicePage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    rfidCode: '',
    customerName: '',
    customerPhone: '',
    sellingPrice: 0,
    discountAmount: 0,
    finalAmount: 0,
    isGstApplied: false,
    gstPercentage: 3.00,
    invoiceType: 'Sale',
    paymentMethod: 'Cash',
    soldOn: new Date().toISOString().slice(0, 16),
    remarks: ''
  });
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cheque', label: 'Cheque' }
  ];

  const invoiceTypes = [
    { value: 'Sale', label: 'Sale' },
    { value: 'Return', label: 'Return' },
    { value: 'Exchange', label: 'Exchange' }
  ];

  const gstRates = [
    { value: 0, label: '0% (No GST)' },
    { value: 3, label: '3% (Gold)' },
    { value: 5, label: '5%' },
    { value: 12, label: '12%' },
    { value: 18, label: '18%' },
    { value: 28, label: '28%' }
  ];

  const fetchProducts = async () => {
    try {
      const response = await apiService.getAllProducts();
      if (response && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calculateAmounts = () => {
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const discountAmount = parseFloat(formData.discountAmount) || 0;
    const gstPercentage = formData.isGstApplied ? parseFloat(formData.gstPercentage) : 0;
    
    const amountAfterDiscount = sellingPrice - discountAmount;
    const gstAmount = (amountAfterDiscount * gstPercentage) / 100;
    const finalAmount = amountAfterDiscount + gstAmount;
    
    setFormData(prev => ({
      ...prev,
      finalAmount: Math.round(finalAmount * 100) / 100
    }));
  };

  useEffect(() => {
    calculateAmounts();
  }, [formData.sellingPrice, formData.discountAmount, formData.isGstApplied, formData.gstPercentage]);

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setFormData(prev => ({
        ...prev,
        productId: productId,
        rfidCode: product.rfidCode || '',
        sellingPrice: product.sellingPrice || product.price || 0
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Customer phone is required';
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than 0';
    if (formData.discountAmount < 0) newErrors.discountAmount = 'Discount amount cannot be negative';
    if (formData.discountAmount > formData.sellingPrice) newErrors.discountAmount = 'Discount cannot be greater than selling price';
    if (formData.isGstApplied && formData.gstPercentage < 0) newErrors.gstPercentage = 'GST percentage cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        ...formData,
        productId: parseInt(formData.productId),
        sellingPrice: parseFloat(formData.sellingPrice),
        discountAmount: parseFloat(formData.discountAmount),
        finalAmount: parseFloat(formData.finalAmount),
        gstPercentage: parseFloat(formData.gstPercentage),
        soldOn: new Date(formData.soldOn).toISOString()
      };

      const response = await invoiceService.createInvoice(invoiceData);
      
      if (response) {
        success('Invoice created successfully');
        navigate('/invoices/list');
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      error(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      productId: '',
      rfidCode: '',
      customerName: '',
      customerPhone: '',
      sellingPrice: 0,
      discountAmount: 0,
      finalAmount: 0,
      isGstApplied: false,
      gstPercentage: 3.00,
      invoiceType: 'Sale',
      paymentMethod: 'Cash',
      soldOn: new Date().toISOString().slice(0, 16),
      remarks: ''
    });
    setErrors({});
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Invoice
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new invoice for sale, return, or exchange
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/invoices')}
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-primary-500" />
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Product *
                  </label>
                  <Select
                    value={formData.productId}
                    onChange={handleProductSelect}
                    options={products.map(product => ({
                      value: product.id,
                      label: `${product.name} - ${product.rfidCode || 'No RFID'}`
                    }))}
                    placeholder="Choose a product"
                    error={errors.productId}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    RFID Code
                  </label>
                  <Input
                    value={formData.rfidCode}
                    onChange={(e) => handleInputChange('rfidCode', e.target.value)}
                    placeholder="RFID Code"
                    readOnly
                  />
                </div>
              </div>
            </Card>

            {/* Customer Details */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-500" />
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Name *
                  </label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                    error={errors.customerName}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Phone *
                  </label>
                  <Input
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="Enter phone number"
                    error={errors.customerPhone}
                  />
                </div>
              </div>
            </Card>

            {/* Pricing Details */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary-500" />
                Pricing Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selling Price *
                  </label>
                  <Input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                    placeholder="0.00"
                    error={errors.sellingPrice}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Amount
                  </label>
                  <Input
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                    placeholder="0.00"
                    error={errors.discountAmount}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </Card>

            {/* GST Details */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-primary-500" />
                GST Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isGstApplied"
                    checked={formData.isGstApplied}
                    onChange={(e) => handleInputChange('isGstApplied', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isGstApplied" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apply GST (Pakka Bill)
                  </label>
                </div>
                
                {formData.isGstApplied && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GST Percentage
                    </label>
                    <Select
                      value={formData.gstPercentage}
                      onChange={(value) => handleInputChange('gstPercentage', value)}
                      options={gstRates}
                      error={errors.gstPercentage}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Transaction Details */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary-500" />
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Invoice Type
                  </label>
                  <Select
                    value={formData.invoiceType}
                    onChange={(value) => handleInputChange('invoiceType', value)}
                    options={invoiceTypes}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(value) => handleInputChange('paymentMethod', value)}
                    options={paymentMethods}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sale Date
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.soldOn}
                    onChange={(e) => handleInputChange('soldOn', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Additional notes or remarks..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows="3"
                />
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Amount Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Amount Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Selling Price:</span>
                  <span className="font-medium">₹{formData.sellingPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="font-medium text-green-600">-₹{formData.discountAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount after discount:</span>
                  <span className="font-medium">₹{(formData.sellingPrice - formData.discountAmount).toLocaleString()}</span>
                </div>
                
                {formData.isGstApplied && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">GST ({formData.gstPercentage}%):</span>
                    <span className="font-medium">₹{(((formData.sellingPrice - formData.discountAmount) * formData.gstPercentage) / 100).toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Final Amount:</span>
                    <span className="text-lg font-bold text-primary-600">₹{formData.finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bill Type Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Bill Type
              </h3>
              <div className={`p-4 rounded-lg ${
                formData.isGstApplied 
                  ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <Receipt className={`w-5 h-5 ${
                    formData.isGstApplied ? 'text-green-600' : 'text-orange-600'
                  }`} />
                  <span className={`font-semibold ${
                    formData.isGstApplied ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'
                  }`}>
                    {formData.isGstApplied ? 'Pakka Bill' : 'Kaccha Bill'}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${
                  formData.isGstApplied ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'
                }`}>
                  {formData.isGstApplied 
                    ? 'GST applied - Official invoice' 
                    : 'No GST - Informal bill'
                  }
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card>
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Creating...' : 'Create Invoice'}</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Reset Form</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePage;
