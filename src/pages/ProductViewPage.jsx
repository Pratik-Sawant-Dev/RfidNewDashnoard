import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Loader2,
  ArrowLeft,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import { ToastContainer } from '../components/ui/Toast';
import apiService from '../services/apiService';
import useToast from '../hooks/useToast';

const ProductViewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const { error, success, toasts, removeToast } = useToast();

  // Load product details from API
  const loadProductDetails = async () => {
    if (!productId) {
      error('Product ID is missing');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getProductById(productId);
      const productData = response.data || response;
      setProduct(productData);
    } catch (err) {
      console.error('Error loading product details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load product details';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  // Handle delete product
  const handleDelete = async () => {
    if (!productId) return;
    
    if (!window.confirm(`Are you sure you want to delete this product?\n\nItem Code: ${product?.itemCode || 'N/A'}\nProduct Name: ${product?.productName || 'N/A'}\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      const response = await apiService.deleteProduct(productId);
      
      const message = response?.message || response?.data?.message || 'Product deleted successfully';
      success(message);
      
      // Navigate back to product list after deletion
      setTimeout(() => {
        navigate('/inventory/product-list');
      }, 1000);
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete product';
      error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '₹0.00';
    return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format weight
  const formatWeight = (value) => {
    if (!value && value !== 0) return '-';
    return `${parseFloat(value).toFixed(2)}g`;
  };

  // Format dimension
  const formatDimension = (value) => {
    if (!value && value !== 0) return '-';
    return `${parseFloat(value).toFixed(2)}mm`;
  };

  // Format size
  const formatSize = (value) => {
    if (!value && value !== 0) return '-';
    return parseFloat(value).toFixed(1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return dateString;
    }
  };

  // Format custom fields
  const formatCustomFields = (customFields) => {
    if (!customFields) return [];
    if (Array.isArray(customFields)) {
      return customFields;
    }
    if (typeof customFields === 'object') {
      return Object.entries(customFields).map(([key, value]) => ({
        fieldName: key,
        fieldValue: value,
        fieldType: typeof value === 'number' ? 'Number' : 'Text',
      }));
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full space-y-6 p-6">
          <Card className="w-full">
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Product not found
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/inventory/product-list')}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Product List</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const customFields = formatCustomFields(product.customFields);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              <span>Product Details</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
              View complete information about this product
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/inventory/product/${productId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 whitespace-nowrap"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 rounded-lg font-medium text-sm transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/inventory/product-list')}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 rounded-lg font-medium text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/20 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to List</span>
            </button>
          </div>
        </div>

        {/* Main Content - All Fields in One Section */}
        <Card className="w-full">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left side - Product Details */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Item Code
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {product.itemCode || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      RFID Code
                    </label>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                      {product.rfidCode || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Category
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {product.categoryName || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Product Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {product.productName || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Branch
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {product.branchName || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Counter
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {product.counterName || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Design
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {product.designName || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Purity
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {product.purityName || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Status
                    </label>
                    <div>
                      {product.status === 'Active' || product.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Created On
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(product.createdOn)}
                    </p>
                  </div>
                </div>
                
                {/* Right side - Product Image */}
                <div className="lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Product Image
                  </label>
                  {product.imageUrl ? (
                    <div className="w-full">
                      <div className="relative w-full aspect-square max-w-[280px] bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        <img
                          src={product.imageUrl}
                          alt={product.productName || 'Product'}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                          <div className="text-center px-4">
                            <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Image not available
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="relative w-full aspect-square max-w-[280px] bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <div className="text-center px-4 py-6">
                          <Package className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            No Image Available
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Weight & Dimensions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Weight & Dimensions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Gross Weight (g)
                  </label>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatWeight(product.grossWeight)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Net Weight (g)
                  </label>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatWeight(product.netWeight)}
                  </p>
                </div>
                {product.stoneWeight && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Stone Weight (g)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatWeight(product.stoneWeight)}
                    </p>
                  </div>
                )}
                {product.diamondHeight && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Diamond Height (mm)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDimension(product.diamondHeight)}
                    </p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Size
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatSize(product.size)}
                    </p>
                  </div>
                )}
                {product.boxDetails && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Box Details
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {product.boxDetails}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Pricing Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Pricing Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.stoneAmount && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Stone Amount (₹)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.stoneAmount)}
                    </p>
                  </div>
                )}
                {product.diamondAmount && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Diamond Amount (₹)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.diamondAmount)}
                    </p>
                  </div>
                )}
                {product.hallmarkAmount && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Hallmark Amount (₹)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.hallmarkAmount)}
                    </p>
                  </div>
                )}
                {product.makingPerGram && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Making per Gram (₹)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.makingPerGram)}/g
                    </p>
                  </div>
                )}
                {product.makingPercentage && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Making Percentage (%)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {parseFloat(product.makingPercentage).toFixed(2)}%
                    </p>
                  </div>
                )}
                {product.makingFixedAmount && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Making Fixed Amount (₹)
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.makingFixedAmount)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    MRP (₹)
                  </label>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(product.mrp)}
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            {customFields.length > 0 && (
              <>
                {/* Separator */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Custom Fields
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customFields.map((field, index) => (
                      <div key={index}>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {field.fieldName || `Field ${index + 1}`}
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {field.fieldValue || '-'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        </Card>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
};

export default ProductViewPage;
