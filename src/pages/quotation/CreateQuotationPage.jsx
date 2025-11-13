import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Search,
  Loader2,
  Calculator,
  FileText,
  User,
  Tag,
  Package,
  CheckCircle,
  Plus,
  Trash2,
  Layers,
  ChevronUp,
  ChevronDown,
  Scale,
  Gem,
  Calendar,
  Mail
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import useToast from '../../hooks/useToast';
import quotationService from '../../services/quotationService';
import apiService from '../../services/apiService';

const CreateQuotationPage = () => {
  const { toasts, removeToast, success, error } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMultipleMode, setIsMultipleMode] = useState(false);
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [productErrors, setProductErrors] = useState({});
  const productsListRef = useRef(null);
  
  // Common quotation data (shared across all products in multiple mode)
  const [commonData, setCommonData] = useState({
    customerId: '',
    paymentMode: 'Cash',
    isGstApplied: false,
    gstPercentage: 3.00,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    remarks: '',
    sendEmail: false,
    oldMetalWeight: null,
    oldMetalRate: null,
    oldMetalAmount: null
  });

  // Single product form data
  const [formData, setFormData] = useState({
    productId: '',
    itemCode: '',
    rfidCode: '',
    grossWeight: 0,
    stoneWeight: 0,
    netWeight: 0,
    goldRate: 0,
    making: 0,
    makingType: 'Fixed',
    stoneAmount: 0,
    quantity: 1,
    remarks: '',
    customerId: '',
    paymentMode: 'Cash',
    isGstApplied: false,
    gstPercentage: 3.00,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    sendEmail: false,
    oldMetalWeight: null,
    oldMetalRate: null,
    oldMetalAmount: null
  });
  const [errors, setErrors] = useState({});

  const paymentModes = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cheque', label: 'Cheque' }
  ];

  const makingTypes = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Percentage', label: 'Percentage' }
  ];

  const gstRates = [
    { value: 0, label: '0% (No GST)' },
    { value: 3, label: '3% (Gold)' },
    { value: 5, label: '5%' },
    { value: 12, label: '12%' },
    { value: 18, label: '18%' },
    { value: 28, label: '28%' }
  ];

  // Calculate net weight
  const calculateNetWeight = (grossWeight, stoneWeight) => {
    return Math.max(0, (parseFloat(grossWeight) || 0) - (parseFloat(stoneWeight) || 0));
  };

  // Calculate product total
  const calculateProductTotal = (product) => {
    const netWeight = parseFloat(product.netWeight) || 0;
    const goldRate = parseFloat(product.goldRate) || 0;
    const making = parseFloat(product.making) || 0;
    const makingType = product.makingType || 'Fixed';
    const stoneAmount = parseFloat(product.stoneAmount) || 0;
    const quantity = parseInt(product.quantity) || 1;

    // Gold amount
    const goldAmount = netWeight * goldRate;
    
    // Making charges
    const makingCharges = makingType === 'Percentage' 
      ? (goldAmount * making) / 100 
      : making;
    
    // Subtotal
    const subtotal = (goldAmount + makingCharges + stoneAmount) * quantity;
    
    // GST
    const isGstApplied = isMultipleMode ? commonData.isGstApplied : formData.isGstApplied;
    const gstPercentage = isMultipleMode ? parseFloat(commonData.gstPercentage) : parseFloat(formData.gstPercentage);
    const gstAmount = isGstApplied ? (subtotal * gstPercentage) / 100 : 0;
    
    // Final total
    const total = subtotal + gstAmount;
    
    return {
      goldAmount,
      makingCharges,
      subtotal,
      gstAmount,
      total
    };
  };

  // Search product by RFID or Item Code
  const searchProduct = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      error('Please enter RFID number or Item Code');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await apiService.getAllProducts();
      const products = Array.isArray(response) ? response : (response.data || response || []);
      
      const query = searchQuery.trim().toLowerCase();
      const product = products.find(p => {
        const rfidCode = p.rfidCode ? p.rfidCode.trim().toLowerCase() : '';
        const itemCode = p.itemCode ? p.itemCode.trim().toLowerCase() : '';
        return rfidCode === query || itemCode === query;
      });

      if (product) {
        const productId = product.id || product.productId || product.productID || '';
        
        if (isMultipleMode) {
          // Check if product already added
          if (selectedProducts.some(p => 
            (p.rfidCode && p.rfidCode === product.rfidCode) || 
            (p.itemCode && p.itemCode === product.itemCode)
          )) {
            error('This product is already added to the list');
            setSearchQuery('');
            setSearchLoading(false);
            return;
          }

          // Add to multiple products list
          const newProduct = {
            id: Date.now(),
            productId: productId,
            product: product,
            itemCode: product.itemCode || '',
            rfidCode: product.rfidCode || '',
            grossWeight: product.weight || product.grossWeight || 0,
            stoneWeight: product.stoneWeight || 0,
            netWeight: calculateNetWeight(product.weight || product.grossWeight || 0, product.stoneWeight || 0),
            goldRate: product.goldRate || 0,
            making: product.makingCharges || product.making || 0,
            makingType: 'Fixed',
            stoneAmount: product.stoneAmount || 0,
            quantity: 1,
            remarks: ''
          };
          setSelectedProducts(prev => [...prev, newProduct]);
          setExpandedProducts(prev => new Set([...prev, newProduct.id]));
          success('Product added successfully');
          setSearchQuery('');
          
          setTimeout(() => {
            if (productsListRef.current) {
              productsListRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 100);
        } else {
          // Single product mode
          setSearchedProduct(product);
          setFormData(prev => ({
            ...prev,
            productId: productId,
            itemCode: product.itemCode || '',
            rfidCode: product.rfidCode || '',
            grossWeight: product.weight || product.grossWeight || 0,
            stoneWeight: product.stoneWeight || 0,
            netWeight: calculateNetWeight(product.weight || product.grossWeight || 0, product.stoneWeight || 0),
            goldRate: product.goldRate || 0,
            making: product.makingCharges || product.making || 0
          }));
          success('Product found successfully');
        }
      } else {
        setSearchedProduct(null);
        error('Product not found. Please check the RFID number or Item Code.');
      }
    } catch (err) {
      console.error('Error searching product:', err);
      setSearchedProduct(null);
      error(err.response?.data?.message || 'Failed to search product');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchProduct();
    }
  };

  // Toggle product expansion
  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Remove product from multiple list
  const removeProduct = (id) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setProductErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${id}_`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
    success('Product removed');
  };

  // Update product in multiple list
  const updateProductInList = (id, field, value) => {
    setSelectedProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        
        // Recalculate net weight if gross weight or stone weight changes
        if (field === 'grossWeight' || field === 'stoneWeight') {
          updated.netWeight = calculateNetWeight(updated.grossWeight, updated.stoneWeight);
        }
        
        return updated;
      }
      return p;
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate net weight if gross weight or stone weight changes
      if (field === 'grossWeight' || field === 'stoneWeight') {
        updated.netWeight = calculateNetWeight(updated.grossWeight, updated.stoneWeight);
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCommonDataChange = (field, value) => {
    setCommonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate totals for multiple products
  const calculateTotals = () => {
    const totals = selectedProducts.reduce((acc, p) => {
      const calc = calculateProductTotal(p);
      acc.goldAmount += calc.goldAmount;
      acc.makingCharges += calc.makingCharges;
      acc.stoneAmount += (parseFloat(p.stoneAmount) || 0) * (parseInt(p.quantity) || 1);
      acc.subtotal += calc.subtotal;
      acc.gstAmount += calc.gstAmount;
      acc.total += calc.total;
      return acc;
    }, { goldAmount: 0, makingCharges: 0, stoneAmount: 0, subtotal: 0, gstAmount: 0, total: 0 });
    
    // Add old metal amount if applicable
    if (commonData.oldMetalAmount) {
      totals.subtotal += parseFloat(commonData.oldMetalAmount);
      totals.total += parseFloat(commonData.oldMetalAmount);
    }
    
    return totals;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isMultipleMode) {
      if (selectedProducts.length === 0) {
        newErrors.products = 'Please add at least one product';
      }
      if (!commonData.customerId) {
        newErrors.customerId = 'Customer ID is required';
      }
      
      selectedProducts.forEach((p) => {
        if (parseFloat(p.grossWeight) <= 0) {
          newErrors[`product_${p.id}_grossWeight`] = 'Gross weight must be greater than 0';
        }
        if (parseFloat(p.netWeight) < 0) {
          newErrors[`product_${p.id}_netWeight`] = 'Net weight cannot be negative';
        }
        if (parseFloat(p.goldRate) <= 0) {
          newErrors[`product_${p.id}_goldRate`] = 'Gold rate must be greater than 0';
        }
        if (parseInt(p.quantity) <= 0) {
          newErrors[`product_${p.id}_quantity`] = 'Quantity must be greater than 0';
        }
      });
    } else {
      if (!formData.productId) newErrors.productId = 'Please search and select a product';
      if (!formData.customerId) newErrors.customerId = 'Customer ID is required';
      if (parseFloat(formData.grossWeight) <= 0) newErrors.grossWeight = 'Gross weight must be greater than 0';
      if (parseFloat(formData.netWeight) < 0) newErrors.netWeight = 'Net weight cannot be negative';
      if (parseFloat(formData.goldRate) <= 0) newErrors.goldRate = 'Gold rate must be greater than 0';
      if (parseInt(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Please fix the errors before submitting');
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    setLoading(true);
    try {
      if (isMultipleMode) {
        // Create quotation with multiple items
        const items = selectedProducts.map(p => ({
          productId: parseInt(p.productId),
          itemCode: p.itemCode,
          rfidCode: p.rfidCode,
          grossWeight: parseFloat(p.grossWeight),
          stoneWeight: parseFloat(p.stoneWeight) || 0,
          netWeight: parseFloat(p.netWeight),
          goldRate: parseFloat(p.goldRate),
          making: parseFloat(p.making) || 0,
          makingType: p.makingType || 'Fixed',
          stoneAmount: parseFloat(p.stoneAmount) || 0,
          quantity: parseInt(p.quantity) || 1,
          remarks: p.remarks || ''
        }));

        const quotationData = {
          items,
          customerId: parseInt(commonData.customerId),
          oldMetalWeight: commonData.oldMetalWeight ? parseFloat(commonData.oldMetalWeight) : null,
          oldMetalRate: commonData.oldMetalRate ? parseFloat(commonData.oldMetalRate) : null,
          oldMetalAmount: commonData.oldMetalAmount ? parseFloat(commonData.oldMetalAmount) : null,
          paymentMode: commonData.paymentMode,
          isGstApplied: commonData.isGstApplied,
          gstPercentage: parseFloat(commonData.gstPercentage),
          validUntil: new Date(commonData.validUntil).toISOString(),
          remarks: commonData.remarks,
          sendEmail: commonData.sendEmail
        };

        const response = await quotationService.createQuotation(quotationData);
        
        if (response) {
          success(`Successfully created quotation with ${items.length} item(s)`);
          navigate('/quotation/list');
        }
      } else {
        // Create single item quotation
        const quotationData = {
          items: [{
            productId: parseInt(formData.productId),
            itemCode: formData.itemCode,
            rfidCode: formData.rfidCode,
            grossWeight: parseFloat(formData.grossWeight),
            stoneWeight: parseFloat(formData.stoneWeight) || 0,
            netWeight: parseFloat(formData.netWeight),
            goldRate: parseFloat(formData.goldRate),
            making: parseFloat(formData.making) || 0,
            makingType: formData.makingType,
            stoneAmount: parseFloat(formData.stoneAmount) || 0,
            quantity: parseInt(formData.quantity) || 1,
            remarks: formData.remarks || ''
          }],
          customerId: parseInt(formData.customerId),
          oldMetalWeight: formData.oldMetalWeight ? parseFloat(formData.oldMetalWeight) : null,
          oldMetalRate: formData.oldMetalRate ? parseFloat(formData.oldMetalRate) : null,
          oldMetalAmount: formData.oldMetalAmount ? parseFloat(formData.oldMetalAmount) : null,
          paymentMode: formData.paymentMode,
          isGstApplied: formData.isGstApplied,
          gstPercentage: parseFloat(formData.gstPercentage),
          validUntil: new Date(formData.validUntil).toISOString(),
          remarks: formData.remarks,
          sendEmail: formData.sendEmail
        };

        const response = await quotationService.createQuotation(quotationData);
        
        if (response) {
          success('Quotation created successfully');
          navigate('/quotation/list');
        }
      }
    } catch (err) {
      console.error('Error creating quotation:', err);
      error(err.response?.data?.message || 'Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchedProduct(null);
    setSelectedProducts([]);
    setExpandedProducts(new Set());
    setProductErrors({});
    setFormData({
      productId: '',
      itemCode: '',
      rfidCode: '',
      grossWeight: 0,
      stoneWeight: 0,
      netWeight: 0,
      goldRate: 0,
      making: 0,
      makingType: 'Fixed',
      stoneAmount: 0,
      quantity: 1,
      remarks: '',
      customerId: '',
      paymentMode: 'Cash',
      isGstApplied: false,
      gstPercentage: 3.00,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      sendEmail: false,
      oldMetalWeight: null,
      oldMetalRate: null,
      oldMetalAmount: null
    });
    setCommonData({
      customerId: '',
      paymentMode: 'Cash',
      isGstApplied: false,
      gstPercentage: 3.00,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      remarks: '',
      sendEmail: false,
      oldMetalWeight: null,
      oldMetalRate: null,
      oldMetalAmount: null
    });
    setErrors({});
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '₹0.00';
    return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatWeight = (value) => {
    if (!value && value !== 0) return '-';
    return `${parseFloat(value).toFixed(3)}g`;
  };

  const totals = isMultipleMode ? calculateTotals() : null;
  const singleProductTotal = !isMultipleMode && searchedProduct ? calculateProductTotal(formData) : null;

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Create New Quotation
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
          Search product by RFID number or Item Code to create quotation
        </p>
      </div>

      {/* Combined Search and Mode Toggle Section */}
      <Card className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Side - Search */}
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
              Search Product
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Enter RFID number or Item Code and press Enter"
                  icon={Tag}
                  iconColor="text-gray-400"
                />
              </div>
              <Button
                type="button"
                onClick={searchProduct}
                disabled={searchLoading || !searchQuery.trim()}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                {searchLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm sm:text-base">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Search</span>
                  </>
                )}
              </Button>
            </div>
            {errors.productId && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.productId}</p>
            )}
            {errors.products && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.products}</p>
            )}
          </div>

          {/* Right Side - Mode Toggle */}
          <div className="lg:w-56 xl:w-64 flex-shrink-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
              Quotation Mode
            </h3>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <div className="text-center mb-3">
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-0.5">
                  {isMultipleMode ? (
                    <span className="flex items-center justify-center space-x-1.5">
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Multiple</span>
                    </span>
                  ) : (
                    <span>Single</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {isMultipleMode ? 'Multiple Products' : 'Single Product'}
                </p>
              </div>
              
              <div className="flex items-center justify-center mb-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isMultipleMode) {
                      setIsMultipleMode(false);
                      setSelectedProducts([]);
                      setSearchedProduct(null);
                      setSearchQuery('');
                      setExpandedProducts(new Set());
                      setProductErrors({});
                    } else {
                      setIsMultipleMode(true);
                      setSearchedProduct(null);
                      setSearchQuery('');
                    }
                  }}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isMultipleMode
                      ? 'bg-primary-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label="Toggle quotation mode"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                      isMultipleMode ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-600 dark:text-gray-400 leading-tight">
                {isMultipleMode ? 'Create quotation for multiple products' : 'Create quotation for a single product'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Multiple Products List */}
      {isMultipleMode && selectedProducts.length > 0 && (
        <Card className="p-3 sm:p-4 md:p-6" ref={productsListRef}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
              Selected Products ({selectedProducts.length})
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {selectedProducts.map((productItem, index) => {
              const isExpanded = expandedProducts.has(productItem.id);
              const calc = calculateProductTotal(productItem);
              const hasErrors = Object.keys(productErrors).some(key => key.startsWith(`${productItem.id}_`));
              
              return (
                <Card 
                  key={productItem.id} 
                  className={`bg-gray-50 dark:bg-gray-900/50 border-2 ${hasErrors ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="flex items-center justify-between p-2 sm:p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                            {productItem.product.productName || productItem.product.name || 'Unknown Product'}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-mono">{productItem.itemCode || '-'}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-mono">{productItem.rfidCode || '-'}</span>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>Net: {formatWeight(productItem.netWeight)}</span>
                        <span className="text-gray-400">•</span>
                        <span>Rate: {formatCurrency(productItem.goldRate)}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-semibold text-primary-600">
                          Total: {formatCurrency(calc.total)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => toggleProductExpansion(productItem.id)}
                        className="p-1.5 sm:p-2"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeProduct(productItem.id)}
                        className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 mt-2 sm:mt-3">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Product Info */}
                        <div className="space-y-2">
                          <h5 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Product Information
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div>
                              <label className="block text-gray-500 dark:text-gray-400 mb-0.5">Category</label>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {productItem.product.categoryName || '-'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-gray-500 dark:text-gray-400 mb-0.5">Design</label>
                              <p className="text-gray-900 dark:text-white">
                                {productItem.product.designName || '-'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-gray-500 dark:text-gray-400 mb-0.5">Purity</label>
                              <p className="text-gray-900 dark:text-white">
                                {productItem.product.purityName || '-'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Product Details Inputs */}
                        <div className="space-y-3">
                          <h5 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Product Details
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Input
                                label="Gross Weight (g) *"
                                type="number"
                                value={productItem.grossWeight}
                                onChange={(e) => updateProductInList(productItem.id, 'grossWeight', e.target.value)}
                                placeholder="0.000"
                                min="0"
                                step="0.001"
                                error={productErrors[`${productItem.id}_grossWeight`] || errors[`product_${productItem.id}_grossWeight`]}
                                data-error={productErrors[`${productItem.id}_grossWeight`] || errors[`product_${productItem.id}_grossWeight`] ? 'true' : 'false'}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Input
                                label="Stone Weight (g)"
                                type="number"
                                value={productItem.stoneWeight}
                                onChange={(e) => updateProductInList(productItem.id, 'stoneWeight', e.target.value)}
                                placeholder="0.000"
                                min="0"
                                step="0.001"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Input
                                label="Net Weight (g)"
                                type="number"
                                value={productItem.netWeight}
                                readOnly
                                className="text-sm bg-gray-50 dark:bg-gray-800"
                              />
                            </div>
                            <div>
                              <Input
                                label="Gold Rate (₹/g) *"
                                type="number"
                                value={productItem.goldRate}
                                onChange={(e) => updateProductInList(productItem.id, 'goldRate', e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                error={productErrors[`${productItem.id}_goldRate`] || errors[`product_${productItem.id}_goldRate`]}
                                data-error={productErrors[`${productItem.id}_goldRate`] || errors[`product_${productItem.id}_goldRate`] ? 'true' : 'false'}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Input
                                label="Making Charges"
                                type="number"
                                value={productItem.making}
                                onChange={(e) => updateProductInList(productItem.id, 'making', e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Select
                                label="Making Type"
                                value={productItem.makingType}
                                onChange={(value) => updateProductInList(productItem.id, 'makingType', value)}
                                options={makingTypes}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Input
                                label="Stone Amount (₹)"
                                type="number"
                                value={productItem.stoneAmount}
                                onChange={(e) => updateProductInList(productItem.id, 'stoneAmount', e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Input
                                label="Quantity *"
                                type="number"
                                value={productItem.quantity}
                                onChange={(e) => updateProductInList(productItem.id, 'quantity', e.target.value)}
                                placeholder="1"
                                min="1"
                                step="1"
                                error={productErrors[`${productItem.id}_quantity`] || errors[`product_${productItem.id}_quantity`]}
                                data-error={productErrors[`${productItem.id}_quantity`] || errors[`product_${productItem.id}_quantity`] ? 'true' : 'false'}
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Input
                              label="Remarks"
                              value={productItem.remarks}
                              onChange={(e) => updateProductInList(productItem.id, 'remarks', e.target.value)}
                              placeholder="Product remarks..."
                              className="text-sm"
                            />
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Item Total:</span>
                            <span className="text-base sm:text-lg font-bold text-primary-600">
                              {formatCurrency(calc.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </Card>
      )}

      {/* Single Product Details Section */}
      {!isMultipleMode && searchedProduct && (
        <Card className="p-3 sm:p-4 md:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
            Product Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Product Name
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                {searchedProduct.productName || searchedProduct.name || '-'}
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Item Code
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                {searchedProduct.itemCode || '-'}
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                RFID Code
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-mono font-medium">
                {searchedProduct.rfidCode || '-'}
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Category
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                {searchedProduct.categoryName || '-'}
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Design
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                {searchedProduct.designName || '-'}
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Purity
              </label>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                {searchedProduct.purityName || '-'}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Product found and ready for quotation creation</span>
            </div>
          </div>
        </Card>
      )}

      {/* Quotation Form */}
      {((!isMultipleMode && searchedProduct) || (isMultipleMode && selectedProducts.length > 0)) && (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Customer Details */}
              <Card className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Input
                      label="Customer ID *"
                      value={isMultipleMode ? commonData.customerId : formData.customerId}
                      onChange={(e) => isMultipleMode 
                        ? handleCommonDataChange('customerId', e.target.value)
                        : handleInputChange('customerId', e.target.value)
                      }
                      placeholder="Enter customer ID"
                      error={errors.customerId}
                      required
                      data-error={errors.customerId ? 'true' : 'false'}
                    />
                  </div>
                </div>
              </Card>

              {/* Product Details - Single Mode Only */}
              {!isMultipleMode && (
                <Card className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
                    Weight & Pricing Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Input
                        label="Gross Weight (g) *"
                        type="number"
                        value={formData.grossWeight}
                        onChange={(e) => handleInputChange('grossWeight', e.target.value)}
                        placeholder="0.000"
                        min="0"
                        step="0.001"
                        error={errors.grossWeight}
                        required
                        data-error={errors.grossWeight ? 'true' : 'false'}
                      />
                    </div>
                    <div>
                      <Input
                        label="Stone Weight (g)"
                        type="number"
                        value={formData.stoneWeight}
                        onChange={(e) => handleInputChange('stoneWeight', e.target.value)}
                        placeholder="0.000"
                        min="0"
                        step="0.001"
                      />
                    </div>
                    <div>
                      <Input
                        label="Net Weight (g)"
                        type="number"
                        value={formData.netWeight}
                        readOnly
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <Input
                        label="Gold Rate (₹/g) *"
                        type="number"
                        value={formData.goldRate}
                        onChange={(e) => handleInputChange('goldRate', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        error={errors.goldRate}
                        required
                        data-error={errors.goldRate ? 'true' : 'false'}
                      />
                    </div>
                    <div>
                      <Input
                        label="Making Charges"
                        type="number"
                        value={formData.making}
                        onChange={(e) => handleInputChange('making', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Select
                        label="Making Type"
                        value={formData.makingType}
                        onChange={(value) => handleInputChange('makingType', value)}
                        options={makingTypes}
                      />
                    </div>
                    <div>
                      <Input
                        label="Stone Amount (₹)"
                        type="number"
                        value={formData.stoneAmount}
                        onChange={(e) => handleInputChange('stoneAmount', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Input
                        label="Quantity *"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        placeholder="1"
                        min="1"
                        step="1"
                        error={errors.quantity}
                        required
                        data-error={errors.quantity ? 'true' : 'false'}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Old Metal Details */}
              <Card className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <Gem className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
                  Old Metal Details (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Input
                      label="Old Metal Weight (g)"
                      type="number"
                      value={isMultipleMode ? (commonData.oldMetalWeight || '') : (formData.oldMetalWeight || '')}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : e.target.value;
                        isMultipleMode
                          ? handleCommonDataChange('oldMetalWeight', value)
                          : handleInputChange('oldMetalWeight', value);
                      }}
                      placeholder="0.000"
                      min="0"
                      step="0.001"
                    />
                  </div>
                  <div>
                    <Input
                      label="Old Metal Rate (₹/g)"
                      type="number"
                      value={isMultipleMode ? (commonData.oldMetalRate || '') : (formData.oldMetalRate || '')}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : e.target.value;
                        isMultipleMode
                          ? handleCommonDataChange('oldMetalRate', value)
                          : handleInputChange('oldMetalRate', value);
                      }}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Input
                      label="Old Metal Amount (₹)"
                      type="number"
                      value={isMultipleMode ? (commonData.oldMetalAmount || '') : (formData.oldMetalAmount || '')}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : e.target.value;
                        isMultipleMode
                          ? handleCommonDataChange('oldMetalAmount', value)
                          : handleInputChange('oldMetalAmount', value);
                      }}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </Card>

              {/* GST Details */}
              <Card className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
                  GST Details
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isGstApplied"
                      checked={isMultipleMode ? commonData.isGstApplied : formData.isGstApplied}
                      onChange={(e) => isMultipleMode
                        ? handleCommonDataChange('isGstApplied', e.target.checked)
                        : handleInputChange('isGstApplied', e.target.checked)
                      }
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="isGstApplied" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                      Apply GST
                    </label>
                  </div>
                  
                  {(isMultipleMode ? commonData.isGstApplied : formData.isGstApplied) && (
                    <div>
                      <Select
                        label="GST Percentage"
                        value={isMultipleMode ? commonData.gstPercentage : formData.gstPercentage}
                        onChange={(value) => isMultipleMode
                          ? handleCommonDataChange('gstPercentage', value)
                          : handleInputChange('gstPercentage', value)
                        }
                        options={gstRates}
                        error={errors.gstPercentage}
                      />
                    </div>
                  )}
                </div>
              </Card>

              {/* Quotation Details */}
              <Card className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500" />
                  Quotation Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Select
                      label="Payment Mode"
                      value={isMultipleMode ? commonData.paymentMode : formData.paymentMode}
                      onChange={(value) => isMultipleMode
                        ? handleCommonDataChange('paymentMode', value)
                        : handleInputChange('paymentMode', value)
                      }
                      options={paymentModes}
                    />
                  </div>
                  
                  <div>
                    <Input
                      label="Valid Until"
                      type="datetime-local"
                      value={isMultipleMode ? commonData.validUntil : formData.validUntil}
                      onChange={(e) => isMultipleMode
                        ? handleCommonDataChange('validUntil', e.target.value)
                        : handleInputChange('validUntil', e.target.value)
                      }
                    />
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={isMultipleMode ? commonData.remarks : formData.remarks}
                    onChange={(e) => isMultipleMode
                      ? handleCommonDataChange('remarks', e.target.value)
                      : handleInputChange('remarks', e.target.value)
                    }
                    placeholder="Additional notes or remarks..."
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows="3"
                  />
                </div>

                <div className="mt-3 sm:mt-4 flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={isMultipleMode ? commonData.sendEmail : formData.sendEmail}
                    onChange={(e) => isMultipleMode
                      ? handleCommonDataChange('sendEmail', e.target.checked)
                      : handleInputChange('sendEmail', e.target.checked)
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="sendEmail" className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Send quotation via email</span>
                  </label>
                </div>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Amount Summary */}
              <Card className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Amount Summary
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {isMultipleMode && totals ? (
                    <>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600 dark:text-gray-400">Gold Amount:</span>
                        <span className="font-medium">{formatCurrency(totals.goldAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600 dark:text-gray-400">Making Charges:</span>
                        <span className="font-medium">{formatCurrency(totals.makingCharges)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600 dark:text-gray-400">Stone Amount:</span>
                        <span className="font-medium">{formatCurrency(totals.stoneAmount)}</span>
                      </div>
                      {commonData.oldMetalAmount && (
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600 dark:text-gray-400">Old Metal:</span>
                          <span className="font-medium text-green-600">-{formatCurrency(commonData.oldMetalAmount)}</span>
                        </div>
                      )}
                      {commonData.isGstApplied && (
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600 dark:text-gray-400">GST ({commonData.gstPercentage}%):</span>
                          <span className="font-medium">{formatCurrency(totals.gstAmount)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 sm:pt-3">
                        <div className="flex justify-between">
                          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Grand Total:</span>
                          <span className="text-base sm:text-lg font-bold text-primary-600">{formatCurrency(totals.total)}</span>
                        </div>
                      </div>
                    </>
                  ) : singleProductTotal ? (
                    <>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600 dark:text-gray-400">Gold Amount:</span>
                        <span className="font-medium">{formatCurrency(singleProductTotal.goldAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600 dark:text-gray-400">Making Charges:</span>
                        <span className="font-medium">{formatCurrency(singleProductTotal.makingCharges)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600 dark:text-gray-400">Stone Amount:</span>
                        <span className="font-medium">{formatCurrency((parseFloat(formData.stoneAmount) || 0) * (parseInt(formData.quantity) || 1))}</span>
                      </div>
                      {formData.oldMetalAmount && (
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600 dark:text-gray-400">Old Metal:</span>
                          <span className="font-medium text-green-600">-{formatCurrency(formData.oldMetalAmount)}</span>
                        </div>
                      )}
                      {formData.isGstApplied && (
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600 dark:text-gray-400">GST ({formData.gstPercentage}%):</span>
                          <span className="font-medium">{formatCurrency(singleProductTotal.gstAmount)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 sm:pt-3">
                        <div className="flex justify-between">
                          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Final Total:</span>
                          <span className="text-base sm:text-lg font-bold text-primary-600">{formatCurrency(singleProductTotal.total + (parseFloat(formData.oldMetalAmount) || 0))}</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </Card>

              {/* Action Buttons */}
              <Card className="p-3 sm:p-4 md:p-6">
                <div className="space-y-2 sm:space-y-3">
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 text-sm sm:text-base"
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Creating...' : isMultipleMode ? `Create Quotation (${selectedProducts.length} items)` : 'Create Quotation'}</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="w-full flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <X className="w-4 h-4" />
                    <span>Reset Form</span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      )}

      {/* Empty State */}
      {!searchedProduct && !searchLoading && selectedProducts.length === 0 && (
        <Card className="p-6 sm:p-8 md:p-12">
          <div className="text-center py-8 sm:py-12">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Search for a Product
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Enter RFID number or Item Code above to search for a product and create a quotation
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreateQuotationPage;

